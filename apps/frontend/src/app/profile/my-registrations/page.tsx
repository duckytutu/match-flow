'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/store/auth';

interface EventRegistration {
  id: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  teamName?: string;
  notes?: string;
  paidAmount: number;
  isPaid: boolean;
  teammateId?: number;
  createdAt: string;
  updatedAt: string;
  teammate?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    levelPoint?: number;
  };
  event: {
    id: number;
    type: string;
    entryFee: number;
    tournament?: {
      id: number;
      name: string;
    };
  };
}

export default function MyRegistrations() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchMyRegistrations();
  }, [user, router]);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/event-registrations/user/${user!.id}`);
      setRegistrations(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      pending: { label: 'Chờ xét duyệt', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getEventTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'singles_male': 'Đơn nam',
      'singles_female': 'Đơn nữ',
      'doubles_male': 'Đôi nam',
      'doubles_female': 'Đôi nữ',
      'doubles_mixed': 'Đôi nam nữ',
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="text-primary hover:text-primary/80"
          >
            ← Quay lại Profile
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Đăng ký của tôi</h1>
          <p className="text-muted-foreground mt-2">
            Xem trạng thái các đăng ký tham gia giải đấu của bạn
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="bg-card shadow rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">Bạn chưa có đăng ký nào</p>
            <Link href="/tournaments">
              <Button>
                Xem các giải đấu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => {
              const statusInfo = getStatusLabel(registration.status);
              
              return (
                <div key={registration.id} className="bg-card shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {registration.event.tournament?.name || 'Giải đấu không xác định'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getEventTypeLabel(registration.event.type)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(registration.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Thông tin giải đấu</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Giải đấu:</span> {registration.event.tournament?.name || 'Không xác định'}</p>
                        <p><span className="font-medium">Nội dung:</span> {getEventTypeLabel(registration.event.type)}</p>
                        <p><span className="font-medium">Phí tham gia:</span> ${registration.event.entryFee}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Thông tin thanh toán</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Đã thanh toán:</span> ${registration.paidAmount}</p>
                        <p><span className="font-medium">Trạng thái:</span> 
                          <span className={registration.isPaid ? 'text-green-600' : 'text-yellow-600'}>
                            {registration.isPaid ? ' Đã thanh toán' : ' Chưa thanh toán'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {registration.teammate && (
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">Đồng đội</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Tên:</span> {registration.teammate.firstName} {registration.teammate.lastName}</p>
                        <p><span className="font-medium">Email:</span> {registration.teammate.email}</p>
                        <p><span className="font-medium">Điểm trình độ:</span> {registration.teammate.levelPoint || 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  {registration.notes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">Ghi chú</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {registration.notes}
                      </p>
                    </div>
                  )}

                  {registration.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        <strong>Lý do từ chối:</strong> {registration.notes || 'Không có lý do cụ thể'}
                      </p>
                    </div>
                  )}

                  {registration.status === 'approved' && !registration.isPaid && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Đăng ký của bạn đã được phê duyệt. Vui lòng thanh toán phí tham gia để hoàn tất.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    {registration.event.tournament && (
                      <Link href={`/tournaments/${registration.event.tournament.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết giải đấu
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 