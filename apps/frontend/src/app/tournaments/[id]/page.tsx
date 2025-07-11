'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/store/auth';

interface TournamentEvent {
  id: number;
  type: string;
  status: string;
  maxTeams: number;
  currentTeams: number;
  entryFee: number;
  prizes?: string;
  groupStagePoints: number;
  groupStageWinBy: number;
  groupStageBo: number;
  groupStageMaxPoints?: number;
  knockoutStagePoints: number;
  knockoutStageWinBy: number;
  knockoutStageBo: number;
  knockoutStageMaxPoints?: number;
  registrations?: Array<{
    id: number;
    user?: {
      firstName: string;
      lastName: string;
    };
    teammate?: {
      firstName: string;
      lastName: string;
    };
    status: string;
  }>;
}

interface Tournament {
  id: number;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: string;
  isApproved: boolean;
  organizer: {
    id: number;
    firstName: string;
    lastName: string;
  };
  events?: TournamentEvent[];
}

export default function TournamentDetail() {
  const params = useParams();
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingTournament, setStartingTournament] = useState<number | null>(null);
  const [completingEvent, setCompletingEvent] = useState<number | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await apiClient.get(`/tournaments/${params.id}`);
        setTournament(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch tournament');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTournament();
    }
  }, [params.id]);

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

  const handleStartTournament = async (eventId: number) => {
    if (!confirm('Bạn có chắc chắn muốn bắt đầu thi đấu? Hành động này sẽ chia bảng và tạo lịch thi đấu.')) {
      return;
    }

    setStartingTournament(eventId);
    try {
      await apiClient.post(`/tournaments/${eventId}/start`);
      alert('Thành công!');
      // Refresh tournament data
      const response = await apiClient.get(`/tournaments/${params.id}`);
      setTournament(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi bắt đầu giải đấu');
    } finally {
      setStartingTournament(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error || 'Tournament not found'}</div>
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
              href="/tournaments"
              className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
            >
              ← Quay lại danh sách giải đấu
            </Link>
          </div>

          {/* Thông tin giải đấu */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {tournament.name}
                  </h3>
                  {tournament.description && (
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {tournament.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  { user?.role === 'admin' ? (
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    tournament.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tournament.isApproved ? 'Đã phê duyệt' : 'Chờ phê duyệt'}
                  </span>
                  ) : (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      tournament.status === 'published' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tournament.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Địa điểm</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {tournament.location}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Thời gian</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div>Bắt đầu: {new Date(tournament.startDate).toLocaleDateString()}</div>
                    {tournament.endDate && (
                      <div>Kết thúc: {new Date(tournament.endDate).toLocaleDateString()}</div>
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ban tổ chức</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {tournament.organizer.firstName} {tournament.organizer.lastName}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Danh sách nội dung thi đấu */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Nội dung thi đấu</h2>
            
                            {tournament.events && tournament.events.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tournament.events.map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {getEventTypeLabel(event.type)}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              event.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                              event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {event.status === 'not_started' ? 'Chưa bắt đầu' :
                               event.status === 'in_progress' ? 'Đang diễn ra' :
                               'Đã kết thúc'}
                            </span>
                          </div>
                        </div>
                        {!user ? (
                          <Link
                          href="/login"
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          Đăng nhập để đăng ký
                        </Link>
                        ) : user.role === 'athlete' ? (
                          <Link
                            href={`/tournaments/${tournament.id}/events/${event.id}/register`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                          >
                            Đăng ký
                          </Link>
                        ) : user.role === 'organizer' && user.id === tournament.organizer.id ? (
                          <div className="flex space-x-2">
                            <Link
                              href={`/organizer/event-registrations/${event.id}`}
                              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                            >
                              Quản lý
                            </Link>
                            <Link
                              href={`/tournaments/${tournament.id}/events/${event.id}/manage`}
                              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                            >
                              Bảng điểm
                            </Link>
                            {event.currentTeams >= event.maxTeams && event.status === 'not_started' && (
                              <button
                                onClick={() => handleStartTournament(event.id)}
                                disabled={startingTournament === event.id}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                {startingTournament === event.id ? 'Đang xử lý...' : 'Bắt đầu thi đấu'}
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Số đội</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {event.currentTeams}/{event.maxTeams}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Phí tham gia</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            ${event.entryFee}
                          </dd>
                        </div>
                        {event.prizes && (
                          <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Giải thưởng</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {event.prizes}
                            </dd>
                          </div>
                        )}
                        <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Luật thi đấu</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <div className="space-y-1">
                              <div>Vòng bảng: Đến {event.groupStagePoints} điểm, cách {event.groupStageWinBy} điểm, BO{event.groupStageBo}</div>
                              <div>Vòng loại: Đến {event.knockoutStagePoints} điểm, cách {event.knockoutStageWinBy} điểm, BO{event.knockoutStageBo}</div>
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Danh sách đăng ký */}
                    {event.registrations && event.registrations.length > 0 && (
                      <div className="border-t border-gray-200">
                        <div className="px-4 py-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Đã đăng ký ({event.registrations.length})
                          </h4>
                          <ul className="space-y-2">
                            {event.registrations.map((registration) => (
                              <li key={registration.id} className="flex justify-between items-center">
                                <span className="text-sm text-gray-900">
                                  {registration.user ? `${registration.user.firstName} ${registration.user.lastName}` : 'Unknown User'}
                                  {registration.teammate && (
                                    <span className="text-gray-500 ml-2">
                                      + {registration.teammate.firstName} {registration.teammate.lastName}
                                    </span>
                                  )}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {registration.status}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">Chưa có nội dung thi đấu nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 