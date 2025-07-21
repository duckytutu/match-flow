'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import axios from '@/lib/axios';

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
  scheduledTime?: string;
  courtNumber?: number;
  player1Name?: string;
  player2Name?: string;
  winner?: string;
  notes?: string;
  referee?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  event: {
    id: number;
    type: string;
    tournament: {
      id: number;
      name: string;
    };
  };
  scores: Score[];
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const matchId = params.id as string;
  
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Modal states
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showEndSetModal, setShowEndSetModal] = useState(false);
  const [winner, setWinner] = useState('');
  const [currentSet, setCurrentSet] = useState<Score | null>(null);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/matches/${matchId}`);
      setMatch(response.data);
      
      // Create current set if match is in progress and no current set exists
      if (response.data.status === 'in_progress' && response.data.scores.length === 0) {
        setCurrentSet({
          id: 0,
          setNumber: 1,
          team1Score: 0,
          team2Score: 0,
        });
      } else if (response.data.status === 'in_progress' && response.data.scores.length > 0) {
        // Check if we need to create a new set
        const lastSet = response.data.scores[response.data.scores.length - 1];
        // If no current set exists, create a new one
        if (!currentSet || currentSet.id !== 0) {
          setCurrentSet({
            id: 0,
            setNumber: lastSet.setNumber + 1,
            team1Score: 0,
            team2Score: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatch = async () => {
    try {
      setUpdating(true);
      await axios.patch(`/matches/${matchId}/start`);
      await fetchMatchDetails();
      setShowStartModal(false);
    } catch (error) {
      console.error('Error starting match:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleEndMatch = async () => {
    if (!winner || !match) return;
    try {
      setUpdating(true);
      // Prepare scores array for API
      const scores = match.scores.map(s => ({
        setNumber: s.setNumber,
        team1Score: s.team1Score,
        team2Score: s.team2Score,
      }));
      // Determine winnerId (1 or 2)
      let winnerId = 1;
      if (winner === match.player2Name) winnerId = 2;
      await axios.post(`/tournament-brackets/matches/${matchId}/result`, {
        winnerId,
        scores,
      });
      await fetchMatchDetails();
      setShowEndModal(false);
      setWinner('');
    } catch (error) {
      console.error('Error ending match:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleEndSet = async () => {
    if (!currentSet) return;
    
    try {
      setUpdating(true);
      await axios.post(`/scores/match/${matchId}/set`, {
        setNumber: currentSet.setNumber,
        team1Score: currentSet.team1Score,
        team2Score: currentSet.team2Score,
      });
      
      // Refresh match details to get updated scores
      await fetchMatchDetails();
      setShowEndSetModal(false);
      
      // Auto-create next set if match is still in progress
      if (match?.status === 'in_progress') {
        const newSetNumber = (match.scores?.length || 0) + 1;
        setCurrentSet({
          id: 0,
          setNumber: newSetNumber,
          team1Score: 0,
          team2Score: 0,
        });
      } else {
        setCurrentSet(null);
      }
    } catch (error) {
      console.error('Error ending set:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddPoint = async (team: 'team1' | 'team2') => {
    if (!currentSet || match?.status !== 'in_progress') return;
    
    try {
      // Update the current set score immediately
      const updatedSet = {
        ...currentSet,
        [team === 'team1' ? 'team1Score' : 'team2Score']: currentSet[team === 'team1' ? 'team1Score' : 'team2Score'] + 1,
      };
      setCurrentSet(updatedSet);
      
      // Call API to save the score immediately
      const response = await axios.post(`/scores/match/${matchId}/set`, {
        setNumber: updatedSet.setNumber,
        team1Score: updatedSet.team1Score,
        team2Score: updatedSet.team2Score,
      });
      
      // Update the current set with the response data (includes ID if it's a new score)
      if (response.data && response.data.id) {
        setCurrentSet({
          ...updatedSet,
          id: response.data.id,
        });
      }
    } catch (error) {
      console.error('Error adding point:', error);
      // Revert the score if API call fails
      setCurrentSet(currentSet);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Chờ thi đấu', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'Đang thi đấu', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Đã hoàn thành', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'singles_male': 'Đơn nam',
      'singles_female': 'Đơn nữ',
      'doubles_male': 'Đôi nam',
      'doubles_female': 'Đôi nữ',
      'doubles_mixed': 'Đôi nam nữ',
    };
    return typeMap[type] || type;
  };

  const canManageMatch = user && (
    user.role === 'referee' || 
    user.role === 'organizer' || 
    user.role === 'admin' ||
    (match?.referee && user.id === match.referee.id)
  );

  // Get current score display
  const getCurrentScore = (team: 'team1' | 'team2') => {
    if (currentSet) {
      return currentSet[team === 'team1' ? 'team1Score' : 'team2Score'];
    }
    if (match?.scores && match.scores.length > 0) {
      const lastScore = match.scores[match.scores.length - 1];
      return lastScore[team === 'team1' ? 'team1Score' : 'team2Score'];
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Không tìm thấy trận đấu</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-4"
          >
            ← Quay lại
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trận đấu {match.matchNumber}
          </h1>
          <p className="text-gray-600">
            {match.event.tournament.name} - {getTypeLabel(match.event.type)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin trận đấu */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin trận đấu</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Trạng thái:</span>
                  {getStatusBadge(match.status)}
                </div>
                
                {match.scheduledTime && (
                  <div>
                    <span className="font-medium text-gray-700">Thời gian:</span>
                    <p className="text-gray-900 mt-1">
                      {new Date(match.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {match.courtNumber && (
                  <div>
                    <span className="font-medium text-gray-700">Sân:</span>
                    <p className="text-gray-900 mt-1">Sân {match.courtNumber}</p>
                  </div>
                )}
                
                {match.referee && (
                  <div>
                    <span className="font-medium text-gray-700">Trọng tài:</span>
                    <p className="text-gray-900 mt-1">
                      {match.referee.firstName} {match.referee.lastName}
                    </p>
                  </div>
                )}
                
                {match.winner && (
                  <div>
                    <span className="font-medium text-gray-700">Người thắng:</span>
                    <p className="text-green-600 font-semibold mt-1">{match.winner}</p>
                  </div>
                )}
                
                {match.notes && (
                  <div>
                    <span className="font-medium text-gray-700">Ghi chú:</span>
                    <p className="text-gray-900 mt-1">{match.notes}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {canManageMatch && (
                <div className="mt-6 space-y-2">
                  {match.status === 'scheduled' && (
                    <Button
                      onClick={() => setShowStartModal(true)}
                      className="w-full"
                    >
                      Bắt đầu trận đấu
                    </Button>
                  )}
                  
                  {match.status === 'in_progress' && (
                    <>
                      <Button
                        onClick={() => setShowEndModal(true)}
                        variant="destructive"
                        className="w-full"
                      >
                        Kết thúc trận đấu
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bảng điểm TV Style */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="bg-gray-800 text-white p-4">
                <h2 className="text-xl font-semibold text-center">BẢNG ĐIỂM</h2>
                <p className="text-center text-gray-300">Trận {match.matchNumber}</p>
                {currentSet && (
                  <p className="text-center text-gray-300">Set {currentSet.setNumber}</p>
                )}
              </div>
              
              {/* Đội 1 */}
              <div className="bg-blue-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{match.player1Name}</h3>
                    <p className="text-blue-200">Đội 1</p>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-bold">
                      {getCurrentScore('team1')}
                    </div>
                    {canManageMatch && match.status === 'in_progress' && currentSet && (
                      <Button
                        onClick={() => handleAddPoint('team1')}
                        className="mt-2 bg-blue-700 hover:bg-blue-800"
                        size="sm"
                      >
                        Lên điểm
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Đội 2 */}
              <div className="bg-red-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{match.player2Name}</h3>
                    <p className="text-red-200">Đội 2</p>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-bold">
                      {getCurrentScore('team2')}
                    </div>
                    {canManageMatch && match.status === 'in_progress' && currentSet && (
                      <Button
                        onClick={() => handleAddPoint('team2')}
                        className="mt-2 bg-red-700 hover:bg-red-800"
                        size="sm"
                      >
                        Lên điểm
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Kết thúc set */}
              {canManageMatch && match.status === 'in_progress' && currentSet && (
                <div className="p-4 bg-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Set {currentSet.setNumber}</p>
                    <Button
                      onClick={() => setShowEndSetModal(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Kết thúc Set {currentSet.setNumber}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Lịch sử các set */}
            {match.scores.length > 0 && (
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử các set</h3>
                <div className="space-y-4">
                  {match.scores.map((score) => (
                    <div key={score.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Set {score.setNumber}</h4>
                        {/* Không cho phép sửa tỉ số khi set đã kết thúc */}
                        <span className="text-sm text-gray-500">Đã kết thúc</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{score.team1Score}</div>
                          <div className="text-sm text-gray-600">{match.player1Name}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{score.team2Score}</div>
                          <div className="text-sm text-gray-600">{match.player2Name}</div>
                        </div>
                      </div>
                      
                      {score.notes && (
                        <p className="text-sm text-gray-600 mt-2">{score.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Match Modal */}
      <Modal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onConfirm={handleStartMatch}
        title="Bắt đầu trận đấu"
        confirmText="Bắt đầu"
        cancelText="Hủy"
        loading={updating}
      >
        <p className="text-gray-600">
          Bạn có chắc chắn muốn bắt đầu trận đấu {match.matchNumber}?
        </p>
      </Modal>

      {/* End Match Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={handleEndMatch}
        title="Kết thúc trận đấu"
        confirmText="Kết thúc"
        cancelText="Hủy"
        loading={updating}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Chọn người thắng cho trận đấu {match.matchNumber}:
          </p>
          <Select
            label="Người thắng"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            options={[
              { value: match.player1Name || '', label: match.player1Name || '' },
              { value: match.player2Name || '', label: match.player2Name || '' },
            ]}
          />
        </div>
      </Modal>

      {/* End Set Modal */}
      <Modal
        isOpen={showEndSetModal}
        onClose={() => setShowEndSetModal(false)}
        onConfirm={handleEndSet}
        title="Kết thúc Set"
        confirmText="Kết thúc"
        cancelText="Hủy"
        loading={updating}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Xác nhận kết thúc Set {currentSet?.setNumber}?
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{currentSet?.team1Score}</div>
                <div className="text-sm text-gray-600">{match.player1Name}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{currentSet?.team2Score}</div>
                <div className="text-sm text-gray-600">{match.player2Name}</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
} 