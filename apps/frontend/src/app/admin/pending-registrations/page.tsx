'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
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
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    levelPoint?: number;
  };
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
  };
}

export default function PendingRegistrations() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request-info'>('approve');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'organizer')) {
      router.push('/login');
      return;
    }

    fetchPendingRegistrations();
  }, [user, router]);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/event-registrations/pending');
      setRegistrations(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch pending registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (registration: EventRegistration, type: 'approve' | 'reject' | 'request-info') => {
    setSelectedRegistration(registration);
    setActionType(type);
    setAdminNotes('');
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRegistration) return;

    setProcessing(true);
    try {
      const endpoint = `/event-registrations/${selectedRegistration.id}/${actionType}`;
      await apiClient.patch(endpoint, {
        notes: adminNotes || undefined,
      });

      setShowActionModal(false);
      setToastMessage(`Đăng ký đã được ${getActionLabel(actionType)} thành công!`);
      setToastType('success');
      setShowToast(true);

      // Refresh the list
      await fetchPendingRegistrations();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.';
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setProcessing(false);
    }
  };

  const getActionLabel = (type: string) => {
    const labels = {
      approve: 'phê duyệt',
      reject: 'từ chối',
      'request-info': 'yêu cầu thêm thông tin',
    };
    return labels[type as keyof typeof labels] || type;
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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-primary hover:text-primary/80"
          >
            ← Quay lại Admin Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Quản lý đăng ký đang chờ xét duyệt</h1>
          <p className="text-muted-foreground mt-2">
            Xét duyệt các yêu cầu đăng ký tham gia giải đấu từ vận động viên
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="bg-card shadow rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Không có đăng ký nào đang chờ xét duyệt</p>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => (
              <div key={registration.id} className="bg-card shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Đăng ký #{registration.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(registration.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAction(registration, 'approve')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Phê duyệt
                    </Button>
                    <Button
                      onClick={() => handleAction(registration, 'reject')}
                      size="sm"
                      variant="destructive"
                    >
                      Từ chối
                    </Button>
                    <Button
                      onClick={() => handleAction(registration, 'request-info')}
                      size="sm"
                      variant="outline"
                    >
                      Yêu cầu thêm thông tin
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Thông tin nội dung thi đấu</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Nội dung:</span> {getEventTypeLabel(registration.event.type)}</p>
                      <p><span className="font-medium">Phí tham gia:</span> ${registration.event.entryFee}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Thông tin vận động viên</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Vận động viên chính:</span> {registration.user?.firstName} {registration.user?.lastName}</p>
                      <p><span className="font-medium">Email:</span> {registration.user?.email}</p>
                      <p><span className="font-medium">Điểm trình độ:</span> {registration.user?.levelPoint || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {registration.teammate && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Đồng đội</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Tên:</span> {registration.teammate.firstName} {registration.teammate.lastName}</p>
                      <p><span className="font-medium">Email:</span> {registration.teammate.email}</p>
                      <p><span className="font-medium">Điểm trình độ:</span> {registration.teammate.levelPoint || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {registration.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Ghi chú từ vận động viên</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {registration.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={confirmAction}
        title={`${getActionLabel(actionType).charAt(0).toUpperCase() + getActionLabel(actionType).slice(1)} đăng ký`}
        confirmText={getActionLabel(actionType)}
        cancelText="Hủy"
        loading={processing}
      >
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Thông tin đăng ký</h5>
            <p className="text-sm text-gray-600">
              Vận động viên: {selectedRegistration?.user?.firstName} {selectedRegistration?.user?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Nội dung: {selectedRegistration ? getEventTypeLabel(selectedRegistration.event.type) : ''}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú từ ban tổ chức (tùy chọn)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Nhập ghi chú nếu cần..."
            />
          </div>

          {actionType === 'approve' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Lưu ý:</strong> Khi phê duyệt, vận động viên sẽ được thông báo và có thể tham gia giải đấu.
              </p>
            </div>
          )}

          {actionType === 'reject' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Lưu ý:</strong> Khi từ chối, vận động viên sẽ nhận được thông báo và không thể tham gia giải đấu.
              </p>
            </div>
          )}

          {actionType === 'request-info' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Vận động viên sẽ nhận được yêu cầu cung cấp thêm thông tin.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
} 