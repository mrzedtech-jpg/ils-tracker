'use client';

import { useMemo } from 'react';
import type { ILSTask } from '@/lib/types';
import { isOverdue, isDueToday, isDueThisWeek, isDueNextTwoWeeks, prioritySortOrder, getEffectiveDueDate } from '@/lib/dateUtils';
import TaskCard from './TaskCard';

interface MyWeekViewProps {
  tasks: ILSTask[];
  onSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onCompleteRecurring: (id: string) => void;
  onDefer: (id: string, days: number) => void;
}

function sortByPriorityThenDue(a: ILSTask, b: ILSTask): number {
  const pa = prioritySortOrder(a.priority);
  const pb = prioritySortOrder(b.priority);
  if (pa !== pb) return pa - pb;
  const da = getEffectiveDueDate(a) || '9999-12-31';
  const db = getEffectiveDueDate(b) || '9999-12-31';
  return da.localeCompare(db);
}

export default function MyWeekView({ tasks, onSelect, onComplete, onCompleteRecurring, onDefer }: MyWeekViewProps) {
  const activeTasks = useMemo(() =>
    tasks.filter((t) => t.status !== 'complete' && t.status !== 'cancelled'),
    [tasks]
  );

  const todaySection = useMemo(() =>
    activeTasks.filter((t) => isOverdue(t) || isDueToday(t)).sort(sortByPriorityThenDue),
    [activeTasks]
  );

  const thisWeekSection = useMemo(() =>
    activeTasks.filter((t) => isDueThisWeek(t) && !isDueToday(t)).sort(sortByPriorityThenDue),
    [activeTasks]
  );

  const upNextSection = useMemo(() =>
    activeTasks.filter((t) => isDueNextTwoWeeks(t)).sort(sortByPriorityThenDue),
    [activeTasks]
  );

  const renderSection = (title: string, sectionTasks: ILSTask[], emptyMessage: string) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </h2>
        {sectionTasks.length > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-full">
            {sectionTasks.length}
          </span>
        )}
      </div>
      {sectionTasks.length > 0 ? (
        <div className="space-y-2">
          {sectionTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={onSelect}
              onComplete={onComplete}
              onCompleteRecurring={onCompleteRecurring}
              onDefer={onDefer}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic px-1">{emptyMessage}</p>
      )}
    </div>
  );

  return (
    <div>
      {renderSection('Today', todaySection, 'Nothing due today — nice!')}
      {renderSection('This Week', thisWeekSection, 'Clear for the rest of the week')}
      {renderSection('Up Next', upNextSection, 'Nothing upcoming in the next 2 weeks')}
    </div>
  );
}
