import type { ILSTask, OpenBrainThought, Announcement, AnnouncementCategory, RoleArea } from './types';
import { ROLE_AREAS, CAMPUS_VISIBLE_ROLES } from './constants';
import { getEffectiveDueDate, todayStr, isDueThisWeek, getDayOfWeekName, prioritySortOrder } from './dateUtils';

const CATEGORY_PRIORITY: Record<AnnouncementCategory, number> = {
  urgent_notice: 0,
  happening_today: 1,
  recurring_today: 2,
  tagged_announcement: 3,
  open_brain: 4,
  advance_notice: 5,
};

function isActive(task: ILSTask): boolean {
  return task.status !== 'complete' && task.status !== 'cancelled' && !task.archived;
}

function isCampusVisible(role: RoleArea): boolean {
  return CAMPUS_VISIBLE_ROLES.includes(role);
}

function formatContext(task: ILSTask): string {
  const parts: string[] = [];
  if (task.related_classroom) parts.push(task.related_classroom);
  if (task.related_teacher) parts.push(`with ${task.related_teacher}`);
  return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

export function generateAnnouncements(tasks: ILSTask[], thoughts: OpenBrainThought[] = []): Announcement[] {
  const today = todayStr();
  const seen = new Set<string>();
  const results: Announcement[] = [];

  function addAnnouncement(
    task: ILSTask,
    category: AnnouncementCategory,
    text: string,
  ) {
    if (seen.has(task.id)) return;
    seen.add(task.id);
    results.push({
      id: `${task.id}-${category}`,
      category,
      text,
      sourceTaskId: task.id,
      sourceThoughtId: null,
      roleArea: task.role_area,
      priority: task.priority,
    });
  }

  // Process in category priority order so dedup favors higher-priority categories

  // 1. Urgent notices — urgent/high priority, campus-visible roles
  for (const task of tasks) {
    if (!isActive(task)) continue;
    if (task.priority !== 'urgent' && task.priority !== 'high') continue;
    if (!isCampusVisible(task.role_area) && !task.tags?.includes('announcement')) continue;

    const prefix = task.priority === 'urgent' ? 'Important' : 'Heads up';
    const desc = task.description ? ` — ${truncate(task.description, 80)}` : '';
    addAnnouncement(task, 'urgent_notice', `${prefix}: ${task.title}${desc}.`);
  }

  // 2. Happening today — tasks/events due today in campus-visible roles
  for (const task of tasks) {
    if (!isActive(task)) continue;
    const dueDate = getEffectiveDueDate(task);
    if (dueDate !== today) continue;
    if (!isCampusVisible(task.role_area) && !task.tags?.includes('announcement')) continue;
    if (task.recurring) continue; // handled in recurring_today

    const roleLabel = ROLE_AREAS[task.role_area].label;
    if (task.task_type === 'event') {
      addAnnouncement(task, 'happening_today', `Reminder: ${task.title} is today${formatContext(task)}.`);
    } else {
      addAnnouncement(task, 'happening_today', `${roleLabel}: ${task.title} is due today${formatContext(task)}.`);
    }
  }

  // 3. Recurring today — recurring tasks scheduled for today
  for (const task of tasks) {
    if (!isActive(task)) continue;
    if (!task.recurring) continue;
    const dueDate = getEffectiveDueDate(task);
    if (dueDate !== today) continue;
    if (!isCampusVisible(task.role_area) && !task.tags?.includes('announcement')) continue;

    const roleLabel = ROLE_AREAS[task.role_area].label;
    const detail = task.description ? ` — ${truncate(task.description, 60)}` : '';
    addAnnouncement(task, 'recurring_today', `${roleLabel}: ${task.title}${formatContext(task)}${detail}.`);
  }

  // 4. Tagged announcements — any task tagged "announcement"
  for (const task of tasks) {
    if (!isActive(task)) continue;
    if (!task.tags?.includes('announcement')) continue;

    const desc = task.description ? ` ${truncate(task.description, 80)}` : '';
    addAnnouncement(task, 'tagged_announcement', `${task.title}.${desc}`);
  }

  // 5. Advance notice — events/deadlines due this week (not today)
  for (const task of tasks) {
    if (!isActive(task)) continue;
    const dueDate = getEffectiveDueDate(task);
    if (!dueDate || dueDate === today) continue;
    if (task.task_type !== 'event' && task.task_type !== 'deadline') continue;
    if (!isDueThisWeek(task)) continue;
    if (!isCampusVisible(task.role_area) && !task.tags?.includes('announcement')) continue;

    const dayName = getDayOfWeekName(dueDate);
    addAnnouncement(task, 'advance_notice', `Coming up ${dayName}: ${task.title}${formatContext(task)}.`);
  }

  // 6. Open Brain thoughts — school-related tasks/reminders from the thoughts database
  for (const thought of thoughts) {
    const meta = thought.metadata;
    if (!meta) continue;

    // Extract the first sentence or up to 120 chars as announcement text
    const content = thought.content;
    const firstSentence = content.split(/[.!?]\s/)[0];
    const text = truncate(firstSentence, 120);

    // Check for action items — those make better announcements
    const hasActions = meta.action_items && meta.action_items.length > 0;
    const isTask = meta.type === 'task';

    // Check if thought mentions today or has relevant dates
    const mentionsToday = meta.dates_mentioned?.includes(today);
    const hasRelevantTopics = meta.topics?.some((t: string) =>
      ['announcement', 'campus duty', 'attendance', 'book fair', 'school event', 'library', 'assembly'].some(
        (keyword) => t.toLowerCase().includes(keyword)
      )
    );

    if (isTask || hasActions || mentionsToday || hasRelevantTopics) {
      const seenKey = `thought-${thought.id}`;
      if (!seen.has(seenKey)) {
        seen.add(seenKey);
        results.push({
          id: `${thought.id}-open_brain`,
          category: 'open_brain',
          text: `${text}.`,
          sourceTaskId: null,
          sourceThoughtId: thought.id,
          roleArea: null,
          priority: mentionsToday ? 'high' : 'normal',
        });
      }
    }
  }

  // Sort by category priority, then by task priority within each category
  results.sort((a, b) => {
    const catDiff = CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category];
    if (catDiff !== 0) return catDiff;
    return prioritySortOrder(a.priority) - prioritySortOrder(b.priority);
  });

  return results;
}

export function formatAnnouncementScript(announcements: Announcement[]): string {
  if (announcements.length === 0) return '';

  const lines = announcements.map((a) => `  \u2022 ${a.text}`).join('\n');
  return `Good morning! Here are today's announcements:\n\n${lines}\n\nHave a great day!`;
}
