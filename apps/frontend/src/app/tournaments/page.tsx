'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Navigation } from '@/components';
import { TournamentCard } from '@/components';
import { useAuthStore } from '@/store/auth';

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

export default function Tournaments() {
  const { user, loading: authLoading } = useAuthStore();
  const isOrganizer = user?.role === 'organizer';
  const isAdmin = user?.role === 'admin';
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await apiClient.get('/tournaments');
        setTournaments(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch tournaments');
      } finally {
        setLoading(false);
      }
    };

    // Fetch tournaments regardless of authentication status
    fetchTournaments();
  }, []);

  if (authLoading || loading) {
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Giải đấu</h1>
            {(isOrganizer || isAdmin) && (
              <Link
                href="/tournaments/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Tạo giải đấu
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>

          {tournaments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Chưa có giải đấu nào</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 