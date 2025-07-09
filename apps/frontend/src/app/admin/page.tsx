'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Navigation from '@/components/Navigation';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isApproved: boolean;
}

interface Tournament {
  id: number;
  name: string;
  status: string;
  currentParticipants: number;
  maxParticipants: number;
  isApproved: boolean;
  organizer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, tournamentsResponse, registrationsResponse] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/tournaments'),
          apiClient.get('/event-registrations/pending')
        ]);
        
        setUsers(usersResponse.data);
        setTournaments(tournamentsResponse.data);
        setPendingRegistrations(registrationsResponse.data.length);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveUser = async (userId: number) => {
    try {
      await apiClient.patch(`/users/${userId}/approve`);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isApproved: true } : user
      ));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      await apiClient.delete(`/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleApproveTournament = async (tournamentId: number) => {
    try {
      await apiClient.patch(`/tournaments/${tournamentId}/approve`);
      setTournaments(tournaments.map(tournament => 
        tournament.id === tournamentId ? { ...tournament, isApproved: true, status: 'published' } : tournament
      ));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to approve tournament');
    }
  };

  if (loading) {
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

  const pendingUsers = users.filter(user => !user.isApproved);
  const pendingTournaments = tournaments.filter(t => !t.isApproved);
  const publishedTournaments = tournaments.filter(t => t.status === 'published');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Admin Dashboard
          </h1>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng người dùng
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Người dùng chờ phê duyệt
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingUsers.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Giải đấu chờ phê duyệt
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingTournaments.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Giải đấu đã xuất bản
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {publishedTournaments.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">R</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Đăng ký chờ xét duyệt
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingRegistrations}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Users */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Người dùng chờ phê duyệt
                </h3>
                <Link
                  href="/admin/pending-users"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Xem tất cả
                </Link>
              </div>
              {pendingUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingUsers.slice(0, 5).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleApproveUser(user.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pendingUsers.length > 5 && (
                    <p className="text-gray-500 mt-2">
                      Và {pendingUsers.length - 5} người dùng khác. 
                      <Link href="/admin/pending-users" className="text-indigo-600 hover:text-indigo-900 ml-1">
                        Xem tất cả
                      </Link>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Không có người dùng nào chờ phê duyệt</p>
              )}
            </div>
          </div>

          {/* Pending Tournaments */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Giải đấu chờ phê duyệt
              </h3>
              {pendingTournaments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên giải đấu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ban tổ chức
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Người tham gia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingTournaments.map((tournament) => (
                        <tr key={tournament.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {tournament.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tournament.organizer?.firstName} {tournament.organizer?.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tournament.currentParticipants}/{tournament.maxParticipants}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleApproveTournament(tournament.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Phê duyệt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Không có giải đấu nào chờ phê duyệt</p>
              )}
            </div>
          </div>

          {/* Pending Registrations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Đăng ký chờ xét duyệt
                </h3>
                <Link
                  href="/admin/pending-registrations"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Xem tất cả
                </Link>
              </div>
              {pendingRegistrations > 0 ? (
                <p className="text-gray-500">
                  Có {pendingRegistrations} đăng ký đang chờ xét duyệt. 
                  <Link href="/admin/pending-registrations" className="text-indigo-600 hover:text-indigo-900 ml-1">
                    Nhấn vào đây để xem chi tiết
                  </Link>
                </p>
              ) : (
                <p className="text-gray-500">Không có đăng ký nào chờ xét duyệt</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 