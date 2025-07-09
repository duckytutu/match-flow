'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('athlete');
  const [levelPoint, setLevelPoint] = useState('');
  const [pointSource, setPointSource] = useState('self_rated');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
        levelPoint?: number | null;
        pointSource?: string;
      } = {
        email,
        password,
        firstName,
        lastName,
        role,
      };

      // Add level point fields for athletes
      if (role === 'athlete') {
        userData.levelPoint = levelPoint ? parseFloat(levelPoint) : null;
        userData.pointSource = pointSource;
      }

      const response = await apiClient.post('/auth/register', userData);
      
      // All new users need admin approval
      setSuccess(response.data.message || 'Đăng ký thành công! Vui lòng chờ admin phê duyệt trước khi có thể đăng nhập.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Đăng ký thất bại');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              label="Tên"
              placeholder="Nhập tên của bạn"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <Input
              type="text"
              label="Họ"
              placeholder="Nhập họ của bạn"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Select
              label="Vai trò"
              value={role}
              onChange={e => setRole(e.target.value)}
              options={[
                { value: 'athlete', label: 'Vận động viên' },
                { value: 'organizer', label: 'Ban tổ chức' },
                { value: 'referee', label: 'Trọng tài' },
              ]}
              required
            />

            {role === 'athlete' && (
              <>
                <Input
                  type="number"
                  step="0.001"
                  min="1.0"
                  max="5.0"
                  label="Điểm trình độ"
                  placeholder="Nhập điểm trình độ (ví dụ: 3.5)"
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
              </>
            )}
          </div>

          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 