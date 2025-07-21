'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const isAthlete = user?.role === 'athlete';
  const isReferee = user?.role === 'referee';

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/tournaments" className="text-gray-800 hover:text-gray-600">
              Giải đấu
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-800 hover:text-gray-600">
                Trang chủ
              </Link>
            )}
            {user && (
              <Link href="/profile" className="text-gray-800 hover:text-gray-600">
                Hồ sơ cá nhân
              </Link>
            )}
            {isOrganizer && (
              <>
                <Link href="/tournaments/my-tournaments" className="text-gray-800 hover:text-gray-600">
                  Giải đấu của tôi
                </Link>
                <Link href="/organizer/pending-registrations" className="text-gray-800 hover:text-gray-600">
                  Quản lý đăng ký
                </Link>
              </>
            )}
            {(isAthlete || isReferee) && (
              <>
                <Link href="/profile/my-registrations" className="text-gray-800 hover:text-gray-600">
                  Đăng ký của tôi
                </Link>
                <Link href="/matches/my-assignments" className="text-gray-800 hover:text-gray-600">
                  Trận đấu được giao
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link href="/admin" className="text-gray-800 hover:text-gray-600">
                  Quản lý hệ thống
                </Link>
                <Link href="/admin/pending-tournaments" className="text-gray-800 hover:text-gray-600">
                  Giải đấu chờ duyệt
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  Xin chào, {user.firstName} {user.lastName}
                </span>
                <Button onClick={logout} variant="destructive" size="sm">
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 