'use client';

import { RefreshCw } from 'lucide-react';
import type { ILSTask } from '@/lib/types';
import { calculateNextDue, formatSmartDate } from '@/lib/dateUtils';

interface RecurringCompleteDialogProps {
  task: ILSTask;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RecurringCompleteDialog({ task, onConfirm, onCancel }: RecurringCompleteDialogProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const nextDue = calculateNextDue(task.recurrence_pattern, todayStr);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold">Recurring Task</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Mark this occurrence complete and schedule next?
        </p>
        <p className="text-sm mb-4">
          <span className="font-medium">{task.title}</span>
          <br />
          <span className="text-gray-500 dark:text-gray-400">
            Pattern: {task.recurrence_pattern || 'weekly'}
          </span>
          <br />
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Next due: {formatSmartDate(nextDue)}
          </span>
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete & Schedule Next
          </button>
        </div>
      </div>
    </div>
  );
}
