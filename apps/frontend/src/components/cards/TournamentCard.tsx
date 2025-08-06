import Link from 'next/link';
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
}

interface Tournament {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: string;
  isApproved: boolean;
  currentParticipants?: number;
  maxParticipants?: number;
  entryFee?: number;
  type?: string;
  organizer: {
    firstName: string;
    lastName: string;
  };
  events?: TournamentEvent[];
}

interface TournamentCardProps {
  tournament: Tournament;
  variant?: 'default' | 'admin';
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onEdit?: (id: number) => void;
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

export function TournamentCard({ 
  tournament, 
  variant = 'default',
  onApprove,
  onReject,
  onEdit
}: TournamentCardProps) {
  const isAdmin = variant === 'admin';
  const mutedTextClass = isAdmin ? 'text-muted-foreground' : 'text-gray-500';

  const renderActions = () => {
    if (isAdmin) {
      return (
        <div className="flex gap-2">
          <StatusBadge status={tournament.status} variant={variant} />
          {onApprove && (
            <ActionButton 
              variant="approve" 
              onClick={() => onApprove(tournament.id)}
              size="sm"
            />
          )}
          {onReject && (
            <ActionButton 
              variant="reject" 
              onClick={() => onReject(tournament.id)}
              size="sm"
            />
          )}
        </div>
      );
    }

    return <StatusBadge status={tournament.status} variant={variant} />;
  };

  const renderEventDetails = () => {
    if (!isAdmin || !tournament.events) return null;

    return (
      <div>
        <span className="font-medium">Nội dung thi đấu:</span>
        {tournament.events.length > 0 ? (
          <ul className="list-disc ml-5 mt-1 space-y-1">
            {tournament.events.map(event => (
              <li key={event.id}>
                <span className="font-semibold">{getEventTypeLabel(event.type)}</span>
                {` | Số đội: ${event.currentTeams}/${event.maxTeams} | Phí: $${event.entryFee} | Luật: Vòng bảng BO${event.groupStageBo}, ${event.groupStagePoints} điểm, cách ${event.groupStageWinBy} điểm; Vòng loại BO${event.knockoutStageBo}, ${event.knockoutStagePoints} điểm, cách ${event.knockoutStageWinBy} điểm`}
              </li>
            ))}
          </ul>
        ) : (
          <span className="ml-2 text-gray-500">Chưa có nội dung thi đấu</span>
        )}
      </div>
    );
  };

  return (
    <DataCard
      title={tournament.name}
      subtitle={tournament.description}
      variant={variant}
      actions={renderActions()}
    >
      <div className={`space-y-2 text-sm ${mutedTextClass}`}>
        <div>📍 {tournament.location}</div>
        <div>📅 Bắt đầu: {new Date(tournament.startDate).toLocaleDateString()}</div>
        {tournament.endDate && (
          <div>📅 Kết thúc: {new Date(tournament.endDate).toLocaleDateString()}</div>
        )}
        
        {variant === 'default' && tournament.currentParticipants !== undefined && (
          <div>👥 {tournament.currentParticipants}/{tournament.maxParticipants} người tham gia</div>
        )}
        
        {variant === 'default' && tournament.entryFee !== undefined && (
          <div>💰 Phí tham gia: ${tournament.entryFee}</div>
        )}
        
        {variant === 'default' && tournament.type && (
          <div>🏆 Loại: {tournament.type}</div>
        )}
        
        <div>👤 Ban tổ chức: {tournament.organizer.firstName} {tournament.organizer.lastName}</div>
        
        {renderEventDetails()}
      </div>

      <div className="mt-6 flex space-x-2">
        <Button
          asChild
          variant="secondary"
          className="flex-1"
          size="sm"
        >
          <Link href={`/tournaments/${tournament.id}`}>Xem chi tiết</Link>
        </Button>
        
        {onEdit && (
          <ActionButton 
            variant="edit" 
            onClick={() => onEdit(tournament.id)}
            size="sm"
          />
        )}
      </div>
    </DataCard>
  );
} 