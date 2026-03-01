/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { IBusinessType } from '@/types';

interface BusinessTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IBusinessType>;
  errors: Record<string, string>;
  submitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BusinessTypeModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  submitting,
  onInputChange,
  onSubmit,
}: BusinessTypeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Business Type' : 'Add New Business Type'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update' : 'Add'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Input
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={onInputChange}
            error={errors.name}
            fullWidth
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
