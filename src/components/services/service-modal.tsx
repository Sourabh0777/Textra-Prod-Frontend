/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import type { IService, IVehicle } from '@/types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IService>;
  errors: Record<string, string>;
  vehicles: IVehicle[];
  submitting: boolean;
  onFormDataChange: (data: Partial<IService>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onVehicleChange: (vehicleId: string) => void;
}

export function ServiceModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  vehicles,
  submitting,
  onInputChange,
  onSubmit,
  onVehicleChange,
}: ServiceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Service' : 'Add New Service'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Service' : 'Add Service'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Combobox
            label="Vehicle"
            placeholder="Select a vehicle"
            searchPlaceholder="Search by customer name, phone, email or registration number..."
            value={
              typeof formData.vehicle_id === 'object' ? (formData.vehicle_id as any)?._id : formData.vehicle_id || ''
            }
            onChange={(val) => onVehicleChange(val as string)}
            options={vehicles.map((vehicle: IVehicle) => {
              const customer = vehicle.customer_id as any;
              const label = `${vehicle.brand} ${vehicle.vehicle_model} (${vehicle.registration_number}) - ${customer?.name || 'No Owner'}`;
              const searchTerms =
                `${customer?.name || ''} ${customer?.phone_number || ''} ${customer?.email || ''} ${vehicle.registration_number} ${vehicle.brand} ${vehicle.vehicle_model}`.toLowerCase();
              return {
                value: vehicle._id || '',
                label,
                searchTerms,
              };
            })}
            error={errors.vehicle_id}
            fullWidth
          />
          <Input
            label="Service Date"
            name="last_service_date"
            type="date"
            value={formData.last_service_date ? new Date(formData.last_service_date).toISOString().split('T')[0] : ''}
            onChange={onInputChange}
            error={errors.last_service_date}
            fullWidth
          />
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
