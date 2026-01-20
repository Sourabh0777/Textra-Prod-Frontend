'use client';

import type React from 'react';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { IBusiness } from '@/types';

interface BusinessFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (business: IBusiness) => void;
}

export function BusinessFormModal({ isOpen, onClose, onSubmit }: BusinessFormModalProps) {
  const [formData, setFormData] = useState<Partial<IBusiness>>({
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'is_active' ? value === 'true' : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.business_name) newErrors.business_name = 'Business name is required';
    if (!formData.owner_name) newErrors.owner_name = 'Owner name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.business_type_id) newErrors.business_type_id = 'Business type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData as IBusiness);
    setFormData({ is_active: true });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Business"
      onConfirm={handleSubmit}
      confirmText="Add Business"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Business Type"
          name="business_type_id"
          value={formData.business_type_id || ''}
          onChange={handleChange}
          options={[
            { value: '101', label: 'Service Center' },
            { value: '102', label: 'Retail Shop' },
          ]}
          error={errors.business_type_id}
          fullWidth
        />
        <Input
          label="Business Name"
          name="business_name"
          value={formData.business_name || ''}
          onChange={handleChange}
          error={errors.business_name}
          fullWidth
        />
        <Input
          label="Owner Name"
          name="owner_name"
          value={formData.owner_name || ''}
          onChange={handleChange}
          error={errors.owner_name}
          fullWidth
        />
        <Input
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number || ''}
          onChange={handleChange}
          error={errors.phone_number}
          fullWidth
        />
        <Input label="Address" name="address" value={formData.address || ''} onChange={handleChange} fullWidth />
        <Input label="City" name="city" value={formData.city || ''} onChange={handleChange} fullWidth />
        <Select
          label="Status"
          name="is_active"
          value={String(formData.is_active)}
          onChange={handleChange}
          options={[
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' },
          ]}
          fullWidth
        />
      </form>
    </Modal>
  );
}
