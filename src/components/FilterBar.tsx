'use client';

import { X } from 'lucide-react';
import type { RoleArea, TaskStatus, Priority, SortOption } from '@/lib/types';
import { ROLE_AREAS, STATUSES, PRIORITIES, ROLE_AREA_ORDER } from '@/lib/constants';

export interface FilterState {
  roleAreas: RoleArea[];
  statuses: TaskStatus[];
  priorities: Priority[];
  showCompleted: boolean;
  showArchived: boolean;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  roleAreas: [],
  statuses: [],
  priorities: [],
  showCompleted: false,
  showArchived: false,
  sortBy: 'due_date',
};

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasActiveFilters = filters.roleAreas.length > 0 || filters.statuses.length > 0 || filters.priorities.length > 0;

  const toggleRoleArea = (r: RoleArea) => {
    const next = filters.roleAreas.includes(r)
      ? filters.roleAreas.filter((x) => x !== r)
      : [...filters.roleAreas, r];
    onChange({ ...filters, roleAreas: next });
  };

  const toggleStatus = (s: TaskStatus) => {
    const next = filters.statuses.includes(s)
      ? filters.statuses.filter((x) => x !== s)
      : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };

  const togglePriority = (p: Priority) => {
    const next = filters.priorities.includes(p)
      ? filters.priorities.filter((x) => x !== p)
      : [...filters.priorities, p];
    onChange({ ...filters, priorities: next });
  };

  return (
    <div className="space-y-3">
      {/* Sort + toggles row */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
          className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="due_date">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="role_area">Sort: Role Area</option>
          <option value="status">Sort: Status</option>
          <option value="created">Sort: Created</option>
          <option value="updated">Sort: Updated</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showCompleted}
            onChange={(e) => onChange({ ...filters, showCompleted: e.target.checked })}
            className="rounded"
          />
          Show completed
        </label>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {ROLE_AREA_ORDER.map((r) => {
          const config = ROLE_AREAS[r];
          const selected = filters.roleAreas.includes(r);
          return (
            <button
              key={r}
              onClick={() => toggleRoleArea(r)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                selected
                  ? `${config.bgColor} ${config.textColor} border-current ${config.darkBgColor} ${config.darkTextColor}`
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(STATUSES) as TaskStatus[]).filter((s) => s !== 'cancelled').map((s) => {
          const config = STATUSES[s];
          const selected = filters.statuses.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                selected
                  ? `${config.bgColor} ${config.textColor} border-current ${config.darkBgColor} ${config.darkTextColor}`
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(PRIORITIES) as Priority[]).map((p) => {
          const config = PRIORITIES[p];
          const selected = filters.priorities.includes(p);
          return (
            <button
              key={p}
              onClick={() => togglePriority(p)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                selected
                  ? `${config.bgColor} ${config.textColor} border-current ${config.darkBgColor} ${config.darkTextColor}`
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          <button
            onClick={() => onChange({ ...filters, roleAreas: [], statuses: [], priorities: [] })}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        </div>
      )}
    </div>
  );
}
