'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Navigation from '@/components/Navigation';

interface PendingUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export default function PendingUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await apiClient.get('/admin/pending-users');
      setPendingUsers(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      await apiClient.post(`/admin/users/${userId}/approve`);
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleRejectUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn từ chối người dùng này?')) return;
    
    try {
      await apiClient.post(`/admin/users/${userId}/reject`);
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to reject user');
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      'admin': 'Admin',
      'organizer': 'Organizer',
      'referee': 'Referee',
      'athlete': 'Athlete',
      'guest': 'Guest',
    };
    return roleLabels[role] || role;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Người dùng chờ phê duyệt
            </h1>
            <Link
              href="/admin"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Quay lại Dashboard
            </Link>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500 text-lg">Không có người dùng nào chờ phê duyệt</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Vai trò: {getRoleLabel(user.role)}
                          </div>
                          {user.phoneNumber && (
                            <div className="text-sm text-gray-500">
                              SĐT: {user.phoneNumber}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Phê duyệt
                        </button>
                        <button
                          onClick={() => handleRejectUser(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 