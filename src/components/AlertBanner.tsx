'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import type { ILSTask } from '@/lib/types';
import { isOverdue, isDueToday, isDueThisWeek, formatSmartDate, getEffectiveDueDate } from '@/lib/dateUtils';

interface AlertBannerProps {
  tasks: ILSTask[];
  onTaskClick: (id: string) => void;
}

export default function AlertBanner({ tasks, onTaskClick }: AlertBannerProps) {
  const [expanded, setExpanded] = useState(true);
  const overdueTasks = tasks.filter(isOverdue);
  const dueTodayTasks = tasks.filter(isDueToday);
  const dueThisWeekTasks = tasks.filter(isDueThisWeek);

  const totalAlerts = overdueTasks.length + dueTodayTasks.length + dueThisWeekTasks.length;
  if (totalAlerts === 0) return null;

  return (
    <div className="mx-4 mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium"
      >
        <div className="flex items-center gap-3 flex-wrap">
          {overdueTasks.length > 0 && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <AlertTriangle size={14} />
              {overdueTasks.length} overdue
            </span>
          )}
          {dueTodayTasks.length > 0 && (
            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Clock size={14} />
              {dueTodayTasks.length} due today
            </span>
          )}
          {dueThisWeekTasks.length > 0 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <CalendarDays size={14} />
              {dueThisWeekTasks.length} due this week
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-1">
          {overdueTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span className="truncate font-medium">{task.title}</span>
              <span className="ml-auto text-xs text-red-500 shrink-0">
                {formatSmartDate(getEffectiveDueDate(task))}
              </span>
            </button>
          ))}
          {dueTodayTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span className="truncate font-medium">{task.title}</span>
              <span className="ml-auto text-xs text-orange-500 shrink-0">Today</span>
            </button>
          ))}
          {dueThisWeekTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="truncate font-medium">{task.title}</span>
              <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 shrink-0">
                {formatSmartDate(getEffectiveDueDate(task))}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
