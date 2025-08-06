import React from 'react';
import { Button } from '@/components/ui/button';
import { BaseModal } from '@/components/ui/base-modal';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'warning',
  confirmLabel,
  cancelLabel = 'Hủy',
  loading = false
}: ConfirmModalProps) {
  const getVariantConfig = (variant: string) => {
    const configs = {
      danger: {
        icon: XCircle,
        iconColor: 'text-red-500',
        confirmVariant: 'destructive' as const,
        confirmLabel: 'Xóa'
      },
      warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
        confirmVariant: 'default' as const,
        confirmLabel: 'Xác nhận'
      },
      info: {
        icon: Info,
        iconColor: 'text-blue-500',
        confirmVariant: 'default' as const,
        confirmLabel: 'Xác nhận'
      },
      success: {
        icon: CheckCircle,
        iconColor: 'text-green-500',
        confirmVariant: 'default' as const,
        confirmLabel: 'Xác nhận'
      }
    };

    return configs[variant as keyof typeof configs];
  };

  const config = getVariantConfig(variant);
  const IconComponent = config.icon;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex items-center gap-3 mb-4">
        <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={config.confirmVariant}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : (confirmLabel || config.confirmLabel)}
        </Button>
      </div>
    </BaseModal>
  );
} 