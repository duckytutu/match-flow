import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Edit, Eye, Trash2, Plus } from 'lucide-react';

interface ActionButtonProps {
  variant: 'approve' | 'reject' | 'edit' | 'delete' | 'view' | 'add';
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

export function ActionButton({ 
  variant, 
  onClick, 
  disabled = false, 
  size = 'default',
  children,
  className = ''
}: ActionButtonProps) {
  const getButtonConfig = (variant: string) => {
    const configs = {
      approve: {
        variant: 'default' as const,
        icon: Check,
        label: 'Phê duyệt',
        className: 'bg-green-600 hover:bg-green-700'
      },
      reject: {
        variant: 'destructive' as const,
        icon: X,
        label: 'Từ chối',
        className: 'bg-red-600 hover:bg-red-700'
      },
      edit: {
        variant: 'outline' as const,
        icon: Edit,
        label: 'Chỉnh sửa',
        className: 'border-blue-600 text-blue-600 hover:bg-blue-50'
      },
      delete: {
        variant: 'destructive' as const,
        icon: Trash2,
        label: 'Xóa',
        className: 'bg-red-600 hover:bg-red-700'
      },
      view: {
        variant: 'outline' as const,
        icon: Eye,
        label: 'Xem',
        className: 'border-gray-600 text-gray-600 hover:bg-gray-50'
      },
      add: {
        variant: 'default' as const,
        icon: Plus,
        label: 'Thêm',
        className: 'bg-blue-600 hover:bg-blue-700'
      }
    };

    return configs[variant as keyof typeof configs];
  };

  const config = getButtonConfig(variant);
  const IconComponent = config.icon;

  return (
    <Button
      variant={config.variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`${config.className} ${className}`}
    >
      <IconComponent className="w-4 h-4" />
      {children || config.label}
    </Button>
  );
} 