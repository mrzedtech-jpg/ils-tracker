'use client';

import { useState } from 'react';
import { Check, Clock, Pencil, User, RefreshCw } from 'lucide-react';
import type { ILSTask } from '@/lib/types';
import { ROLE_AREAS, PRIORITIES, STATUSES } from '@/lib/constants';
import { formatSmartDate, getEffectiveDueDate, isOverdue } from '@/lib/dateUtils';
import RecurringCompleteDialog from './RecurringCompleteDialog';

interface TaskCardProps {
  task: ILSTask;
  onSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onCompleteRecurring: (id: string) => void;
  onDefer: (id: string, days: number) => void;
}

export default function TaskCard({
  task,
  onSelect,
  onComplete,
  onCompleteRecurring,
  onDefer,
}: TaskCardProps) {
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [showDeferOptions, setShowDeferOptions] = useState(false);

  const roleConfig = ROLE_AREAS[task.role_area];
  const RoleIcon = roleConfig.icon;
  const priorityConfig = PRIORITIES[task.priority];
  const statusConfig = STATUSES[task.status];
  const effectiveDue = getEffectiveDueDate(task);
  const overdue = isOverdue(task);
  const isComplete = task.status === 'complete';

  const handleCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isComplete) return;
    if (task.recurring) {
      setShowRecurringDialog(true);
    } else {
      onComplete(task.id);
    }
  };

  const handleDefer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeferOptions(!showDeferOptions);
  };

  return (
    <>
      <div
        onClick={() => onSelect(task.id)}
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
          isComplete ? 'opacity-60' : ''
        }`}
      >
        {/* Colored left border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: roleConfig.color }}
        />

        <div className="pl-4 pr-3 py-3 flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleCheckbox}
            className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isComplete
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
            }`}
            style={{ minWidth: 24, minHeight: 24 }}
          >
            {isComplete && <Check size={14} />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-sm leading-snug ${isComplete ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>

              {/* Quick actions */}
              <div className="flex items-center gap-1 shrink-0">
                {task.recurring && (
                  <RefreshCw size={14} className="text-blue-500" />
                )}
                {!isComplete && effectiveDue && (
                  <div className="relative">
                    <button
                      onClick={handleDefer}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Defer"
                    >
                      <Clock size={14} className="text-gray-400" />
                    </button>
                    {showDeferOptions && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 py-1 min-w-[100px]">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDefer(task.id, 1); setShowDeferOptions(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          +1 day
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDefer(task.id, 7); setShowDeferOptions(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          +1 week
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(task.id); }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Edit"
                >
                  <Pencil size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Role badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleConfig.bgColor} ${roleConfig.textColor} ${roleConfig.darkBgColor} ${roleConfig.darkTextColor}`}>
                <RoleIcon size={12} />
                {roleConfig.label}
              </span>

              {/* Priority badge (only if not normal) */}
              {task.priority !== 'normal' && (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.darkBgColor} ${priorityConfig.darkTextColor} ${task.priority === 'urgent' ? 'animate-pulse-urgent' : ''}`}>
                  {priorityConfig.label}
                </span>
              )}

              {/* Status chip */}
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.darkBgColor} ${statusConfig.darkTextColor}`}>
                {statusConfig.label}
              </span>

              {/* Due date */}
              {effectiveDue && (
                <span className={`text-xs ${overdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formatSmartDate(effectiveDue)}
                </span>
              )}
            </div>

            {/* Teacher */}
            {task.related_teacher && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                <User size={12} />
                {task.related_teacher}
              </div>
            )}

            {/* Description preview */}
            {task.description && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {task.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
                {task.tags.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-700 text-gray-400">
                    +{task.tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRecurringDialog && (
        <RecurringCompleteDialog
          task={task}
          onConfirm={() => {
            onCompleteRecurring(task.id);
            setShowRecurringDialog(false);
          }}
          onCancel={() => setShowRecurringDialog(false)}
        />
      )}
    </>
  );
}
