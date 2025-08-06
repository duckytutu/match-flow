import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

interface TournamentFormData {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  entryFee?: number;
  type?: string;
  maxParticipants?: number;
}

interface TournamentFormProps {
  initialData?: Partial<TournamentFormData>;
  onSubmit: (data: TournamentFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function TournamentForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  loading = false,
  submitLabel = 'Tạo giải đấu'
}: TournamentFormProps) {
  const [formData, setFormData] = React.useState<TournamentFormData>({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    entryFee: 0,
    type: '',
    maxParticipants: 0,
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof TournamentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên giải đấu *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập tên giải đấu"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Mô tả chi tiết về giải đấu"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa điểm *
          </label>
          <Input
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Địa điểm tổ chức"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại giải đấu
          </label>
          <Select
            value={formData.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            options={[
              { value: 'singles', label: 'Đơn' },
              { value: 'doubles', label: 'Đôi' },
              { value: 'mixed', label: 'Hỗn hợp' }
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày bắt đầu *
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày kết thúc
          </label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phí tham gia ($)
          </label>
          <Input
            type="number"
            value={formData.entryFee}
            onChange={(e) => handleChange('entryFee', Number(e.target.value))}
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số người tham gia tối đa
          </label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => handleChange('maxParticipants', Number(e.target.value))}
            placeholder="Không giới hạn"
            min="1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : submitLabel}
        </Button>
      </div>
    </form>
  );
} 