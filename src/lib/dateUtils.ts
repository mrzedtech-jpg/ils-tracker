import type { ILSTask } from './types';

function toLocalDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

function todayStr(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function today(): Date {
  return toLocalDate(todayStr());
}

export function getEffectiveDueDate(task: ILSTask): string | null {
  if (task.recurring && task.next_due) return task.next_due;
  return task.due_date;
}

export function isOverdue(task: ILSTask): boolean {
  if (task.status === 'complete' || task.status === 'cancelled') return false;
  const dueDate = getEffectiveDueDate(task);
  if (!dueDate) return false;
  return toLocalDate(dueDate) < today();
}

export function isDueToday(task: ILSTask): boolean {
  if (task.status === 'complete' || task.status === 'cancelled') return false;
  const dueDate = getEffectiveDueDate(task);
  if (!dueDate) return false;
  return dueDate === todayStr();
}

export function isDueThisWeek(task: ILSTask): boolean {
  if (task.status === 'complete' || task.status === 'cancelled') return false;
  const dueDate = getEffectiveDueDate(task);
  if (!dueDate) return false;
  const due = toLocalDate(dueDate);
  const t = today();
  const { end } = getWeekBounds();
  return due > t && due <= end;
}

export function isDueNextTwoWeeks(task: ILSTask): boolean {
  if (task.status === 'complete' || task.status === 'cancelled') return false;
  const dueDate = getEffectiveDueDate(task);
  if (!dueDate) return false;
  const due = toLocalDate(dueDate);
  const { end } = getWeekBounds();
  const twoWeeksOut = new Date(end);
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
  return due > end && due <= twoWeeksOut;
}

export function getWeekBounds(): { start: Date; end: Date } {
  const t = today();
  const day = t.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(t);
  start.setDate(t.getDate() + diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

export function formatSmartDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = toLocalDate(dateStr);
  const t = today();
  const diffMs = date.getTime() - t.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `Overdue (${Math.abs(diffDays)} days)`;
  if (diffDays <= 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateNextDue(recurrencePattern: string | null, fromDate?: string): string {
  const from = fromDate ? toLocalDate(fromDate) : today();
  if (!recurrencePattern) {
    from.setDate(from.getDate() + 7);
    return from.toISOString().split('T')[0];
  }

  const pattern = recurrencePattern.toLowerCase().trim();

  if (pattern === 'weekly') {
    from.setDate(from.getDate() + 7);
  } else if (pattern === 'biweekly' || pattern === 'every 2 weeks') {
    from.setDate(from.getDate() + 14);
  } else if (pattern === 'monthly') {
    from.setMonth(from.getMonth() + 1);
  } else if (pattern === 'quarterly' || pattern === 'every quarter') {
    from.setMonth(from.getMonth() + 3);
  } else if (pattern === 'annually' || pattern === 'yearly') {
    from.setFullYear(from.getFullYear() + 1);
  } else if (pattern === 'daily') {
    from.setDate(from.getDate() + 1);
  } else if (pattern === 'ongoing') {
    from.setDate(from.getDate() + 7);
  } else {
    const match = pattern.match(/every\s+(\d+)\s+weeks?/);
    if (match) {
      from.setDate(from.getDate() + parseInt(match[1]) * 7);
    } else {
      from.setDate(from.getDate() + 7);
    }
  }

  return from.toISOString().split('T')[0];
}

export function prioritySortOrder(priority: string): number {
  const order: Record<string, number> = {
    urgent: 0,
    high: 1,
    normal: 2,
    low: 3,
    someday: 4,
  };
  return order[priority] ?? 2;
}
