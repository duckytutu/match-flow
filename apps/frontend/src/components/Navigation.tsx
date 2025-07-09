'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

export default function Navigation() {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const isAthlete = user?.role === 'athlete';

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
            {isAthlete && (
              <Link href="/profile/my-registrations" className="text-gray-800 hover:text-gray-600">
                Đăng ký của tôi
              </Link>
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
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-800 hover:text-gray-600 px-4 py-2 rounded"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 