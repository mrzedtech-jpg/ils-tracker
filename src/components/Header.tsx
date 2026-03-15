'use client';

import { BookOpen, RefreshCw, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import type { ILSTask } from '@/lib/types';
import { isOverdue, isDueThisWeek, isDueToday } from '@/lib/dateUtils';
import { CURRENT_SCHOOL_YEAR } from '@/lib/constants';

interface HeaderProps {
  tasks: ILSTask[];
  isDark: boolean;
  toggleDark: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function Header({ tasks, isDark, toggleDark, onRefresh, loading }: HeaderProps) {
  const overdueCount = tasks.filter(isOverdue).length;
  const dueThisWeekCount = tasks.filter(isDueThisWeek).length + tasks.filter(isDueToday).length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen size={24} className="text-blue-600" />
              <h1 className="text-xl font-bold">ILS Tracker</h1>
            </div>
            <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {CURRENT_SCHOOL_YEAR}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-3 text-xs mr-2">
              {overdueCount > 0 && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                  <AlertTriangle size={14} />
                  {overdueCount} overdue
                </span>
              )}
              {dueThisWeekCount > 0 && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Clock size={14} />
                  {dueThisWeekCount} due this week
                </span>
              )}
              <span className="text-blue-600 dark:text-blue-400">
                {inProgressCount} in progress
              </span>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Refresh"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            </button>
            <DarkModeToggle isDark={isDark} toggle={toggleDark} />
          </div>
        </div>
      </div>
    </header>
  );
}
