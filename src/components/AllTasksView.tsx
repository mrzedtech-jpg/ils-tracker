'use client';

import { useState, useMemo } from 'react';
import type { ILSTask } from '@/lib/types';
import { prioritySortOrder, getEffectiveDueDate } from '@/lib/dateUtils';
import SearchBar from './SearchBar';
import FilterBar, { type FilterState, DEFAULT_FILTERS } from './FilterBar';
import TaskCard from './TaskCard';

interface AllTasksViewProps {
  tasks: ILSTask[];
  onSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onCompleteRecurring: (id: string) => void;
  onDefer: (id: string, days: number) => void;
}

export default function AllTasksView({ tasks, onSelect, onComplete, onCompleteRecurring, onDefer }: AllTasksViewProps) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q) ||
        t.related_teacher?.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Role area filter
    if (filters.roleAreas.length > 0) {
      result = result.filter((t) => filters.roleAreas.includes(t.role_area));
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter((t) => filters.statuses.includes(t.status));
    }

    // Priority filter
    if (filters.priorities.length > 0) {
      result = result.filter((t) => filters.priorities.includes(t.priority));
    }

    // Show/hide completed
    if (!filters.showCompleted) {
      result = result.filter((t) => t.status !== 'complete');
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'due_date': {
          const da = getEffectiveDueDate(a) || '9999-12-31';
          const db = getEffectiveDueDate(b) || '9999-12-31';
          return da.localeCompare(db);
        }
        case 'priority':
          return prioritySortOrder(a.priority) - prioritySortOrder(b.priority);
        case 'role_area':
          return a.role_area.localeCompare(b.role_area);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'created':
          return b.created_at.localeCompare(a.created_at);
        case 'updated':
          return b.updated_at.localeCompare(a.updated_at);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, search, filters]);

  return (
    <div className="space-y-4">
      <SearchBar value={search} onChange={setSearch} />
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={onSelect}
            onComplete={onComplete}
            onCompleteRecurring={onCompleteRecurring}
            onDefer={onDefer}
          />
        ))}
        {filteredTasks.length === 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
            No tasks match your filters
          </p>
        )}
      </div>
    </div>
  );
}
