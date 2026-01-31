/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { IBusiness } from '@/types';

interface WhatsAppConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<IBusiness>;
  errors: Record<string, string>;
  submitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WhatsAppConnectionModal({
  isOpen,
  onClose,
  formData,
  errors,
  submitting,
  onInputChange,
  onSubmit,
}: WhatsAppConnectionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Connection Settings"
      onConfirm={onSubmit}
      confirmText="Save Connection Settings"
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Input
            label="Phone Number *"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onInputChange}
            error={errors.phone_number}
            fullWidth
          />
          <Input
            label="WABA ID *"
            name="waba_id"
            value={formData.waba_id || ''}
            onChange={onInputChange}
            error={errors.waba_id}
            fullWidth
          />
          <Input
            label="Phone Number ID *"
            name="phone_number_id"
            value={formData.phone_number_id || ''}
            onChange={onInputChange}
            error={errors.phone_number_id}
            fullWidth
          />
          <Input
            label="Phone Number Display (Optional)"
            name="phone_number_display"
            value={formData.phone_number_display || ''}
            onChange={onInputChange}
            fullWidth
          />
          <Input
            label="Access Token (Optional)"
            name="access_token"
            value={formData.access_token || ''}
            onChange={onInputChange}
            type="password"
            fullWidth
          />
          <Select
            label="Status"
            name="is_active"
            value={String(formData.is_active ?? true)}
            onChange={onInputChange}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            fullWidth
          />
        </form>
      </div>
    </Modal>
  );
}
