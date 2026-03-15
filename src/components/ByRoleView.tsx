'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ILSTask, RoleArea } from '@/lib/types';
import { ROLE_AREAS, ROLE_AREA_ORDER } from '@/lib/constants';
import { prioritySortOrder, getEffectiveDueDate } from '@/lib/dateUtils';
import TaskCard from './TaskCard';
import SB13ProgressTracker from './SB13ProgressTracker';

interface ByRoleViewProps {
  tasks: ILSTask[];
  onSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onCompleteRecurring: (id: string) => void;
  onDefer: (id: string, days: number) => void;
}

export default function ByRoleView({ tasks, onSelect, onComplete, onCompleteRecurring, onDefer }: ByRoleViewProps) {
  const grouped = useMemo(() => {
    const map: Record<RoleArea, ILSTask[]> = {} as Record<RoleArea, ILSTask[]>;
    ROLE_AREA_ORDER.forEach((r) => { map[r] = []; });
    tasks.forEach((t) => {
      if (!map[t.role_area]) map[t.role_area] = [];
      map[t.role_area].push(t);
    });
    // Sort within each group
    Object.values(map).forEach((arr) => {
      arr.sort((a, b) => {
        const pa = prioritySortOrder(a.priority);
        const pb = prioritySortOrder(b.priority);
        if (pa !== pb) return pa - pb;
        const da = getEffectiveDueDate(a) || '9999-12-31';
        const db = getEffectiveDueDate(b) || '9999-12-31';
        return da.localeCompare(db);
      });
    });
    return map;
  }, [tasks]);

  const activeCounts = useMemo(() => {
    const counts: Record<RoleArea, number> = {} as Record<RoleArea, number>;
    ROLE_AREA_ORDER.forEach((r) => {
      counts[r] = grouped[r].filter((t) => t.status !== 'complete' && t.status !== 'cancelled').length;
    });
    return counts;
  }, [grouped]);

  // Default: expand sections that have active tasks
  const [expandedSections, setExpandedSections] = useState<Set<RoleArea>>(() => {
    const initial = new Set<RoleArea>();
    ROLE_AREA_ORDER.forEach((r) => {
      if (activeCounts[r] > 0) initial.add(r);
    });
    return initial;
  });

  const toggleSection = (role: RoleArea) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {ROLE_AREA_ORDER.map((role) => {
        const config = ROLE_AREAS[role];
        const Icon = config.icon;
        const roleTasks = grouped[role];
        const activeCount = activeCounts[role];
        const isExpanded = expandedSections.has(role);

        return (
          <div key={role} className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={() => toggleSection(role)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Icon size={18} style={{ color: config.color }} />
              <span className="font-medium text-sm">{config.label}</span>
              <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                activeCount > 0
                  ? `${config.bgColor} ${config.textColor} ${config.darkBgColor} ${config.darkTextColor}`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {activeCount}
              </span>
            </button>

            {isExpanded && roleTasks.length > 0 && (
              <div className="px-4 pb-3 space-y-2">
                {role === 'sb13_compliance' && (
                  <SB13ProgressTracker tasks={roleTasks} />
                )}
                {roleTasks.map((task) => (
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
            )}
          </div>
        );
      })}
    </div>
  );
}
