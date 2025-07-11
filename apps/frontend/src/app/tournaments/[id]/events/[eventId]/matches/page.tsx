'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/store/auth';

interface Match {
  id: number;
  matchNumber: number;
  status: string;
  type: string;
  player1Name: string;
  player2Name: string;
  scheduledTime?: string;
  courtNumber?: number;
  winner?: string;
  notes?: string;
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

interface UpdateMatchResultForm {
  winnerId: number;
  scores: Array<{
    setNumber: number;
    team1Score: number;
    team2Score: number;
  }>;
}

export default function MatchesManagement() {
  const params = useParams();
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingMatch, setUpdatingMatch] = useState<number | null>(null);
  const [showResultForm, setShowResultForm] = useState<number | null>(null);
  const [resultForm, setResultForm] = useState<UpdateMatchResultForm>({
    winnerId: 1,
    scores: [{ setNumber: 1, team1Score: 0, team2Score: 0 }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentRes, eventRes, matchesRes] = await Promise.all([
          apiClient.get(`/tournaments/${params.id}`),
          apiClient.get(`/tournament-events/${params.eventId}`),
          apiClient.get(`/matches/event/${params.eventId}`),
        ]);
        
        setTournament(tournamentRes.data);
        setEvent(eventRes.data);
        setMatches(matchesRes.data);
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

  const getMatchStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'Chưa đấu',
      'in_progress': 'Đang đấu',
      'completed': 'Đã hoàn thành',
      'cancelled': 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const getMatchStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'scheduled': 'bg-gray-100 text-gray-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdateResult = async (matchId: number) => {
    setUpdatingMatch(matchId);
    try {
      await apiClient.post(`/tournament-brackets/matches/${matchId}/result`, resultForm);
      alert('Cập nhật kết quả thành công!');
      setShowResultForm(null);
      // Refresh matches
      const response = await apiClient.get(`/matches/event/${params.eventId}`);
      setMatches(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kết quả');
    } finally {
      setUpdatingMatch(null);
    }
  };

  const addSet = () => {
    setResultForm(prev => ({
      ...prev,
      scores: [...prev.scores, { setNumber: prev.scores.length + 1, team1Score: 0, team2Score: 0 }],
    }));
  };

  const removeSet = (index: number) => {
    setResultForm(prev => ({
      ...prev,
      scores: prev.scores.filter((_, i) => i !== index),
    }));
  };

  const updateScore = (index: number, field: 'team1Score' | 'team2Score', value: number) => {
    setResultForm(prev => ({
      ...prev,
      scores: prev.scores.map((score, i) => 
        i === index ? { ...score, [field]: value } : score
      ),
    }));
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

  // Check if user is organizer or referee
  if (user?.role !== 'organizer' && user?.role !== 'referee') {
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
              href={`/tournaments/${params.id}/events/${params.eventId}/manage`}
              className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
            >
              ← Quay lại quản lý bảng điểm
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quản lý trận đấu: {getEventTypeLabel(event.type)}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {tournament.name} - {tournament.location}
              </p>
            </div>
          </div>

          {/* Danh sách trận đấu */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách trận đấu</h2>
            
            {matches.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {matches.map((match) => (
                  <div key={match.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Trận {match.matchNumber}
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {match.player1Name} vs {match.player2Name}
                          </p>
                          {match.notes && (
                            <p className="mt-1 text-sm text-gray-500">{match.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getMatchStatusColor(match.status)}`}>
                            {getMatchStatusLabel(match.status)}
                          </span>
                          {match.status === 'completed' && match.winner && (
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                              Thắng: {match.winner}
                            </span>
                          )}
                          {match.status === 'scheduled' && (
                            <button
                              onClick={() => setShowResultForm(match.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                              Cập nhật kết quả
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Form cập nhật kết quả */}
                    {showResultForm === match.id && (
                      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Cập nhật kết quả</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Đội thắng
                            </label>
                            <select
                              value={resultForm.winnerId}
                              onChange={(e) => setResultForm(prev => ({ ...prev, winnerId: Number(e.target.value) }))}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value={1}>{match.player1Name}</option>
                              <option value={2}>{match.player2Name}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Điểm từng set
                            </label>
                            {resultForm.scores.map((score, index) => (
                              <div key={index} className="flex items-center space-x-2 mb-2">
                                <span className="text-sm text-gray-500">Set {score.setNumber}:</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={score.team1Score}
                                  onChange={(e) => updateScore(index, 'team1Score', Number(e.target.value))}
                                  className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="0"
                                />
                                <span className="text-sm text-gray-500">-</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={score.team2Score}
                                  onChange={(e) => updateScore(index, 'team2Score', Number(e.target.value))}
                                  className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="0"
                                />
                                {resultForm.scores.length > 1 && (
                                  <button
                                    onClick={() => removeSet(index)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Xóa
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={addSet}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              + Thêm set
                            </button>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateResult(match.id)}
                              disabled={updatingMatch === match.id}
                              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {updatingMatch === match.id ? 'Đang xử lý...' : 'Lưu kết quả'}
                            </button>
                            <button
                              onClick={() => setShowResultForm(null)}
                              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">Chưa có trận đấu nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 