'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ReactSelect } from '@/components/ui/react-select';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import axios from '@/lib/axios';

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
  scheduledTime?: string;
  courtNumber?: number;
  player1Name?: string;
  player2Name?: string;
  winner?: string;
  notes?: string;
  referee?: User;
  scores: Score[];
}

interface EventRegistration {
  id: number;
  status: string;
  user: User;
  teammate?: User;
}

interface TournamentEvent {
  id: number;
  type: string;
  status: string;
  tournament: {
    id: number;
    name: string;
  };
}

export default function EventRegistrationsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  
  const [activeTab, setActiveTab] = useState<'registrations' | 'matches'>('registrations');
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({});
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [availableReferees, setAvailableReferees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states for registrations
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  
  // Modal states
  const [showAssignRefereeModal, setShowAssignRefereeModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedRefereeId, setSelectedRefereeId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [registrationsRes, matchesRes, eventRes, refereesRes] = await Promise.all([
        axios.get(`/event-registrations/event/${eventId}`),
        axios.get(`/matches/event/${eventId}`),
        axios.get(`/tournament-events/${eventId}`),
        axios.get(`/matches/event/${eventId}/available-referees`),
      ]);

      setRegistrations(registrationsRes.data);
      setMatches(matchesRes.data);
      setEvent(eventRes.data);
      setAvailableReferees(refereesRes.data);

      // Group matches by group
      const grouped = matchesRes.data.reduce((acc: Record<string, Match[]>, match: Match) => {
        const groupKey = match.matchNumber.toString().charAt(0);
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(match);
        return acc;
      }, {});
      setGroupedMatches(grouped);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRegistration = async (registrationId: number) => {
    try {
      await axios.patch(`/event-registrations/${registrationId}/approve`);
      fetchData();
    } catch (error) {
      console.error('Error approving registration:', error);
    }
  };

  const handleRejectRegistration = async (registrationId: number) => {
    try {
      await axios.patch(`/event-registrations/${registrationId}/reject`);
      fetchData();
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  const handleAssignReferee = async () => {
    if (!selectedMatch || !selectedRefereeId) return;

    try {
      await axios.patch(`/matches/${selectedMatch.id}/assign-referee`, {
        refereeId: selectedRefereeId,
      });
      setShowAssignRefereeModal(false);
      setSelectedMatch(null);
      setSelectedRefereeId(null);
      fetchData();
    } catch (error) {
      console.error('Error assigning referee:', error);
    }
  };

  const openAssignRefereeModal = (match: Match) => {
    setSelectedMatch(match);
    setSelectedRefereeId(match.referee?.id || null);
    setShowAssignRefereeModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ duyệt', variant: 'secondary' as const },
      approved: { label: 'Đã duyệt', variant: 'default' as const },
      rejected: { label: 'Từ chối', variant: 'destructive' as const },
      cancelled: { label: 'Đã hủy', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getMatchStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Chờ thi đấu', variant: 'secondary' as const },
      in_progress: { label: 'Đang thi đấu', variant: 'secondary' as const },
      completed: { label: 'Đã hoàn thành', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  // Filter and sort registrations based on current filters
  const filteredRegistrations = registrations
    .filter((registration) => {
      const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
      const matchesSearch = searchFilter === '' || 
        registration.user.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        registration.user.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        registration.user.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (registration.teammate && (
          registration.teammate.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          registration.teammate.lastName.toLowerCase().includes(searchFilter.toLowerCase())
        ));
      
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
          // Assuming there's a createdAt field, fallback to name if not available
          return `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`);
        default:
          return 0;
      }
    });

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setSearchFilter('');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý {event?.tournament.name} - {event?.type}
        </h1>
        <p className="text-gray-600">Quản lý đăng ký và trận đấu</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registrations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đăng ký ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matches'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trận đấu ({matches.length})
          </button>
        </nav>
      </div>

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          {/* Stats Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê đăng ký</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {registrations.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Chờ duyệt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {registrations.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Đã duyệt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {registrations.filter(r => r.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-600">Từ chối</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {registrations.filter(r => r.status === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-600">Đã hủy</div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Tìm kiếm"
                  type="text"
                  placeholder="Tìm theo tên, email..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="w-full sm:w-48">
                <Select
                  label="Trạng thái"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'pending', label: 'Chờ duyệt' },
                    { value: 'approved', label: 'Đã duyệt' },
                    { value: 'rejected', label: 'Từ chối' },
                    { value: 'cancelled', label: 'Đã hủy' }
                  ]}
                />
              </div>
              
              <div className="w-full sm:w-48">
                <Select
                  label="Sắp xếp theo"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: 'name', label: 'Tên' },
                    { value: 'status', label: 'Trạng thái' },
                    { value: 'date', label: 'Ngày đăng ký' }
                  ]}
                />
              </div>
              
              <Button
                onClick={clearFilters}
                variant="outline"
                size="lg"
                className="whitespace-nowrap"
              >
                Xóa bộ lọc
              </Button>
            </div>
            
            {/* Filter Summary */}
            {(statusFilter !== 'all' || searchFilter !== '' || sortBy !== 'name') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  <span>Bộ lọc:</span>
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Trạng thái: {statusFilter === 'pending' ? 'Chờ duyệt' : 
                                   statusFilter === 'approved' ? 'Đã duyệt' : 
                                   statusFilter === 'rejected' ? 'Từ chối' : 'Đã hủy'}
                    </span>
                  )}
                  {searchFilter !== '' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Tìm kiếm: &ldquo;{searchFilter}&rdquo;
                    </span>
                  )}
                  {sortBy !== 'name' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Sắp xếp: {sortBy === 'status' ? 'Trạng thái' : 'Ngày đăng ký'}
                    </span>
                  )}
                  <span className="text-gray-500">
                    ({filteredRegistrations.length} kết quả)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Registrations List */}
          <div className="space-y-4">
            {filteredRegistrations.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">
                  {registrations.length === 0 ? 'Chưa có đăng ký nào' : 'Không tìm thấy kết quả phù hợp'}
                </p>
                {registrations.length > 0 && (
                  <p className="text-gray-400 mt-2">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                )}
                {registrations.length === 0 && (
                  <p className="text-gray-400 mt-2">
                    Vận động viên có thể đăng ký tham gia sự kiện này
                  </p>
                )}
              </div>
            ) : (
              filteredRegistrations.map((registration) => (
                <div key={registration.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {registration.user.firstName} {registration.user.lastName}
                      </h3>
                      <p className="text-gray-600">{registration.user.email}</p>
                      {registration.teammate && (
                        <p className="text-gray-600">
                          Đồng đội: {registration.teammate.firstName} {registration.teammate.lastName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(registration.status)}
                      {registration.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleApproveRegistration(registration.id)}
                            size="sm"
                          >
                            Duyệt
                          </Button>
                          <Button
                            onClick={() => handleRejectRegistration(registration.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-8">
          {Object.entries(groupedMatches).map(([groupKey, groupMatches]) => (
            <div key={groupKey} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bảng {groupKey}</h3>
              <div className="space-y-4">
                {groupMatches.map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-900">
                            Trận {match.matchNumber}
                          </span>
                          {getMatchStatusBadge(match.status)}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>{match.player1Name} vs {match.player2Name}</p>
                          {match.scheduledTime && (
                            <p>Thời gian: {new Date(match.scheduledTime).toLocaleString()}</p>
                          )}
                          {match.courtNumber && <p>Sân: {match.courtNumber}</p>}
                          {match.referee && (
                            <p>Trọng tài: {match.referee.firstName} {match.referee.lastName}</p>
                          )}
                          {match.winner && (
                            <p className="font-medium text-green-600">
                              Người thắng: {match.winner}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => openAssignRefereeModal(match)}
                          size="sm"
                          variant="outline"
                        >
                          {match.referee ? 'Đổi trọng tài' : 'Gán trọng tài'}
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="secondary"
                        >
                          <a href={`/matches/${match.id}`}>Chi tiết</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Referee Modal */}
      <Modal
        isOpen={showAssignRefereeModal}
        onClose={() => setShowAssignRefereeModal(false)}
        onConfirm={handleAssignReferee}
        title="Gán trọng tài"
        confirmText="Gán"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Chọn trọng tài cho trận đấu {selectedMatch?.matchNumber}
          </p>
                     <ReactSelect
             label="Trọng tài"
             placeholder="Chọn trọng tài..."
             value={selectedRefereeId ? availableReferees.find(r => r.id === selectedRefereeId) ? {
               value: selectedRefereeId.toString(),
               label: `${availableReferees.find(r => r.id === selectedRefereeId)?.firstName} ${availableReferees.find(r => r.id === selectedRefereeId)?.lastName} (${availableReferees.find(r => r.id === selectedRefereeId)?.role})`,
               id: selectedRefereeId,
             } : null : null}
             onChange={(option) => setSelectedRefereeId(option?.id || null)}
             options={availableReferees.map(referee => ({
               value: referee.id.toString(),
               label: `${referee.firstName} ${referee.lastName} (${referee.role})`,
               id: referee.id,
             }))}
           />
        </div>
      </Modal>
    </div>
  );
} 