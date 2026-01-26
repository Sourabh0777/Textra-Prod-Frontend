/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { IBusiness, IBusinessType } from '@/types';

interface BusinessProfileFormProps {
  formData: Partial<IBusiness>;
  errors: Record<string, string>;
  businessTypes: IBusinessType[] | undefined;
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

export function BusinessProfileForm({
  formData,
  errors,
  businessTypes,
  saving,
  onInputChange,
  onSave,
}: BusinessProfileFormProps) {
  return (
    <Card>
      <CardBody className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{errors.general}</div>
        )}

        {/* Business Type */}
        <Select
          label="Business Type"
          name="business_type_id"
          value={formData.business_type_id || ''}
          onChange={onInputChange}
          options={
            businessTypes?.map((type) => ({
              value: type?._id || '',
              label: type?.name || '',
            })) || []
          }
          error={errors.business_type_id}
          fullWidth
          disabled
        />

        <Input
          label="Business Name"
          name="business_name"
          value={formData.business_name || ''}
          onChange={onInputChange}
          error={errors.business_name}
          fullWidth
        />

        <Input
          label="Owner Name"
          name="owner_name"
          value={formData.owner_name || ''}
          onChange={onInputChange}
          error={errors.owner_name}
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
          label="City"
          name="city"
          value={formData.city || ''}
          onChange={onInputChange}
          error={errors.city}
          fullWidth
        />

        <Input
          label="Address"
          name="address"
          value={formData.address || ''}
          onChange={onInputChange}
          error={errors.address}
          fullWidth
        />

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-3">WhatsApp Configuration</h3>

          <Input
            label="WABA ID"
            name="waba_id"
            value={formData.waba_id || ''}
            onChange={onInputChange}
            error={errors.waba_id}
            fullWidth
            disabled
          />

          <Input
            label="Phone Number ID"
            name="phone_number_id"
            value={formData.phone_number_id || ''}
            onChange={onInputChange}
            error={errors.phone_number_id}
            fullWidth
            disabled
          />

          <Input
            label="Display Number"
            name="phone_number_display"
            value={formData.phone_number_display || ''}
            onChange={onInputChange}
            error={errors.phone_number_display}
            fullWidth
            disabled
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button loading={saving} onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
