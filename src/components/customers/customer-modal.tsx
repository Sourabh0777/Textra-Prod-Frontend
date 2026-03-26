/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ICustomer, IBusiness } from '@/types';
import { Info } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<ICustomer>;
  errors: Record<string, string>;
  businesses: IBusiness[];
  submitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CustomerModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  businesses,
  submitting,
  onInputChange,
  onSubmit,
}: CustomerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Customer' : 'Add New Customer'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Customer' : 'Add Customer'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {!isEditMode && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 flex items-start space-x-3 text-sm">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Customer Consent</p>
                <p className="mt-1 text-blue-700">
                  By adding this customer, you confirm that they have given consent to receive WhatsApp notifications
                  and messages related to bike service.
                </p>
              </div>
            </div>
          )}
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Business"
            name="business_id"
            value={
              typeof formData.business_id === 'object' ? (formData.business_id as any)?._id : formData.business_id || ''
            }
            onChange={onInputChange}
            options={businesses.map((business: IBusiness) => ({
              value: business._id || '',
              label: business.business_name,
            }))}
            error={errors.business_id}
            fullWidth
            disabled
          />
          <Input
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={onInputChange}
            error={errors.name}
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
            label="Email (Optional)"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={onInputChange}
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
            disabled
          />
        </form>
      </div>
    </Modal>
  );
}
