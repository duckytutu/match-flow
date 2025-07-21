'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ReactSelect } from '@/components/ui/react-select';
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
      pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Từ chối', className: 'bg-red-100 text-red-800' },
      cancelled: { label: 'Đã hủy', className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getMatchStatusBadge = (status: string) => {
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
          {registrations.map((registration) => (
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
          ))}
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