'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { Navigation } from '@/components';

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

export default function MyAssignmentsPage() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyAssignments();
    }
  }, [user]);

  const fetchMyAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/matches/referee/${user?.id}`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trận đấu được giao
          </h1>
          <p className="text-gray-600">
            Danh sách các trận đấu bạn được giao làm trọng tài
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              Bạn chưa được giao trận đấu nào
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Trận {match.matchNumber}
                      </h3>
                      {getStatusBadge(match.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Giải đấu:</strong> {match.event.tournament.name}</p>
                      <p><strong>Nội dung:</strong> {getTypeLabel(match.event.type)}</p>
                      <p><strong>Vận động viên:</strong> {match.player1Name} vs {match.player2Name}</p>
                      {match.scheduledTime && (
                        <p><strong>Thời gian:</strong> {new Date(match.scheduledTime).toLocaleString()}</p>
                      )}
                      {match.courtNumber && (
                        <p><strong>Sân:</strong> {match.courtNumber}</p>
                      )}
                      {match.winner && (
                        <p className="font-medium text-green-600">
                          <strong>Người thắng:</strong> {match.winner}
                        </p>
                      )}
                    </div>

                    {/* Hiển thị điểm số nếu có */}
                    {match.scores.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Điểm số:</h4>
                        <div className="flex space-x-4">
                          {match.scores.map((score) => (
                            <div key={score.id} className="text-sm">
                              <span className="font-medium">Set {score.setNumber}:</span>
                              <span className="ml-1">
                                {score.team1Score} - {score.team2Score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                    >
                      <a href={`/matches/${match.id}`}>Chi tiết</a>
                    </Button>
                    {match.status === 'scheduled' && (
                      <Button
                        asChild
                        size="sm"
                      >
                        <a href={`/matches/${match.id}`}>Bắt đầu</a>
                      </Button>
                    )}
                    {match.status === 'in_progress' && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                      >
                        <a href={`/matches/${match.id}`}>Cập nhật điểm</a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 