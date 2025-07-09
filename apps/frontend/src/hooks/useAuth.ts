'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/auth';

export const useAuth = () => {
  const { user, loading, setUser, setLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    if (!user) {
      setLoading(true);
      apiClient.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setUser(userData);
      router.push('/dashboard');
      return { success: true };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        error: axiosError.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    try {
      await apiClient.post('/auth/register', userData);
      return { success: true };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        error: axiosError.response?.data?.message || 'Registration failed'
      };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const isAthlete = user?.role === 'athlete';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isOrganizer,
    isAthlete,
    login,
    register,
    logout,
    setUser,
    setLoading,
  };
}; 