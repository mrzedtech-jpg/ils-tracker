export type RoleArea =
  | 'library'
  | 'sb13_compliance'
  | 'tech_lessons'
  | 'gt_instruction'
  | 'it_support'
  | 'observations'
  | 'conferences'
  | 'professional_dev'
  | 'hr_admin'
  | 'campus_duties'
  | 'documentation'
  | 'other';

export type TaskType =
  | 'task'
  | 'recurring'
  | 'deadline'
  | 'project'
  | 'event'
  | 'documentation'
  | 'idea';

export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'waiting'
  | 'complete'
  | 'deferred'
  | 'cancelled';

export type Priority = 'urgent' | 'high' | 'normal' | 'low' | 'someday';

export type ViewType = 'my_week' | 'by_role' | 'all_tasks';

export type SortOption =
  | 'due_date'
  | 'priority'
  | 'role_area'
  | 'status'
  | 'created'
  | 'updated';

export interface ILSTask {
  id: string;
  title: string;
  description: string | null;
  role_area: RoleArea;
  task_type: TaskType;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  start_date: string | null;
  completed_date: string | null;
  recurring: boolean;
  recurrence_pattern: string | null;
  last_completed: string | null;
  next_due: string | null;
  school_year: string;
  grading_period: string | null;
  time_of_year: string | null;
  related_teacher: string | null;
  related_classroom: string | null;
  related_students: string | null;
  file_path: string | null;
  url: string | null;
  source: string;
  source_detail: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  archived: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  role_area: RoleArea;
  task_type: TaskType;
  status: TaskStatus;
  priority: Priority;
  due_date: string;
  start_date: string;
  recurring: boolean;
  recurrence_pattern: string;
  school_year: string;
  grading_period: string;
  time_of_year: string;
  related_teacher: string;
  related_classroom: string;
  related_students: string;
  file_path: string;
  url: string;
  notes: string;
  tags: string;
}

export interface OpenBrainThought {
  id: string;
  content: string;
  metadata: {
    type: string;
    topics: string[];
    people?: string[];
    action_items?: string[];
    dates_mentioned?: string[];
    source?: string;
  };
  created_at: string;
}

export type AnnouncementCategory =
  | 'urgent_notice'
  | 'happening_today'
  | 'recurring_today'
  | 'advance_notice'
  | 'tagged_announcement'
  | 'open_brain';

export interface Announcement {
  id: string;
  category: AnnouncementCategory;
  text: string;
  sourceTaskId: string | null;
  sourceThoughtId: string | null;
  roleArea: RoleArea | null;
  priority: Priority;
}

export const EMPTY_TASK_FORM: TaskFormData = {
  title: '',
  description: '',
  role_area: 'other',
  task_type: 'task',
  status: 'not_started',
  priority: 'normal',
  due_date: '',
  start_date: '',
  recurring: false,
  recurrence_pattern: '',
  school_year: '2025-2026',
  grading_period: '',
  time_of_year: '',
  related_teacher: '',
  related_classroom: '',
  related_students: '',
  file_path: '',
  url: '',
  notes: '',
  tags: '',
};
