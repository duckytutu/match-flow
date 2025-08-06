import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ 
  status, 
  variant = 'default', 
  size = 'md',
  className = ''
}: StatusBadgeProps) {
  const getStatusConfig = (status: string, variant: 'default' | 'admin') => {
    if (variant === 'admin') {
      return {
        'needs_info': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Cần bổ sung' },
        'pending': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Chờ phê duyệt' },
        'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã phê duyệt' },
        'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã từ chối' }
      }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }

    return {
      'published': { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã xuất bản' },
      'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Bản nháp' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ duyệt' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' }
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const config = getStatusConfig(status, variant);
  const sizeClass = sizeClasses[size];

  return (
    <span className={`${config.bg} ${config.text} ${sizeClass} font-medium rounded-full ${className}`}>
      {config.label}
    </span>
  );
} 