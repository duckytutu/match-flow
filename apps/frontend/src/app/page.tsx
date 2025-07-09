'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      // Check if user is already logged in
      if (user) {
        router.push('/dashboard');
      } else {
        // Redirect to tournaments page for guest users
        router.push('/tournaments');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Đang chuyển hướng...</div>
    </div>
  );
}
