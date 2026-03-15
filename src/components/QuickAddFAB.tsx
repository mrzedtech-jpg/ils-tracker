'use client';

import { Plus } from 'lucide-react';

interface QuickAddFABProps {
  onClick: () => void;
}

export default function QuickAddFAB({ onClick }: QuickAddFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center"
      aria-label="Add new task"
    >
      <Plus size={28} />
    </button>
  );
}
