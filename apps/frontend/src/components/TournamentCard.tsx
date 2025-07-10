import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

function getStatusBadge(status: string, variant: 'default' | 'admin' = 'default') {
  if (variant === 'admin') {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        status === 'needs_info' 
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {status === 'needs_info' ? 'Cần bổ sung' : 'Chờ phê duyệt'}
      </span>
    );
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      status === 'published' ? 'bg-green-100 text-green-800' :
      status === 'draft' ? 'bg-gray-100 text-gray-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {status}
    </span>
  );
}

export default function TournamentCard({ 
  tournament, 
  variant = 'default',
  onApprove,
  onReject
}: TournamentCardProps) {
  const isAdmin = variant === 'admin';
  const bgClass = isAdmin ? 'bg-card' : 'bg-white';
  const textClass = isAdmin ? 'text-foreground' : 'text-gray-900';
  const mutedTextClass = isAdmin ? 'text-muted-foreground' : 'text-gray-500';

  return (
    <div className={`${bgClass} overflow-hidden shadow rounded-lg`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${textClass}`}>{tournament.name}</h3>
          {getStatusBadge(tournament.status, variant)}
        </div>
        
        <p className={`${mutedTextClass} text-sm mb-4`}>{tournament.description}</p>
        
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
          
          {isAdmin && tournament.events && (
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
          )}
        </div>

        <div className="mt-6 flex space-x-2">
          {isAdmin ? (
            <>
              <Button
                asChild
                variant="secondary"
                className="flex-1"
                size="sm"
              >
                <Link href={`/tournaments/${tournament.id}`}>Xem chi tiết</Link>
              </Button>
              {onApprove && (
                <Button 
                  onClick={() => onApprove(tournament.id)}
                  className="flex-1"
                  size="sm"
                >
                  Phê duyệt
                </Button>
              )}
              {onReject && (
                <Button 
                  variant="destructive"
                  onClick={() => onReject(tournament.id)}
                  className="flex-1"
                  size="sm"
                >
                  Từ chối
                </Button>
              )}
            </>
          ) : (
            <Link
              href={`/tournaments/${tournament.id}`}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
            >
              Xem chi tiết
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 