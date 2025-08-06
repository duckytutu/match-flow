'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { Navigation } from '@/components';
import { TournamentCard } from '@/components';
import { useAuthStore } from '@/store/auth';
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
  organizer: {
    firstName: string;
    lastName: string;
  };
  events?: TournamentEvent[];
}

export default function PendingTournaments() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
      return;
    }
  
    const fetchPendingTournaments = async () => {
      try {
        const response = await apiClient.get('/tournaments/pending');
        setTournaments(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch pending tournaments');
      } finally {
        setPageLoading(false);
      }
    };
  
    if (isAdmin && !loading) {
      fetchPendingTournaments();
    }
  }, [isAdmin, loading, router]);

  const handleApprove = async (tournamentId: number) => {
    try {
      await apiClient.patch(`/tournaments/${tournamentId}/approve`);
      setTournaments(tournaments.filter(t => t.id !== tournamentId));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to approve tournament');
    }
  };

  const handleReject = async (tournamentId: number) => {
    if (!confirm('Bạn có chắc chắn muốn từ chối giải đấu này?')) return;
    
    try {
      await apiClient.patch(`/tournaments/${tournamentId}/reject`);
      setTournaments(tournaments.filter(t => t.id !== tournamentId));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to reject tournament');
    }
  };



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
            <h1 className="text-3xl font-bold text-foreground">Giải đấu chờ phê duyệt</h1>
            <Button variant="outline" asChild>
              <Link href="/admin">
                Quay lại Admin Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
                variant="admin"
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>

          {tournaments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">Không có giải đấu nào chờ phê duyệt</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 

 