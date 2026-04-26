import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { ITwoWheelerModel } from '@/types';

interface TwoWheelerModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<ITwoWheelerModel>;
  setFormData: (data: any) => void;
  isEdit: boolean;
}

export function TwoWheelerModelModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }: TwoWheelerModelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Two-Wheeler Model' : 'Add New Two-Wheeler Model'}
      onConfirm={onSubmit}
      confirmText={isEdit ? 'Update' : 'Create'}
    >
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <Input
          label="Model Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Activa 6G"
          required
          fullWidth
        />
      </form>
    </Modal>
  );
}
