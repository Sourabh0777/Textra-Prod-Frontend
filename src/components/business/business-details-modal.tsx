/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { IBusiness, IBusinessType } from '@/types';

interface BusinessDetailsModalProps {
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

export function BusinessDetailsModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  businessTypes,
  submitting,
  onInputChange,
  onSubmit,
}: BusinessDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Business Details' : 'Add New Business'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Details' : 'Add Business'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Business Type *"
            name="business_type_id"
            value={(formData.business_type_id as any) || ''}
            onChange={onInputChange}
            options={businessTypes.map((type: IBusinessType) => ({
              value: type._id || '',
              label: type.name,
            }))}
            error={errors.business_type_id}
            fullWidth
          />
          <Input
            label="Business Name *"
            name="business_name"
            value={formData.business_name || ''}
            onChange={onInputChange}
            error={errors.business_name}
            fullWidth
          />
          <Input
            label="Owner Name *"
            name="owner_name"
            value={formData.owner_name || ''}
            onChange={onInputChange}
            error={errors.owner_name}
            fullWidth
          />
          <Input
            label="Email (Optional)"
            name="email"
            value={formData.email || ''}
            onChange={onInputChange}
            error={errors.email}
            fullWidth
          />
          <Input
            label="Address *"
            name="address"
            value={formData.address || ''}
            onChange={onInputChange}
            error={errors.address}
            fullWidth
          />
          <Input
            label="Phone Number *"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onInputChange}
            error={errors.phone_number}
            fullWidth
          />
        </form>
      </div>
    </Modal>
  );
}
