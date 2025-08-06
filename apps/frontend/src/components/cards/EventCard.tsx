import React from 'react';
import { Button } from '@/components/ui/button';
import { DataCard } from './DataCard';
import { StatusBadge } from '../common/StatusBadge';
import { ActionButton } from '../common/ActionButton';

interface TournamentEvent {
  id: number;
  type: string;
  maxTeams: number;
  currentTeams: number;
  entryFee: number;
  prizes?: string;
  groupStagePoints: number;
  groupStageWinBy: number;
  groupStageBo: number;
  knockoutStagePoints: number;
  knockoutStageWinBy: number;
  knockoutStageBo: number;
  status?: string;
}

interface EventCardProps {
  event: TournamentEvent;
  variant?: 'default' | 'admin';
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRegister?: (id: number) => void;
}

function getEventTypeLabel(type: string) {
  const typeMap: { [key: string]: string } = {
    'singles_male': 'Đơn nam',
    'singles_female': 'Đơn nữ',
    'doubles_male': 'Đôi nam',
    'doubles_female': 'Đôi nữ',
    'doubles_mixed': 'Đôi nam nữ',
  };
  return typeMap[type] || type;
}

export function EventCard({ 
  event, 
  variant = 'default',
  onEdit,
  onDelete,
  onRegister
}: EventCardProps) {
  const isAdmin = variant === 'admin';
  const mutedTextClass = isAdmin ? 'text-muted-foreground' : 'text-gray-500';
  const isFull = event.currentTeams >= event.maxTeams;

  const renderActions = () => {
    const actions = [];
    
    if (isAdmin) {
      if (onEdit) {
        actions.push(
          <ActionButton 
            key="edit"
            variant="edit" 
            onClick={() => onEdit(event.id)}
            size="sm"
          />
        );
      }
      if (onDelete) {
        actions.push(
          <ActionButton 
            key="delete"
            variant="delete" 
            onClick={() => onDelete(event.id)}
            size="sm"
          />
        );
      }
    } else if (onRegister && !isFull) {
      actions.push(
        <ActionButton 
          key="register"
          variant="add" 
          onClick={() => onRegister(event.id)}
          size="sm"
        />
      );
    }

    if (event.status) {
      actions.unshift(
        <StatusBadge key="status" status={event.status} variant={variant} />
      );
    }

    return actions.length > 0 ? <div className="flex gap-2">{actions}</div> : null;
  };

  return (
    <DataCard
      title={getEventTypeLabel(event.type)}
      subtitle={`Số đội: ${event.currentTeams}/${event.maxTeams}`}
      variant={variant}
      actions={renderActions()}
    >
      <div className={`space-y-2 text-sm ${mutedTextClass}`}>
        <div>💰 Phí tham gia: ${event.entryFee}</div>
        
        {event.prizes && (
          <div>🏆 Giải thưởng: {event.prizes}</div>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="font-medium mb-1">Vòng bảng:</div>
          <div className="ml-2">
            <div>• BO{event.groupStageBo} | {event.groupStagePoints} điểm | Cách {event.groupStageWinBy} điểm</div>
          </div>
        </div>
        
        <div className="border-t pt-2">
          <div className="font-medium mb-1">Vòng loại:</div>
          <div className="ml-2">
            <div>• BO{event.knockoutStageBo} | {event.knockoutStagePoints} điểm | Cách {event.knockoutStageWinBy} điểm</div>
          </div>
        </div>
        
        {isFull && (
          <div className="text-red-600 font-medium">⚠️ Đã đủ số đội tham gia</div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        {!isAdmin && !isFull && onRegister && (
          <Button
            onClick={() => onRegister(event.id)}
            className="flex-1"
            size="sm"
          >
            Đăng ký tham gia
          </Button>
        )}
        
        {isAdmin && onEdit && (
          <Button
            variant="outline"
            onClick={() => onEdit(event.id)}
            className="flex-1"
            size="sm"
          >
            Chỉnh sửa
          </Button>
        )}
      </div>
    </DataCard>
  );
} 