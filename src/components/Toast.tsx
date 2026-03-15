'use client';

import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
