/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { VEHICLE_TYPES, INDIAN_TWO_WHEELER_BRANDS } from '@/config/vehicle-config';
import type { IVehicle, ICustomer } from '@/types';

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
          <Combobox
            label="Customer"
            placeholder="Select a customer"
            searchPlaceholder="Search by name, phone or email..."
            value={
              typeof formData.customer_id === 'object' ? (formData.customer_id as any)?._id : formData.customer_id || ''
            }
            onChange={(val) => onCustomerChange(val as string)}
            options={customers.map((customer: ICustomer) => ({
              value: customer._id || '',
              label: `${customer.name} | ${customer.phone_number} ${customer.email ? `| ${customer.email}` : ''}`,
              searchTerms: `${customer.name} ${customer.phone_number} ${customer.email || ''}`.toLowerCase(),
            }))}
            error={errors.customer_id}
            fullWidth
          />
          <Select
            label="Vehicle Type"
            name="vehicle_type"
            value={formData.vehicle_type || ''}
            onChange={onInputChange}
            options={VEHICLE_TYPES}
            error={errors.vehicle_type}
            fullWidth
          />
          <Combobox
            label="Brand"
            placeholder="Select or search brand"
            value={formData.brand || ''}
            onChange={(val) => onBrandChange(val as string)}
            options={INDIAN_TWO_WHEELER_BRANDS}
            error={errors.brand}
            fullWidth
          />
          <Input
            label="Model"
            name="vehicle_model"
            value={formData.vehicle_model || ''}
            onChange={onInputChange}
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
          <p className="mt-[-12px] text-[10px] text-neutral-500">
            Format: State Code + District + Series + Number (e.g., MH 12 AB 1234)
          </p>
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
