'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

interface Event {
  type: string;
  maxTeams: number;
  entryFee: number;
  prizes?: string;
  groupStagePoints?: number;
  groupStageWinBy?: number;
  groupStageBo?: number;
  groupStageMaxPoints?: number;
  knockoutStagePoints?: number;
  knockoutStageWinBy?: number;
  knockoutStageBo?: number;
  knockoutStageMaxPoints?: number;
}

export default function CreateTournament() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
  });
  const [events, setEvents] = useState<Event[]>([
    {
      type: 'singles_male',
      maxTeams: 16,
      entryFee: 0,
      prizes: '',
      groupStagePoints: 11,
      groupStageWinBy: 1,
      groupStageBo: 1,
      knockoutStagePoints: 11,
      knockoutStageWinBy: 1,
      knockoutStageBo: 1,
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await apiClient.post('/tournaments', {
        ...formData,
        events: events.filter(event => event.type.trim() !== '')
      });

      router.push('/tournaments');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventChange = (index: number, field: keyof Event, value: string | number | undefined) => {
    setEvents(prev => prev.map((event, i) => 
      i === index ? { ...event, [field]: value } : event
    ));
  };

  const addEvent = () => {
    setEvents(prev => [...prev, {
      type: 'singles_male',
      maxTeams: 16,
      entryFee: 0,
      prizes: '',
      groupStagePoints: 11,
      groupStageWinBy: 1,
      groupStageBo: 1,
      knockoutStagePoints: 11,
      knockoutStageWinBy: 1,
      knockoutStageBo: 1,
    }]);
  };

  const removeEvent = (index: number) => {
    if (events.length > 1) {
      setEvents(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/tournaments"
            className="text-primary hover:text-primary/80"
          >
            ← Quay lại danh sách giải đấu
          </Link>
        </div>

        <div className="bg-card shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-foreground mb-6">
              Tạo giải đấu mới
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Thông tin giải đấu */}
              <div className="space-y-6">
                <h4 className="text-md font-medium text-foreground">Thông tin giải đấu</h4>
                
                <Input
                  type="text"
                  label="Tên giải đấu *"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên giải đấu"
                />

                <Textarea
                  label="Mô tả"
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về giải đấu"
                />

                <Input
                  type="text"
                  label="Địa điểm *"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa điểm tổ chức"
                />

                <Input
                  type="date"
                  label="Ngày bắt đầu *"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Nội dung thi đấu */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-foreground">Nội dung thi đấu</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEvent}
                    className="text-sm"
                  >
                    + Thêm nội dung
                  </Button>
                </div>

                {events.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium">Nội dung {index + 1}</h5>
                      {events.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEvent(index)}
                          className="text-destructive"
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Select
                        label="Loại thi đấu *"
                        value={event.type}
                        onChange={(e) => handleEventChange(index, 'type', e.target.value)}
                        options={[
                          { value: 'singles_male', label: 'Đơn nam' },
                          { value: 'singles_female', label: 'Đơn nữ' },
                          { value: 'doubles_male', label: 'Đôi nam' },
                          { value: 'doubles_female', label: 'Đôi nữ' },
                          { value: 'doubles_mixed', label: 'Đôi nam nữ' },
                        ]}
                      />
                      <Input
                        type="number"
                        label="Số đội tối đa *"
                        value={event.maxTeams}
                        onChange={(e) => handleEventChange(index, 'maxTeams', parseInt(e.target.value))}
                        min="2"
                        max="128"
                        required
                      />
                      <Input
                        type="number"
                        label="Phí tham gia ($)"
                        value={event.entryFee}
                        onChange={(e) => handleEventChange(index, 'entryFee', parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <Textarea
                      label="Giải thưởng"
                      value={event.prizes || ''}
                      onChange={(e) => handleEventChange(index, 'prizes', e.target.value)}
                      rows={2}
                      placeholder="Mô tả giải thưởng..."
                    />
                    {/* Luật thi đấu vòng bảng */}
                    <div className="space-y-4">
                      <h6 className="text-sm font-medium">Luật thi đấu vòng bảng</h6>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <Select
                          label="Điểm đến"
                          value={event.groupStagePoints?.toString() || '11'}
                          onChange={(e) => handleEventChange(index, 'groupStagePoints', parseInt(e.target.value))}
                          options={[
                            { value: '11', label: '11' },
                            { value: '15', label: '15' },
                          ]}
                        />
                        <Select
                          label="Cách điểm"
                          value={event.groupStageWinBy?.toString() || '1'}
                          onChange={(e) => handleEventChange(index, 'groupStageWinBy', parseInt(e.target.value))}
                          options={[
                            { value: '1', label: 'Cách 1' },
                            { value: '2', label: 'Cách 2' },
                          ]}
                        />
                        <Input
                          type="number"
                          label="Điểm tối đa (nếu cách 2)"
                          value={event.groupStageMaxPoints || ''}
                          onChange={(e) => handleEventChange(index, 'groupStageMaxPoints', e.target.value ? parseInt(e.target.value) : undefined)}
                          min="13"
                          max="25"
                        />
                        <Select
                          label="BO (Best of)"
                          value={event.groupStageBo?.toString() || '1'}
                          onChange={(e) => handleEventChange(index, 'groupStageBo', parseInt(e.target.value))}
                          options={[
                            { value: '1', label: 'BO1' },
                            { value: '3', label: 'BO3' },
                          ]}
                        />
                      </div>
                    </div>
                    {/* Luật thi đấu vòng loại */}
                    <div className="space-y-4">
                      <h6 className="text-sm font-medium">Luật thi đấu vòng loại</h6>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <Select
                          label="Điểm đến"
                          value={event.knockoutStagePoints?.toString() || '11'}
                          onChange={(e) => handleEventChange(index, 'knockoutStagePoints', parseInt(e.target.value))}
                          options={[
                            { value: '11', label: '11' },
                            { value: '15', label: '15' },
                          ]}
                        />
                        <Select
                          label="Cách điểm"
                          value={event.knockoutStageWinBy?.toString() || '1'}
                          onChange={(e) => handleEventChange(index, 'knockoutStageWinBy', parseInt(e.target.value))}
                          options={[
                            { value: '1', label: 'Cách 1' },
                            { value: '2', label: 'Cách 2' },
                          ]}
                        />
                        <Input
                          type="number"
                          label="Điểm tối đa (nếu cách 2)"
                          value={event.knockoutStageMaxPoints || ''}
                          onChange={(e) => handleEventChange(index, 'knockoutStageMaxPoints', e.target.value ? parseInt(e.target.value) : undefined)}
                          min="13"
                          max="25"
                        />
                        <Select
                          label="BO (Best of)"
                          value={event.knockoutStageBo?.toString() || '1'}
                          onChange={(e) => handleEventChange(index, 'knockoutStageBo', parseInt(e.target.value))}
                          options={[
                            { value: '1', label: 'BO1' },
                            { value: '3', label: 'BO3' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-3">
                <Link href="/tournaments">
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo giải đấu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 