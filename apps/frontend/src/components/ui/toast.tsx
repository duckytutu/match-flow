import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'error':
        return 'bg-red-500 border-red-600 text-white';
      case 'info':
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300",
        "flex items-center gap-3 min-w-[300px]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        getToastStyles()
      )}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <span className="text-sm font-medium flex-1">{message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-white hover:text-gray-200 hover:bg-white/10 p-1 h-auto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>
  );
} 