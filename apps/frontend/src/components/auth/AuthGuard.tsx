'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  publicRoutes?: string[];
  protectedRoutes?: string[];
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  publicRoutes = [], 
  protectedRoutes = [],
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, loading, initialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => {
      if (route.includes('[') && route.includes(']')) {
        // Handle dynamic routes like /tournaments/[id]
        const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(pathname);
      }
      return pathname === route;
    });

    // Check if current route is protected
    const isProtectedRoute = protectedRoutes.some(route => {
      if (route.includes('[') && route.includes(']')) {
        const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(pathname);
      }
      return pathname === route;
    });

    // If route is public, allow access
    if (isPublicRoute) {
      setIsAuthorized(true);
      return;
    }

    // If route is protected and user is not authenticated, redirect
    if (isProtectedRoute && !user) {
      router.push(redirectTo);
      return;
    }

    // If user is authenticated, allow access
    if (user) {
      setIsAuthorized(true);
      return;
    }

    // Default: redirect to login if not authenticated
    if (!user) {
      router.push(redirectTo);
      return;
    }
  }, [user, loading, initialized, pathname, publicRoutes, protectedRoutes, redirectTo, router]);

  // Show loading while checking auth
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Redirecting...</div>
    </div>
  );
} 