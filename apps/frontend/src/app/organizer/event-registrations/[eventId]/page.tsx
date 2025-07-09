'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    tournament?: {
      id: number;
      name: string;
    };
  };
}

interface TournamentEvent {
  id: number;
  type: string;
  maxTeams: number;
  currentTeams: number;
  entryFee: number;
  prizes?: string;
  groupStagePoints: number;
  groupStageWinBy: number;
  groupStageBo: number;
  knockoutStagePoints: number;
  knockoutStageWinBy: number;
  knockoutStageBo: number;
}

export default function EventRegistrationsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request-info'>('approve');
  const [organizerNotes, setOrganizerNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const eventId = params.eventId as string;

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      router.push('/login');
      return;
    }

    fetchEventRegistrations();
  }, [user, router, eventId]);

  const fetchEventRegistrations = async () => {
    try {
      setLoading(true);
      const [registrationsResponse, eventResponse] = await Promise.all([
        apiClient.get(`/event-registrations/event/${eventId}`),
        apiClient.get(`/tournament-events/${eventId}`)
      ]);
      setRegistrations(registrationsResponse.data);
      setEvent(eventResponse.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch event registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (registration: EventRegistration, type: 'approve' | 'reject' | 'request-info') => {
    setSelectedRegistration(registration);
    setActionType(type);
    setOrganizerNotes('');
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRegistration) return;

    setProcessing(true);
    try {
      const endpoint = `/event-registrations/${selectedRegistration.id}/${actionType}`;
      await apiClient.patch(endpoint, {
        notes: organizerNotes || undefined,
      });

      setShowActionModal(false);
      setToastMessage(`Đăng ký đã được ${getActionLabel(actionType)} thành công!`);
      setToastType('success');
      setShowToast(true);

      // Refresh the list
      await fetchEventRegistrations();
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labelMap = {
      pending: 'Chờ phê duyệt',
      approved: 'Đã phê duyệt',
      rejected: 'Bị từ chối',
      cancelled: 'Đã hủy',
    };
    return labelMap[status as keyof typeof labelMap] || status;
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
            href="/organizer/pending-registrations"
            className="text-primary hover:text-primary/80"
          >
            ← Quay lại danh sách đăng ký
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý đăng ký - {event ? getEventTypeLabel(event.type) : 'Nội dung thi đấu'}
          </h1>
          {event && (
            <div className="mt-2 space-y-1 text-muted-foreground">
              <p>Phí tham gia: ${event.entryFee}</p>
              <p>Số đội: {event.currentTeams}/{event.maxTeams}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="bg-card shadow rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Chưa có đăng ký nào cho nội dung thi đấu này</p>
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
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(registration.status)}`}>
                      {getStatusLabel(registration.status)}
                    </span>
                    {registration.status === 'pending' && (
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
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Thông tin vận động viên</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Vận động viên chính:</span> {registration.user?.firstName} {registration.user?.lastName}</p>
                      <p><span className="font-medium">Email:</span> {registration.user?.email}</p>
                      <p><span className="font-medium">Điểm trình độ:</span> {registration.user?.levelPoint || 'N/A'}</p>
                    </div>
                  </div>

                  {registration.teammate && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Đồng đội</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Tên:</span> {registration.teammate.firstName} {registration.teammate.lastName}</p>
                        <p><span className="font-medium">Email:</span> {registration.teammate.email}</p>
                        <p><span className="font-medium">Điểm trình độ:</span> {registration.teammate.levelPoint || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {registration.teamName && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Tên đội</h4>
                    <p className="text-sm text-muted-foreground">{registration.teamName}</p>
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

                <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Phí đã thanh toán:</span> ${registration.paidAmount}
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Modal */}
        {showActionModal && selectedRegistration && (
          <Modal
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
            onConfirm={confirmAction}
            title={`${getActionLabel(actionType).charAt(0).toUpperCase() + getActionLabel(actionType).slice(1)} đăng ký`}
            confirmText={getActionLabel(actionType)}
            loading={processing}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Bạn có chắc chắn muốn {getActionLabel(actionType)} đăng ký của {selectedRegistration.user?.firstName} {selectedRegistration.user?.lastName}?
              </p>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={organizerNotes}
                  onChange={(e) => setOrganizerNotes(e.target.value)}
                  className="w-full p-3 border border-border rounded-md text-sm"
                  rows={3}
                  placeholder="Nhập ghi chú cho vận động viên..."
                />
              </div>
            </div>
          </Modal>
        )}

        {/* Toast */}
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
} 