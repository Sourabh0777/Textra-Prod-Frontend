/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { CAR_VEHICLE_TYPES } from '@/config/vehicle-config';
import type { IVehicle, ICustomer } from '@/types';
import { useFetchBrandsQuery } from '@/lib/api/endpoints/carBrandsApi';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IVehicle>;
  errors: Record<string, string>;
  customers: ICustomer[];
  submitting: boolean;
  onFormDataChange: (data: Partial<IVehicle>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCustomerChange: (customerId: string) => void;
  onBrandChange: (brand: string) => void;
}

export function CarModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  customers,
  submitting,
  onFormDataChange,
  onInputChange,
  onSubmit,
  onCustomerChange,
  onBrandChange,
}: CarModalProps) {
  // Fetch Brands dynamically
  const { data: brands = [], isLoading: isLoadingBrands } = useFetchBrandsQuery(undefined, { skip: !isOpen });

  // Map brands for SearchableDropdown
  const brandOptions = useMemo(() => {
    return brands
      .filter((b) => b.is_active)
      .map((b) => ({
        value: b.name,
        label: b.name,
      }));
  }, [brands]);

  // When a brand is selected, find its models
  const modelOptions = useMemo(() => {
    if (!formData.brand) return [];
    const selectedBrand = brands.find((b) => b.name === formData.brand);
    if (!selectedBrand || !selectedBrand.models) return [];
    return selectedBrand.models.map((m) => ({
      value: m.name,
      label: m.name,
    }));
  }, [brands, formData.brand]);

  // When a model is selected, find its variants
  const variantOptions = useMemo(() => {
    if (!formData.brand || !formData.vehicle_model) return [];
    const selectedBrand = brands.find((b) => b.name === formData.brand);
    const selectedModel = selectedBrand?.models?.find((m) => m.name === formData.vehicle_model);
    if (!selectedModel || !selectedModel.variants) return [];
    return selectedModel.variants.map((v) => ({
      value: v.name,
      label: v.name,
    }));
  }, [brands, formData.brand, formData.vehicle_model]);

  // When a variant is selected, find its fuel types
  const fuelTypeOptions = useMemo(() => {
    if (!formData.brand || !formData.vehicle_model || !formData.variant) return [];
    const selectedBrand = brands.find((b) => b.name === formData.brand);
    const selectedModel = selectedBrand?.models?.find((m) => m.name === formData.vehicle_model);
    const selectedVariant = selectedModel?.variants?.find((v) => v.name === formData.variant);
    if (!selectedVariant || !selectedVariant.fuel_types) return [];
    return selectedVariant.fuel_types.map((ft) => ({
      value: ft,
      label: ft,
    }));
  }, [brands, formData.brand, formData.vehicle_model, formData.variant]);

  // Handle cascading clears
  const handleBrandSelection = (val: string) => {
    onBrandChange(val);
    onFormDataChange({ ...formData, brand: val, vehicle_model: '', variant: '', fuel_type: '' });
  };

  const handleModelSelection = (val: string) => {
    onFormDataChange({ ...formData, vehicle_model: val, variant: '', fuel_type: '' });
  };

  const handleVariantSelection = (val: string) => {
    onFormDataChange({ ...formData, variant: val, fuel_type: '' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Car' : 'Add New Car'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Car' : 'Add Car'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}

          <SearchableDropdown
            fieldLabel="Customer"
            placeholder="Select a customer"
            searchPlaceholder="Search by name, phone or email..."
            selectedVal={
              typeof formData.customer_id === 'object' ? (formData.customer_id as any)?._id : formData.customer_id || ''
            }
            handleChange={(val) => onCustomerChange(val as string)}
            options={customers.map((customer: ICustomer) => ({
              id: customer._id || '',
              name: `${customer.name} | ${customer.phone_number} ${customer.email ? `| ${customer.email}` : ''}`,
            }))}
            label="name"
            id="id"
            error={errors.customer_id}
            fullWidth
          />

          <Select
            label="Vehicle Type"
            name="vehicle_type"
            value={formData.vehicle_type || ''}
            onChange={onInputChange}
            options={CAR_VEHICLE_TYPES}
            error={errors.vehicle_type}
            fullWidth
          />

          {isLoadingBrands ? (
            <div className="text-sm text-gray-500">Loading brands...</div>
          ) : (
            <SearchableDropdown
              fieldLabel="Brand"
              placeholder="Select or search car brand"
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

          <SearchableDropdown
            fieldLabel="Variant"
            placeholder={formData.vehicle_model ? 'Select or search variant' : 'Please select a model first'}
            selectedVal={formData.variant || ''}
            handleChange={(val) => handleVariantSelection(val as string)}
            options={variantOptions}
            label="label"
            id="value"
            error={errors.variant}
            fullWidth
          />

          <Select
            label="Fuel Type"
            name="fuel_type"
            value={formData.fuel_type || ''}
            onChange={onInputChange}
            options={fuelTypeOptions}
            error={errors.fuel_type}
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
                  onClick={() => {
                    onFormDataChange({ ...formData, year: year });
                  }}
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
              onChange={(e) => {
                onFormDataChange({ ...formData, daily_travel: Number(e.target.value) });
              }}
              error={errors.daily_travel}
              fullWidth
            />
            <div className="flex gap-2 flex-wrap">
              {[10, 20, 30, 40, 50].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => {
                    onFormDataChange({ ...formData, daily_travel: km });
                  }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
                >
                  {km} KM
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              label="Next Service Due (KM)"
              name="next_service_due_km"
              type="number"
              placeholder="e.g. 5000"
              value={formData.next_service_due_km || ''}
              onChange={(e) => {
                onFormDataChange({ ...formData, next_service_due_km: Number(e.target.value) });
              }}
              error={errors.next_service_due_km}
              fullWidth
            />
            <div className="flex gap-2">
              {[5000, 10000, 15000].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => {
                    onFormDataChange({ ...formData, next_service_due_km: km });
                  }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
                >
                  +{km} KM
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <Input
              label="Service Date"
              name="service_date"
              type="date"
              value={formData.service_date ? new Date(formData.service_date).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                onFormDataChange({ ...formData, service_date: e.target.value as any });
              }}
              error={errors.service_date}
              fullWidth
            />
            <p className="mt-1 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded">
              💡 If the car is getting service today, please select the date here so that a service record and reminder
              will be automatically created.
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
}
