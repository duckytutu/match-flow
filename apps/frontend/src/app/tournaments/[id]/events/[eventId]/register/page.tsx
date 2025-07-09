'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AsyncSelectComponent } from '@/components/ui/async-select';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/store/auth';

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
  groupStageMaxPoints?: number;
  knockoutStagePoints: number;
  knockoutStageWinBy: number;
  knockoutStageBo: number;
  knockoutStageMaxPoints?: number;
}

interface Athlete {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  levelPoint?: number;
}

interface SelectOption {
  id: number;
  label: string;
  value: string;
}

interface RegistrationFormData {
  notes: string;
  teammateId?: number;
}

export default function RegisterEvent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [selectedTeammate, setSelectedTeammate] = useState<SelectOption | null>(null);

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<RegistrationFormData>({
    defaultValues: {
      notes: '',
    },
  });

  const watchedNotes = watch('notes');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/tournament-events/${params.eventId}`);
        setEvent(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch event');
      }
    };

    if (params.eventId) {
      fetchEvent();
    }
  }, [params.eventId]);

  const isDoublesEvent = (type: string) => {
    return type === 'doubles_male' || type === 'doubles_female' || type === 'doubles_mixed';
  };

  const searchAthletes = async (query: string): Promise<SelectOption[]> => {
    try {
      const response = await apiClient.get(`/users/athletes?search=${query}`);
      return response.data.map((athlete: Athlete) => ({
        id: athlete.id,
        label: `${athlete.firstName} ${athlete.lastName} (${athlete.email}) - Điểm: ${athlete.levelPoint || 'N/A'}`,
        value: athlete.email,
      }));
          } catch {
        return [];
      }
  };

  const onSubmit = () => {
    // Validate form
    if (isDoublesEvent(event?.type || '') && !selectedTeammate) {
      setError('Vui lòng chọn đồng đội cho nội dung đôi');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmRegistration = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const registrationData = {
        eventId: Number(params.eventId),
        notes: watchedNotes,
        teammateId: selectedTeammate?.id,
        // Backend sẽ tự động thêm userId từ JWT token
      };

      await apiClient.post('/event-registrations', registrationData);

      setShowConfirmModal(false);
      setToastMessage('Đăng ký tham gia thành công! Yêu cầu của bạn đã được gửi đến ban tổ chức để xét duyệt.');
      setToastType('success');
      setShowToast(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/tournaments/${params.id}`);
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      setShowConfirmModal(false);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/tournaments/${params.id}`}
            className="text-primary hover:text-primary/80"
          >
            ← Quay lại chi tiết giải đấu
          </Link>
        </div>

        <div className="bg-card shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-foreground mb-6">
              Đăng ký tham gia: {getEventTypeLabel(event.type)}
            </h3>
            
            {/* Thông tin nội dung thi đấu */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin nội dung thi đấu</h4>
              <div className="mb-2 text-gray-700">
                <span className="font-medium">Số đội:</span> {event.currentTeams}/{event.maxTeams}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-medium">Phí tham gia:</span> ${event.entryFee}
              </div>
              {event.prizes && (
                <div className="mb-2 text-gray-700">
                  <span className="font-medium">Giải thưởng:</span> {event.prizes}
                </div>
              )}
              <div className="mb-2 text-gray-700">
                <span className="font-medium">Luật thi đấu:</span>
                <div className="ml-2">
                  <div>Vòng bảng: Đến {event.groupStagePoints} điểm, cách {event.groupStageWinBy} điểm, BO{event.groupStageBo}</div>
                  <div>Vòng loại: Đến {event.knockoutStagePoints} điểm, cách {event.knockoutStageWinBy} điểm, BO{event.knockoutStageBo}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Vận động viên chính */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Vận động viên chính</h4>
                <Input
                  type="text"
                  label="Họ và tên"
                  value={`${user?.firstName} ${user?.lastName}`}
                  disabled
                />
                <Input
                  type="email"
                  label="Email"
                  value={user?.email || ''}
                  disabled
                />
                <Input
                  type="number"
                  label="Điểm trình độ"
                  value={user?.levelPoint?.toString() || 'N/A'}
                  disabled
                />
              </div>

              {/* Đồng đội cho nội dung đôi */}
              {isDoublesEvent(event.type) && (
                <AsyncSelectComponent
                  label="Thêm đồng đội"
                  placeholder="Tìm kiếm vận động viên..."
                  value={selectedTeammate}
                  onChange={(option: SelectOption | null) => setSelectedTeammate(option)}
                  loadOptions={searchAthletes}
                  isClearable
                  isSearchable
                />
              )}

              {/* Ghi chú */}
              <Textarea
                label="Ghi chú"
                {...register('notes')}
                rows={3}
                placeholder="Ghi chú thêm (nếu có)"
              />

              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-3">
                <Link href={`/tournaments/${params.id}`}>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRegistration}
        title="Xác nhận đăng ký tham gia"
        confirmText="Đăng ký"
        cancelText="Hủy"
        loading={loading}
      >
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Thông tin giải đấu</h5>
            <p className="text-sm text-gray-600">Nội dung: {getEventTypeLabel(event.type)}</p>
            <p className="text-sm text-gray-600">Phí tham gia: ${event.entryFee}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Thông tin vận động viên</h5>
            <p className="text-sm text-gray-600">Vận động viên chính: {user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-gray-600">Điểm trình độ: {user?.levelPoint || 'N/A'}</p>
            {selectedTeammate && (
              <p className="text-sm text-gray-600">Đồng đội: {selectedTeammate.label}</p>
            )}
          </div>

          {watchedNotes && (
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Ghi chú</h5>
              <p className="text-sm text-gray-600">{watchedNotes}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Yêu cầu đăng ký của bạn sẽ được gửi đến ban tổ chức để xét duyệt. 
              Bạn sẽ nhận được thông báo khi có kết quả.
            </p>
          </div>
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