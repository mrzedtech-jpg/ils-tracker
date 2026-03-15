'use client';

import type { ViewType } from '@/lib/types';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const VIEWS: { key: ViewType; label: string }[] = [
  { key: 'my_week', label: 'My Week' },
  { key: 'by_role', label: 'By Role' },
  { key: 'all_tasks', label: 'All Tasks' },
];

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="hidden md:flex max-w-5xl mx-auto px-4 pt-4">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
        {VIEWS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onViewChange(key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
