'use client';

import { useState, useMemo } from 'react';
import { Megaphone, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import type { ILSTask } from '@/lib/types';
import { ROLE_AREAS, ANNOUNCEMENT_CATEGORY_LABELS } from '@/lib/constants';
import { generateAnnouncements, formatAnnouncementScript } from '@/lib/announcementUtils';

interface AnnouncementsBannerProps {
  tasks: ILSTask[];
  onTaskClick: (id: string) => void;
  onCopySuccess: () => void;
}

function isMorning(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 10;
}

export default function AnnouncementsBanner({ tasks, onTaskClick, onCopySuccess }: AnnouncementsBannerProps) {
  const [expanded, setExpanded] = useState(isMorning);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const announcements = useMemo(() => generateAnnouncements(tasks), [tasks]);

  const undismissedCount = announcements.filter((a) => !dismissedIds.has(a.id)).length;

  if (announcements.length === 0) return null;

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const undismissed = announcements.filter((a) => !dismissedIds.has(a.id));
    const script = formatAnnouncementScript(undismissed);
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  // Group announcements by category for display
  let lastCategory = '';

  return (
    <div className="mx-4 mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Megaphone size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Recommended Announcements
          </span>
          {undismissedCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full">
              {undismissedCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {expanded && (
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          )}
          {expanded ? (
            <ChevronUp size={16} className="text-indigo-500" />
          ) : (
            <ChevronDown size={16} className="text-indigo-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 pt-1 space-y-0.5">
          {announcements.map((announcement) => {
            const isDismissed = dismissedIds.has(announcement.id);
            const roleColor = ROLE_AREAS[announcement.roleArea].color;
            const showCategory = announcement.category !== lastCategory;
            lastCategory = announcement.category;

            return (
              <div key={announcement.id}>
                {showCategory && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-2 mb-0.5 px-3">
                    {ANNOUNCEMENT_CATEGORY_LABELS[announcement.category]}
                  </p>
                )}
                <div
                  onClick={() => onTaskClick(announcement.sourceTaskId)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-colors flex items-center gap-2.5 group cursor-pointer ${
                    isDismissed ? 'opacity-50' : ''
                  }`}
                >
                  {/* Dismiss checkbox */}
                  <button
                    onClick={(e) => handleDismiss(announcement.id, e)}
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      isDismissed
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    {isDismissed && <Check size={10} />}
                  </button>

                  {/* Role color dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: roleColor }}
                  />

                  {/* Announcement text */}
                  <span
                    className={`flex-1 ${
                      isDismissed
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {announcement.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
