import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { IReminder, IService } from '@/types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IReminder>;
  errors: Record<string, string>;
  services: IService[];
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReminderModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  services,
  loading,
  onChange,
  onSubmit,
}: ReminderModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Reminder' : 'Add New Reminder'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Reminder' : 'Add Reminder'}
      loading={loading}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Service"
            name="service_id"
            value={
              typeof formData.service_id === 'object' ? (formData.service_id as any)?._id : formData.service_id || ''
            }
            onChange={onChange}
            options={services.map((service: IService) => {
              const vehicle = service.vehicle_id as any;
              const regNo = typeof vehicle === 'object' ? vehicle?.registration_number : 'Unknown';
              const model = typeof vehicle === 'object' ? `${vehicle?.brand} ${vehicle?.vehicle_model}` : '';
              return {
                value: service._id || '',
                label: `${model} (${regNo}) - ${service._id?.slice(-6)}`,
              };
            })}
            error={errors.service_id}
            fullWidth
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Scheduled For (Notification)"
              name="scheduled_for"
              type="date"
              value={formData.scheduled_for ? new Date(formData.scheduled_for).toISOString().split('T')[0] : ''}
              onChange={onChange}
              error={errors.scheduled_for}
              fullWidth
            />
            <Input
              label="Due Date (Next Service)"
              name="due_date"
              type="date"
              value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : ''}
              onChange={onChange}
              error={errors.due_date}
              fullWidth
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={formData.status || 'pending'}
              onChange={onChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'sent', label: 'Sent' },
                { value: 'failed', label: 'Failed' },
                { value: 'completed', label: 'Completed' },
              ]}
              error={errors.status}
              fullWidth
            />
            <Input
              label="Retry Count"
              name="retry_count"
              type="number"
              value={formData.retry_count || 0}
              onChange={onChange}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">Pending Details / Internal Notes</label>
            <textarea
              name="pending_details"
              value={formData.pending_details || ''}
              onChange={onChange}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
