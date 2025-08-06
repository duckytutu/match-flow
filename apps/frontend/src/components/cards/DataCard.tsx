import React from 'react';

interface DataCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'admin';
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function DataCard({ 
  title, 
  subtitle, 
  children, 
  actions, 
  variant = 'default',
  className = '',
  headerClassName = '',
  bodyClassName = ''
}: DataCardProps) {
  const bgClass = variant === 'admin' ? 'bg-card' : 'bg-white';
  const textClass = variant === 'admin' ? 'text-foreground' : 'text-gray-900';
  const mutedTextClass = variant === 'admin' ? 'text-muted-foreground' : 'text-gray-500';

  return (
    <div className={`${bgClass} overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-6">
        <div className={`flex items-center justify-between mb-4 ${headerClassName}`}>
          <div>
            <h3 className={`text-lg font-medium ${textClass}`}>{title}</h3>
            {subtitle && (
              <p className={`${mutedTextClass} text-sm mt-1`}>{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
        
        <div className={bodyClassName}>
          {children}
        </div>
      </div>
    </div>
  );
} 