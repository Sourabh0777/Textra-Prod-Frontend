import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ICarBrand } from '@/types';

interface CarBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<ICarBrand>;
  setFormData: (data: any) => void;
  isEdit: boolean;
}

export function CarBrandModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }: CarBrandModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Car Brand' : 'Create New Car Brand'}
      onConfirm={onSubmit}
      confirmText={isEdit ? 'Update' : 'Create'}
    >
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <Input
          label="Brand Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Maruti Suzuki"
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
