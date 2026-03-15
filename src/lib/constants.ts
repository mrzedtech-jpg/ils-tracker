import {
  BookOpen,
  Scale,
  Monitor,
  Brain,
  Wrench,
  Eye,
  Mic,
  GraduationCap,
  ClipboardList,
  School,
  FileText,
  Pin,
  type LucideIcon,
} from 'lucide-react';
import type { RoleArea, TaskStatus, Priority, TaskType, AnnouncementCategory } from './types';

export interface RoleAreaConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
  borderColor: string;
}

export const ROLE_AREAS: Record<RoleArea, RoleAreaConfig> = {
  library: {
    label: 'Library',
    icon: BookOpen,
    color: '#D97706',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    darkBgColor: 'dark:bg-amber-950',
    darkTextColor: 'dark:text-amber-300',
    borderColor: 'border-amber-500',
  },
  sb13_compliance: {
    label: 'SB 13 Compliance',
    icon: Scale,
    color: '#DC2626',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    darkBgColor: 'dark:bg-red-950',
    darkTextColor: 'dark:text-red-300',
    borderColor: 'border-red-500',
  },
  tech_lessons: {
    label: 'Tech Lessons',
    icon: Monitor,
    color: '#2563EB',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    darkBgColor: 'dark:bg-blue-950',
    darkTextColor: 'dark:text-blue-300',
    borderColor: 'border-blue-500',
  },
  gt_instruction: {
    label: 'GT Instruction',
    icon: Brain,
    color: '#7C3AED',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    darkBgColor: 'dark:bg-violet-950',
    darkTextColor: 'dark:text-violet-300',
    borderColor: 'border-violet-500',
  },
  it_support: {
    label: 'IT Support',
    icon: Wrench,
    color: '#0D9488',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    darkBgColor: 'dark:bg-teal-950',
    darkTextColor: 'dark:text-teal-300',
    borderColor: 'border-teal-500',
  },
  observations: {
    label: 'Observations',
    icon: Eye,
    color: '#059669',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    darkBgColor: 'dark:bg-emerald-950',
    darkTextColor: 'dark:text-emerald-300',
    borderColor: 'border-emerald-500',
  },
  conferences: {
    label: 'Conferences',
    icon: Mic,
    color: '#4F46E5',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    darkBgColor: 'dark:bg-indigo-950',
    darkTextColor: 'dark:text-indigo-300',
    borderColor: 'border-indigo-500',
  },
  professional_dev: {
    label: 'Professional Dev',
    icon: GraduationCap,
    color: '#0891B2',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    darkBgColor: 'dark:bg-cyan-950',
    darkTextColor: 'dark:text-cyan-300',
    borderColor: 'border-cyan-500',
  },
  hr_admin: {
    label: 'HR / Admin',
    icon: ClipboardList,
    color: '#475569',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    darkBgColor: 'dark:bg-slate-900',
    darkTextColor: 'dark:text-slate-300',
    borderColor: 'border-slate-500',
  },
  campus_duties: {
    label: 'Campus Duties',
    icon: School,
    color: '#E11D48',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    darkBgColor: 'dark:bg-rose-950',
    darkTextColor: 'dark:text-rose-300',
    borderColor: 'border-rose-500',
  },
  documentation: {
    label: 'Documentation',
    icon: FileText,
    color: '#78716C',
    bgColor: 'bg-stone-50',
    textColor: 'text-stone-700',
    darkBgColor: 'dark:bg-stone-900',
    darkTextColor: 'dark:text-stone-300',
    borderColor: 'border-stone-500',
  },
  other: {
    label: 'Other',
    icon: Pin,
    color: '#9CA3AF',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    darkBgColor: 'dark:bg-gray-900',
    darkTextColor: 'dark:text-gray-400',
    borderColor: 'border-gray-400',
  },
};

export interface PriorityConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
}

export const PRIORITIES: Record<Priority, PriorityConfig> = {
  urgent: {
    label: 'Urgent',
    color: '#DC2626',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    darkBgColor: 'dark:bg-red-900',
    darkTextColor: 'dark:text-red-200',
  },
  high: {
    label: 'High',
    color: '#EA580C',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    darkBgColor: 'dark:bg-orange-900',
    darkTextColor: 'dark:text-orange-200',
  },
  normal: {
    label: 'Normal',
    color: '#2563EB',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    darkBgColor: 'dark:bg-blue-950',
    darkTextColor: 'dark:text-blue-300',
  },
  low: {
    label: 'Low',
    color: '#6B7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    darkBgColor: 'dark:bg-gray-800',
    darkTextColor: 'dark:text-gray-400',
  },
  someday: {
    label: 'Someday',
    color: '#9CA3AF',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    darkBgColor: 'dark:bg-gray-900',
    darkTextColor: 'dark:text-gray-500',
  },
};

export interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  darkBgColor: string;
  darkTextColor: string;
}

export const STATUSES: Record<TaskStatus, StatusConfig> = {
  not_started: {
    label: 'Not Started',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    darkBgColor: 'dark:bg-gray-800',
    darkTextColor: 'dark:text-gray-400',
  },
  in_progress: {
    label: 'In Progress',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    darkBgColor: 'dark:bg-blue-900',
    darkTextColor: 'dark:text-blue-300',
  },
  waiting: {
    label: 'Waiting',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    darkBgColor: 'dark:bg-amber-900',
    darkTextColor: 'dark:text-amber-300',
  },
  complete: {
    label: 'Complete',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    darkBgColor: 'dark:bg-green-900',
    darkTextColor: 'dark:text-green-300',
  },
  deferred: {
    label: 'Deferred',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    darkBgColor: 'dark:bg-yellow-900',
    darkTextColor: 'dark:text-yellow-300',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-500 line-through',
    darkBgColor: 'dark:bg-gray-800',
    darkTextColor: 'dark:text-gray-500 dark:line-through',
  },
};

export const TASK_TYPES: Record<TaskType, string> = {
  task: 'Task',
  recurring: 'Recurring',
  deadline: 'Deadline',
  project: 'Project',
  event: 'Event',
  documentation: 'Documentation',
  idea: 'Idea',
};

export const CURRENT_SCHOOL_YEAR = '2025-2026';

export const SCHOOL_NAME = 'Wildcats';

export const CAMPUS_VISIBLE_ROLES: RoleArea[] = [
  'library',
  'tech_lessons',
  'gt_instruction',
  'it_support',
  'observations',
  'campus_duties',
  'conferences',
];

export const ANNOUNCEMENT_CATEGORY_ORDER: AnnouncementCategory[] = [
  'urgent_notice',
  'happening_today',
  'recurring_today',
  'tagged_announcement',
  'open_brain',
  'advance_notice',
];

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  urgent_notice: 'Urgent',
  happening_today: 'Today',
  recurring_today: 'Scheduled',
  advance_notice: 'Coming Up',
  tagged_announcement: 'Announcement',
  open_brain: 'From Open Brain',
};

export const ROLE_AREA_ORDER: RoleArea[] = [
  'library',
  'sb13_compliance',
  'tech_lessons',
  'gt_instruction',
  'it_support',
  'observations',
  'conferences',
  'professional_dev',
  'hr_admin',
  'campus_duties',
  'documentation',
  'other',
];
