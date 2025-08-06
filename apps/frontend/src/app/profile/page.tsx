'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Navigation } from '@/components';
import { useAuthStore } from '@/store/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isApproved: boolean;
  phoneNumber?: string;
  dateOfBirth?: string;
  levelPoint?: number;
  pointSource?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const { user, loading: authLoading, setUser } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [levelPoint, setLevelPoint] = useState('');
  const [pointSource, setPointSource] = useState('self_rated');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        const profileData = response.data;
        setProfile(profileData);
        
        // Set form values
        setFirstName(profileData.firstName || '');
        setLastName(profileData.lastName || '');
        setPhoneNumber(profileData.phoneNumber || '');
        setDateOfBirth(profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '');
        setLevelPoint(profileData.levelPoint?.toString() || '');
        setPointSource(profileData.pointSource || 'self_rated');
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]); // KHÔNG truyền levelPointInput vào đây!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData: {
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        levelPoint?: number | null;
        pointSource?: string;
      } = {
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
        dateOfBirth: dateOfBirth || undefined,
      };

      // Add level point fields for athletes
      if (user?.role === 'athlete') {
        updateData.levelPoint = levelPoint ? parseFloat(levelPoint) : null;
        updateData.pointSource = pointSource;
      }

      const response = await apiClient.patch('/users/profile', updateData);
      setProfile(response.data);
      setUser(response.data);
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
            >
              ← Quay lại trang chủ
            </Link>
            
            {user.role === 'athlete' && (
              <div className="mt-4">
                <Link
                  href="/profile/my-registrations"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Xem đăng ký của tôi
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Thông tin cá nhân
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Xem và cập nhật thông tin cá nhân của bạn
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="px-4 py-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    type="text"
                    label="Tên"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    disabled
                  />
                  <Input
                    type="text"
                    label="Họ"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    type="email"
                    label="Email"
                    value={profile?.email || ''}
                    disabled
                  />
                  <Input
                    type="tel"
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    type="date"
                    label="Ngày sinh"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                  />
                </div>

                {/* Athlete-specific fields */}
                {user.role === 'athlete' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Thông tin vận động viên
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Input
                        type="number"
                        step="0.001"
                        min="1.0"
                        max="10.0"
                        label="Điểm trình độ"
                        placeholder="Nhập điểm trình độ (ví dụ: 2.5)"
                        value={levelPoint}
                        onChange={e => setLevelPoint(e.target.value)}
                      />
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nguồn điểm
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="pointSource"
                              value="self_rated"
                              checked={pointSource === 'self_rated'}
                              onChange={e => setPointSource(e.target.value)}
                              className="mr-2"
                            />
                            Điểm tự chấm
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="pointSource"
                              value="sport_connect"
                              checked={pointSource === 'sport_connect'}
                              onChange={e => setPointSource(e.target.value)}
                              className="mr-2"
                            />
                            Điểm từ Sport Connect
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Read-only information */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Thông tin hệ thống
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Vai trò
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.role === 'admin' && 'Quản trị viên'}
                        {user.role === 'organizer' && 'Ban tổ chức'}
                        {user.role === 'referee' && 'Trọng tài'}
                        {user.role === 'athlete' && 'Vận động viên'}
                        {user.role === 'guest' && 'Khách'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Trạng thái
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.isApproved ? 'Đã phê duyệt' : 'Chờ phê duyệt'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 