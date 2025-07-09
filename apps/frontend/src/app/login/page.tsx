'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loading: authLoading, setUser } = useAuthStore();
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
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser(user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      
      // Check if it's an approval error
      if (errorMessage.includes('not approved') || errorMessage.includes('chờ admin')) {
        setError('Tài khoản của bạn chưa được phê duyệt. Vui lòng liên hệ admin hoặc chờ phê duyệt.');
      } else {
        setError(errorMessage);
      }
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
            Đăng nhập
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
          </div>

          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Đăng ký
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 