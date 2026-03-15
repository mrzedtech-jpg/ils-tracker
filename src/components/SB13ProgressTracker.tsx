'use client';

import { useMemo } from 'react';
import type { ILSTask } from '@/lib/types';
import { STATUSES } from '@/lib/constants';

interface SB13ProgressTrackerProps {
  tasks: ILSTask[];
}

interface TeacherSummary {
  teacher: string;
  status: string;
  isbnCount: number | null;
  blocker: string;
}

function extractISBNCount(description: string | null): number | null {
  if (!description) return null;
  const match = description.match(/(\d+)\+?\s*ISBNs?/i);
  return match ? parseInt(match[1]) : null;
}

function extractBlocker(description: string | null): string {
  if (!description) return '';
  const sentences = description.split('. ');
  const blockerSentence = sentences.find((s) =>
    /key (issue|finding)|recommend|need|fix|problematic/i.test(s)
  );
  return blockerSentence ? blockerSentence.slice(0, 80) + (blockerSentence.length > 80 ? '...' : '') : '';
}

export default function SB13ProgressTracker({ tasks }: SB13ProgressTrackerProps) {
  const teachers = useMemo((): TeacherSummary[] => {
    return tasks
      .filter((t) => t.related_teacher)
      .map((t) => ({
        teacher: t.related_teacher!,
        status: t.status,
        isbnCount: extractISBNCount(t.description),
        blocker: extractBlocker(t.description),
      }))
      .sort((a, b) => a.teacher.localeCompare(b.teacher));
  }, [tasks]);

  const completed = teachers.filter((t) => t.status === 'complete').length;
  const total = teachers.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="mb-4 p-4 rounded-lg bg-red-50/50 dark:bg-red-950/30 border border-red-100 dark:border-red-900">
      <h3 className="text-sm font-semibold mb-3">Campus Progress</h3>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-sm font-medium shrink-0">
          {completed}/{total} complete
        </span>
      </div>

      {/* Teacher grid */}
      <div className="space-y-2">
        {teachers.map((t) => {
          const statusConfig = STATUSES[t.status as keyof typeof STATUSES];
          return (
            <div
              key={t.teacher}
              className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-gray-800/50"
            >
              <span className="font-medium text-sm min-w-[90px]">{t.teacher}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.darkBgColor} ${statusConfig.darkTextColor}`}>
                {statusConfig.label}
              </span>
              {t.isbnCount && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t.isbnCount} ISBNs
                </span>
              )}
              {t.blocker && t.status !== 'complete' && (
                <span className="text-xs text-gray-400 dark:text-gray-500 truncate hidden sm:inline">
                  {t.blocker}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
