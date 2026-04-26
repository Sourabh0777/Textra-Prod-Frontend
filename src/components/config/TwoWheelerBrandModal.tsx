import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ITwoWheelerBrand } from '@/types';

interface TwoWheelerBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<ITwoWheelerBrand>;
  setFormData: (data: any) => void;
  isEdit: boolean;
}

export function TwoWheelerBrandModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }: TwoWheelerBrandModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Two-Wheeler Brand' : 'Create New Two-Wheeler Brand'}
      onConfirm={onSubmit}
      confirmText={isEdit ? 'Update' : 'Create'}
    >
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <Input
          label="Brand Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Honda"
          required
          fullWidth
        />
        <Select
          label="Status"
          value={formData.is_active !== false ? 'true' : 'false'}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
          options={[
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ]}
          fullWidth
        />
      </form>
    </Modal>
  );
}
