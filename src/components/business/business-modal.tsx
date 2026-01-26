/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { IBusiness, IBusinessType } from '@/types';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IBusiness>;
  errors: Record<string, string>;
  businessTypes: IBusinessType[];
  submitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BusinessModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  businessTypes,
  submitting,
  onInputChange,
  onSubmit,
}: BusinessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Business' : 'Add New Business'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Business' : 'Add Business'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Business Type"
            name="business_type_id"
            value={formData.business_type_id || ''}
            onChange={onInputChange}
            options={businessTypes.map((type: IBusinessType) => ({
              value: type._id || '',
              label: type.name,
            }))}
            error={errors.business_type_id}
            fullWidth
          />
          <Input
            label="Business Name"
            name="business_name"
            value={formData.business_name || ''}
            onChange={onInputChange}
            error={errors.business_name}
            fullWidth
          />
          <Input
            label="Owner Name"
            name="owner_name"
            value={formData.owner_name || ''}
            onChange={onInputChange}
            error={errors.owner_name}
            fullWidth
          />
          <Input
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onInputChange}
            error={errors.phone_number}
            fullWidth
          />
          <Input
            label="Address"
            name="address"
            value={formData.address || ''}
            onChange={onInputChange}
            error={errors.address}
            fullWidth
          />
          <Input
            label="City"
            name="city"
            value={formData.city || ''}
            onChange={onInputChange}
            error={errors.city}
            fullWidth
          />
          <Input
            label="WABA ID"
            name="waba_id"
            value={formData.waba_id || ''}
            onChange={onInputChange}
            error={errors.waba_id}
            fullWidth
          />
          <Input
            label="Phone Number ID"
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
