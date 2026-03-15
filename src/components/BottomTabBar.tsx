'use client';

import { CalendarDays, Layers, List } from 'lucide-react';
import type { ViewType } from '@/lib/types';

interface BottomTabBarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const TABS: { key: ViewType; label: string; icon: typeof CalendarDays }[] = [
  { key: 'my_week', label: 'My Week', icon: CalendarDays },
  { key: 'by_role', label: 'By Role', icon: Layers },
  { key: 'all_tasks', label: 'All Tasks', icon: List },
];

export default function BottomTabBar({ activeView, onViewChange }: BottomTabBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onViewChange(key)}
            className={`flex-1 flex flex-col items-center py-2 min-h-[56px] transition-colors ${
              activeView === key
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Icon size={22} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
