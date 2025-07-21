'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

interface GroupTeam {
  position: number;
  teamName: string;
  player1: string;
  player2?: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  points: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
}

interface GroupStanding {
  groupName: string;
  teams: GroupTeam[];
}

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
  location: string;
  startDate: string;
  endDate?: string;
  organizer: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export default function EventManagement() {
  const params = useParams();
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingKnockout, setCreatingKnockout] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentRes, eventRes, standingsRes] = await Promise.all([
          apiClient.get(`/tournaments/${params.id}`),
          apiClient.get(`/tournament-events/${params.eventId}`),
          apiClient.get(`/tournaments/${params.eventId}/standings`),
        ]);
        
        setTournament(tournamentRes.data);
        setEvent(eventRes.data);
        setStandings(standingsRes.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id && params.eventId) {
      fetchData();
    }
  }, [params.id, params.eventId]);

  const getEventTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'singles_male': 'Đơn nam',
      'singles_female': 'Đơn nữ',
      'doubles_male': 'Đôi nam',
      'doubles_female': 'Đôi nữ',
      'doubles_mixed': 'Đôi nam nữ',
    };
    return typeMap[type] || type;
  };

  const handleCreateKnockout = async () => {
    if (!confirm('Bạn có chắc chắn muốn tạo vòng loại trực tiếp? Hành động này sẽ lấy các đội nhất/nhì từ mỗi bảng.')) {
      return;
    }

    setCreatingKnockout(true);
    try {
      await apiClient.post(`/tournaments/${params.eventId}/knockout`);
      alert('Tạo vòng loại thành công!');
      // Refresh standings
      const response = await apiClient.get(`/tournaments/${params.eventId}/standings`);
      setStandings(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo vòng loại');
    } finally {
      setCreatingKnockout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !tournament || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error || 'Data not found'}</div>
      </div>
    );
  }

  // Check if user is organizer
  if (user?.role !== 'organizer' || user?.id !== tournament.organizer.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">Bạn không có quyền truy cập trang này</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href={`/tournaments/${params.id}`}
              className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
            >
              ← Quay lại chi tiết giải đấu
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Quản lý: {getEventTypeLabel(event.type)}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {tournament.name} - {tournament.location}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/tournaments/${params.id}/events/${params.eventId}/matches`}>
                      Quản lý trận đấu
                    </Link>
                  </Button>
                  <Button
                    onClick={handleCreateKnockout}
                    disabled={creatingKnockout}
                    variant="default"
                    size="sm"
                  >
                    {creatingKnockout ? 'Đang xử lý...' : 'Tạo vòng loại'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng điểm */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Bảng điểm</h2>
            
            {standings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {standings
                  .slice()
                  .sort((a, b) => a.groupName.localeCompare(b.groupName, 'vi'))
                  .map((group) => (
                    <div key={group.groupName} className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Bảng {group.groupName}
                        </h3>
                      </div>
                    
                    <div className="border-t border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vị trí
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đội
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trận
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thắng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thua
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Điểm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Set
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {group.teams.map((team) => (
                            <tr key={team.position}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {team.position}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{team.player1}</div>
                                  {team.player2 && (
                                    <div className="text-gray-500">{team.player2}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {team.matchesPlayed}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {team.matchesWon}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {team.matchesLost}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {team.points}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {team.setsWon}-{team.setsLost}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">Chưa có dữ liệu bảng điểm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 