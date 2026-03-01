import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { IZone, IState } from '@/types';

interface ZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Partial<IZone>;
  setFormData: (data: any) => void;
  states: IState[];
  isEdit: boolean;
}

export function ZoneModal({ isOpen, onClose, onSubmit, formData, setFormData, states, isEdit }: ZoneModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Zone' : 'Create New Zone'}
      onConfirm={onSubmit}
      confirmText={isEdit ? 'Update' : 'Create'}
    >
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <Input
          label="Zone Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Central Delhi"
          required
          fullWidth
        />
        <Select
          label="State"
          value={typeof formData.state_id === 'string' ? formData.state_id : formData.state_id?._id || ''}
          onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
          options={states.map((s) => ({ label: s.name, value: s._id || '' }))}
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
