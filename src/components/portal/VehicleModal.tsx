'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { TWO_WHEELER_TYPES } from '@/constants/vehicle-types';
import { useFetchTwoWheelerBrandsQuery } from '@/lib/api/endpoints/twoWheelerBrandsApi';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export const VehicleModal = ({ isOpen, onClose, onSave, initialData, isLoading }: VehicleModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const { data: brands = [], isLoading: isLoadingBrands } = useFetchTwoWheelerBrandsQuery(undefined, {
    skip: !isOpen,
  });

  const brandOptions = useMemo(() => {
    return (brands || [])
      .filter((b: any) => b.is_active)
      .map((b: any) => ({
        value: b.name,
        label: b.name,
      }));
  }, [brands]);

  const modelOptions = useMemo(() => {
    if (!formData.brand) return [];
    const selectedBrand = (brands || []).find((b: any) => b.name === formData.brand);
    if (!selectedBrand || !selectedBrand.models) return [];
    return selectedBrand.models.map((m: any) => ({
      value: m.name,
      label: m.name,
    }));
  }, [brands, formData.brand]);

  const handleBrandSelection = (val: string) => {
    setFormData({ ...formData, brand: val, vehicle_model: '' });
  };

  const handleModelSelection = (val: string) => {
    setFormData({ ...formData, vehicle_model: val });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.vehicle_type) newErrors.vehicle_type = 'Required';
    if (!formData.brand) newErrors.brand = 'Required';
    if (!formData.vehicle_model) newErrors.vehicle_model = 'Required';
    if (!formData.registration_number || formData.registration_number.length < 5) newErrors.registration_number = 'Required/Invalid';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Vehicle"
      onConfirm={handleSubmit}
      confirmText="Update Vehicle"
      loading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
        <Select
          label="Vehicle Type"
          name="vehicle_type"
          value={formData.vehicle_type || ''}
          onChange={onInputChange}
          options={TWO_WHEELER_TYPES}
          error={errors.vehicle_type}
          fullWidth
        />
        
        {isLoadingBrands ? (
          <div className="text-xs text-neutral-500 animate-pulse py-2">Loading brands...</div>
        ) : (
          <SearchableDropdown
            fieldLabel="Brand"
            placeholder="Select or search brand"
            selectedVal={formData.brand || ''}
            handleChange={(val) => handleBrandSelection(val as string)}
            options={brandOptions}
            label="label"
            id="value"
            error={errors.brand}
            fullWidth
          />
        )}

        <SearchableDropdown
          fieldLabel="Model"
          placeholder={formData.brand ? 'Select or search model' : 'Please select a brand first'}
          selectedVal={formData.vehicle_model || ''}
          handleChange={(val) => handleModelSelection(val as string)}
          options={modelOptions}
          label="label"
          id="value"
          error={errors.vehicle_model}
          fullWidth
        />

        <Input
          label="Registration Number / Number Plate"
          name="registration_number"
          placeholder="e.g. MH12AB1234"
          className="uppercase"
          value={formData.registration_number || ''}
          onChange={onInputChange}
          error={errors.registration_number}
          fullWidth
        />

        <div className="space-y-2">
          <Input
            label="Model Year"
            name="year"
            type="number"
            placeholder="e.g. 2023"
            value={formData.year || ''}
            onChange={onInputChange}
            error={errors.year}
            fullWidth
          />
          <div className="flex gap-2">
            {[2018, 2020, 2025].map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setFormData({ ...formData, year })}
                className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Input
            label="Daily Travel (KM)"
            name="daily_travel"
            type="number"
            placeholder="e.g. 30"
            value={formData.daily_travel || ''}
            onChange={(e) => setFormData({ ...formData, daily_travel: Number(e.target.value) })}
            error={errors.daily_travel}
            fullWidth
          />
          <div className="flex gap-2 flex-wrap">
            {[10, 20, 30, 40, 50].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setFormData({ ...formData, daily_travel: km })}
                className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
              >
                {km} KM
              </button>
            ))}
          </div>
        </div>


      </form>
    </Modal>
  );
};
