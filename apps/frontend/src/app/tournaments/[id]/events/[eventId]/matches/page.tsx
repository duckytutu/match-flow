'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ReactSelect } from '@/components/ui/react-select';
import axios from '@/lib/axios';
import { useAuthStore } from '@/store/auth';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Score {
  id: number;
  setNumber: number;
  team1Score: number;
  team2Score: number;
  notes?: string;
}

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
  referee?: User;
  scores: Score[];
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

interface GroupedMatch {
  groupId: number;
  groupName: string;
  matches: Match[];
}

export default function MatchesManagement() {
  const params = useParams();
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [groupedMatches, setGroupedMatches] = useState<GroupedMatch[]>([]);
  const [availableReferees, setAvailableReferees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingMatch, setUpdatingMatch] = useState<number | null>(null);
  const [showResultForm, setShowResultForm] = useState<number | null>(null);
  const [resultForm, setResultForm] = useState<UpdateMatchResultForm>({
    winnerId: 1,
    scores: [{ setNumber: 1, team1Score: 0, team2Score: 0 }],
  });
  
  // Referee assignment states
  const [selectedReferees, setSelectedReferees] = useState<{ [matchId: number]: number | undefined }>({});
  const [assigningReferee, setAssigningReferee] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentRes, eventRes, matchesRes] = await Promise.all([
          axios.get(`/tournaments/${params.id}`),
          axios.get(`/tournament-events/${params.eventId}`),
          axios.get(`/matches/event/${params.eventId}/groups`),
        ]);
        
        setTournament(tournamentRes.data);
        setEvent(eventRes.data);
        setGroupedMatches(matchesRes.data);
        
        // Fetch available referees
        const refereesRes = await axios.get(`/matches/event/${params.eventId}/available-referees`);
        setAvailableReferees(refereesRes.data);
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
      await axios.post(`/tournament-brackets/matches/${matchId}/result`, resultForm);
      alert('Cập nhật kết quả thành công!');
      setShowResultForm(null);
      // Refresh matches
      const response = await axios.get(`/matches/event/${params.eventId}/groups`);
      setGroupedMatches(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kết quả');
    } finally {
      setUpdatingMatch(null);
    }
  };

  const handleAssignReferee = async (matchId: number) => {
    const refereeId = selectedReferees[matchId];
    if (refereeId === undefined) return;
    
    try {
      setAssigningReferee(matchId);
      await axios.patch(`/matches/${matchId}/assign-referee`, {
        refereeId: refereeId,
      });
      
      // Refresh matches
      const response = await axios.get(`/matches/event/${params.eventId}/groups`);
      setGroupedMatches(response.data);
      
      // Clear selection
      setSelectedReferees(prev => ({ ...prev, [matchId]: undefined }));
      
      alert('Cập nhật trọng tài thành công!');
    } catch (error) {
      console.error('Error assigning referee:', error);
      alert('Có lỗi xảy ra khi cập nhật trọng tài');
    } finally {
      setAssigningReferee(null);
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

  const isWinner = (match: Match, playerName: string) => {
    return match.status === 'completed' && match.winner === playerName;
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
          <div className="bg-white shadow sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quản lý trận đấu: {getEventTypeLabel(event.type)}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {tournament.name} - {tournament.location}
              </p>
            </div>
          </div>

          {/* Danh sách trận đấu theo bảng */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách trận đấu theo bảng</h2>
            
            {groupedMatches.length > 0 ? (
              <div className="space-y-6">
                {groupedMatches.map((group) => (
                  <div key={group.groupId} className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Bảng {group.groupName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {group.matches.length} trận đấu
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {group.matches.map((match) => {
                          // Determine the currently assigned referee for prefill
                          const currentRefereeOption = match.referee
                            ? {
                                value: match.referee.id.toString(),
                                label: `${match.referee.firstName} ${match.referee.lastName}`,
                                id: match.referee.id,
                              }
                            : null;
                          // Determine if user has selected a new referee
                          const selectedOption = selectedReferees[match.id]
                            ? {
                                value: selectedReferees[match.id]!.toString(),
                                label: availableReferees.find(r => r.id === selectedReferees[match.id])?.firstName + ' ' + availableReferees.find(r => r.id === selectedReferees[match.id])?.lastName,
                                id: selectedReferees[match.id],
                              }
                            : currentRefereeOption;
                          return (
                            <div key={match.id} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium rounded ${getMatchStatusColor(match.status)}`}>{getMatchStatusLabel(match.status)}</span>
                                <span className="text-xs text-gray-400">Trận {match.matchNumber}</span>
                              </div>
                              {/* 2 dòng: đội 1 và đội 2 */}
                              <div className="grid grid-cols-12 gap-1 items-center">
                                {/* Đội 1 */}
                                <div className={`col-span-3 truncate ${isWinner(match, match.player1Name) ? 'font-bold text-green-700' : match.status === 'completed' ? 'text-gray-400' : ''}`}>{match.player1Name}</div>
                                {/* Số set thắng */}
                                <div className="col-span-1 text-center font-bold">{match.scores ? match.scores.filter(s => s.team1Score > s.team2Score).length : 0}</div>
                                {/* Điểm từng set */}
                                <div className="col-span-8 flex space-x-2">
                                  {match.scores && match.scores.map((s, idx) => (
                                    <span key={idx} className="inline-block min-w-[20px] text-center border rounded px-1 py-0.5 text-xs bg-white">
                                      {s.team1Score}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-12 gap-1 items-center">
                                {/* Đội 2 */}
                                <div className={`col-span-3 truncate ${isWinner(match, match.player2Name) ? 'font-bold text-green-700' : match.status === 'completed' ? 'text-gray-400' : ''}`}>{match.player2Name}</div>
                                {/* Số set thắng */}
                                <div className="col-span-1 text-center font-bold">{match.scores ? match.scores.filter(s => s.team2Score > s.team1Score).length : 0}</div>
                                {/* Điểm từng set */}
                                <div className="col-span-8 flex space-x-2">
                                  {match.scores && match.scores.map((s, idx) => (
                                    <span key={idx} className="inline-block min-w-[20px] text-center border rounded px-1 py-0.5 text-xs bg-white">
                                      {s.team2Score}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {/* Referee + Action */}
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-xs text-gray-500">
                                  Trọng tài: {match.referee 
                                    ? `${match.referee.firstName} ${match.referee.lastName} (${match.referee.role === 'referee' ? 'Trọng tài' : 'VĐV'}${match.referee.email ? `, ${match.referee.email}` : ''})`
                                    : 'Chưa gán'}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button asChild variant="secondary" size="sm">
                                    <Link href={`/matches/${match.id}`}>Chi tiết</Link>
                                  </Button>
                                  {/* Only show select and button if match is not completed and user is organizer */}
                                  {match.status !== 'completed' && user?.role === 'organizer' && (
                                    <>
                                      <div className="min-w-[120px]">
                                        <ReactSelect
                                          placeholder="Chọn trọng tài..."
                                          value={selectedOption}
                                          onChange={(option) => {
                                            setSelectedReferees(prev => ({
                                              ...prev,
                                              [match.id]: option?.id,
                                            }));
                                          }}
                                          options={[
                                            { value: '', label: 'Không có trọng tài', id: undefined },
                                            ...availableReferees.map(referee => ({
                                              value: referee.id.toString(),
                                              label: `${referee.firstName} ${referee.lastName}`,
                                              id: referee.id,
                                            })),
                                          ]}
                                          isClearable={true}
                                        />
                                      </div>
                                      <Button onClick={() => handleAssignReferee(match.id)} disabled={assigningReferee === match.id || (selectedReferees[match.id] === undefined && !match.referee)} size="sm">
                                        {match.referee ? (assigningReferee === match.id ? 'Đang xử lý...' : 'Cập nhật') : (assigningReferee === match.id ? 'Đang xử lý...' : 'Phân công')}
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">Chưa có trận đấu nào</p>
              </div>
            )}
          </div>

          {/* Form cập nhật kết quả */}
          {showResultForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Cập nhật kết quả</h4>
                  
                  <div className="space-y-4">
                    <Select
                      label="Đội thắng"
                      value={resultForm.winnerId.toString()}
                      onChange={(e) => setResultForm(prev => ({ ...prev, winnerId: Number(e.target.value) }))}
                      options={[
                        { value: '1', label: 'Đội 1' },
                        { value: '2', label: 'Đội 2' },
                      ]}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm từng set
                      </label>
                      {resultForm.scores.map((score, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-500">Set {score.setNumber}:</span>
                          <Input
                            type="number"
                            min="0"
                            value={score.team1Score}
                            onChange={(e) => updateScore(index, 'team1Score', Number(e.target.value))}
                            className="w-16"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-500">-</span>
                          <Input
                            type="number"
                            min="0"
                            value={score.team2Score}
                            onChange={(e) => updateScore(index, 'team2Score', Number(e.target.value))}
                            className="w-16"
                            placeholder="0"
                          />
                          {resultForm.scores.length > 1 && (
                            <Button
                              onClick={() => removeSet(index)}
                              variant="destructive"
                              size="sm"
                            >
                              Xóa
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        onClick={addSet}
                        variant="outline"
                        size="sm"
                      >
                        + Thêm set
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdateResult(showResultForm)}
                        disabled={updatingMatch === showResultForm}
                      >
                        {updatingMatch === showResultForm ? 'Đang xử lý...' : 'Lưu kết quả'}
                      </Button>
                      <Button
                        onClick={() => setShowResultForm(null)}
                        variant="outline"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 