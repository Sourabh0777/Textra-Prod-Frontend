/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { ALL_VEHICLE_TYPES, CAR_VEHICLE_TYPES } from '@/constants/vehicle-types';
import type { IVehicle, ICustomer } from '@/types';
import { useFetchTwoWheelerBrandsQuery } from '@/lib/api/endpoints/twoWheelerBrandsApi';
import { useFetchBrandsQuery } from '@/lib/api/endpoints/carBrandsApi';

interface VehicleModalProps {
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

export function VehicleModal({
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
}: VehicleModalProps) {
  // Determine if current vehicle type is a car
  const isCar = useMemo(() => {
    return CAR_VEHICLE_TYPES.some((t) => t.value === formData.vehicle_type);
  }, [formData.vehicle_type]);

  // Fetch Brands dynamically
  const { data: twoWheelerBrands = [], isLoading: loadingTwoWheelerBrands } = useFetchTwoWheelerBrandsQuery(undefined, {
    skip: !isOpen || isCar,
  });
  const { data: carBrands = [], isLoading: loadingCarBrands } = useFetchBrandsQuery(undefined, {
    skip: !isOpen || !isCar,
  });

  const activeBrands = isCar ? carBrands : twoWheelerBrands;
  const isLoadingBrands = isCar ? loadingCarBrands : loadingTwoWheelerBrands;

  // Map brands for SearchableDropdown
  const brandOptions = useMemo(() => {
    return (activeBrands || [])
      .filter((b) => b.is_active)
      .map((b) => ({
        value: b.name,
        label: b.name,
      }));
  }, [activeBrands]);

  // Map models for SearchableDropdown based on selected brand
  const modelOptions = useMemo(() => {
    if (!formData.brand) return [];
    const selectedBrand = (activeBrands || []).find((b) => b.name === formData.brand);
    if (!selectedBrand || !selectedBrand.models) return [];
    return selectedBrand.models.map((m) => ({
      value: m.name,
      label: m.name,
    }));
  }, [activeBrands, formData.brand]);

  const handleBrandSelection = (val: string) => {
    onBrandChange(val);
    // Reset model when brand changes
    onFormDataChange({ ...formData, brand: val, vehicle_model: '' });
  };

  const handleModelSelection = (val: string) => {
    onFormDataChange({ ...formData, vehicle_model: val });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
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
            options={ALL_VEHICLE_TYPES}
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
                  onClick={() => {
                    onFormDataChange({
                      ...formData,
                      year: year,
                    });
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
                onFormDataChange({
                  ...formData,
                  daily_travel: Number(e.target.value),
                });
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
                    onFormDataChange({
                      ...formData,
                      daily_travel: km,
                    });
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
              placeholder="e.g. 2000"
              value={formData.next_service_due_km || ''}
              onChange={(e) => {
                onFormDataChange({
                  ...formData,
                  next_service_due_km: Number(e.target.value),
                });
              }}
              error={errors.next_service_due_km}
              fullWidth
            />
            <div className="flex gap-2">
              {[500, 1000, 2000].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => {
                    onFormDataChange({
                      ...formData,
                      next_service_due_km: km,
                    });
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
                onFormDataChange({
                  ...formData,
                  service_date: e.target.value as any,
                });
              }}
              error={errors.service_date}
              fullWidth
            />
            <p className="mt-1 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded">
              💡 If the bike is getting service today, please select the date here so that a service record and reminder
              will be automatically created.
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
}
