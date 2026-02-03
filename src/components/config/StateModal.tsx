import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { IState } from '@/types';

interface StateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<IState>;
  setFormData: (data: any) => void;
  isEdit: boolean;
}

export function StateModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }: StateModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit State' : 'Create New State'}
      onConfirm={onSubmit}
      confirmText={isEdit ? 'Update' : 'Create'}
    >
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <Input
          label="State Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. New Delhi"
          required
          fullWidth
        />
        <Select
          label="Status"
          value={formData.is_active ? 'true' : 'false'}
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
