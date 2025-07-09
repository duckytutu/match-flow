'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

interface Tournament {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  currentParticipants: number;
  maxParticipants: number;
  entryFee: number;
  isApproved: boolean;
  organizer: {
    firstName: string;
    lastName: string;
  };
}

interface PendingRegistration {
  id: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  teamName?: string;
  notes?: string;
  paidAmount: number;
  isPaid: boolean;
  teammateId?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    levelPoint?: number;
  };
  teammate?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    levelPoint?: number;
  };
  event: {
    id: number;
    type: string;
    entryFee: number;
    tournament?: {
      id: number;
      name: string;
    };
  };
}

export default function MyTournaments() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const isOrganizer = user?.role === 'organizer';
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isOrganizer) {
      router.push('/dashboard');
      return;
    }

    const fetchMyTournaments = async () => {
      try {
        const [tournamentsResponse, registrationsResponse] = await Promise.all([
          apiClient.get(`/tournaments/organizer/${user?.id}`),
          apiClient.get(`/event-registrations/organizer/${user?.id}/pending`)
        ]);
        setTournaments(tournamentsResponse.data);
        setPendingRegistrations(registrationsResponse.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setPageLoading(false);
      }
    };

    if (user?.id && isOrganizer && !loading) {
      fetchMyTournaments();
    }
  }, [user, isOrganizer, loading, router]);



  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Giải đấu của tôi</h1>
            <Button asChild>
              <Link href="/tournaments/create">
                Tạo giải đấu mới
              </Link>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Tổng giải đấu
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {tournaments.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-card shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Đăng ký chờ duyệt
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {pendingRegistrations.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-card shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Giải đấu đã duyệt
                    </dt>
                    <dd className="text-lg font-medium text-foreground">
                      {tournaments.filter(t => t.isApproved).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Registrations Card */}
          {pendingRegistrations.length > 0 && (
            <div className="bg-card shadow rounded-lg mb-8 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Đăng ký phê duyệt
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Có {pendingRegistrations.length} đăng ký đang chờ phê duyệt
                  </p>
                </div>
                <Button asChild>
                  <Link href="/organizer/pending-registrations">
                    Xem danh sách
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-card overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">{tournament.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tournament.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : tournament.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : tournament.status === 'needs_info'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.isApproved ? 'Đã phê duyệt' : 
                       tournament.status === 'rejected' ? 'Bị từ chối' :
                       tournament.status === 'needs_info' ? 'Cần bổ sung' : 'Chờ phê duyệt'}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">{tournament.description}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>📍 {tournament.location}</div>
                    <div>📅 {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</div>
                    <div>👥 {tournament.currentParticipants}/{tournament.maxParticipants} người tham gia</div>
                    <div>💰 Phí tham gia: ${tournament.entryFee}</div>
                    <div>🏆 Loại: {tournament.type}</div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/tournaments/${tournament.id}`}>
                        Xem chi tiết
                      </Link>
                    </Button>
                    {tournament.isApproved && (
                      <Button asChild className="flex-1">
                        <Link href={`/tournaments/${tournament.id}/manage`}>
                          Quản lý
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tournaments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">Bạn chưa tạo giải đấu nào</div>
              <Button asChild className="mt-4">
                <Link href="/tournaments/create">
                  Tạo giải đấu đầu tiên
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 