/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { IBusiness, IBusinessType, IState, IZone } from '@/types';

interface BusinessDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IBusiness>;
  errors: Record<string, string>;
  businessTypes: IBusinessType[];
  states?: IState[];
  zones?: IZone[];
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
  states,
  zones,
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
            value={
              typeof formData.business_type_id === 'object'
                ? (formData.business_type_id as any)?._id
                : (formData.business_type_id as any) || ''
            }
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
            label="City *"
            name="city"
            value={formData.city || ''}
            onChange={onInputChange}
            error={errors.city}
            fullWidth
          />
          <Select
            label="State *"
            name="state_id"
            value={
              typeof formData.state_id === 'object' ? (formData.state_id as any)?._id : (formData.state_id as any) || ''
            }
            onChange={onInputChange}
            options={
              states?.map((s) => ({
                value: s._id || '',
                label: s.name,
              })) || []
            }
            error={errors.state_id}
            fullWidth
          />
          <Select
            label="Zone *"
            name="zone_id"
            value={
              typeof formData.zone_id === 'object' ? (formData.zone_id as any)?._id : (formData.zone_id as any) || ''
            }
            onChange={onInputChange}
            options={
              zones?.map((z) => ({
                value: z._id || '',
                label: z.name,
              })) || []
            }
            error={errors.zone_id}
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
