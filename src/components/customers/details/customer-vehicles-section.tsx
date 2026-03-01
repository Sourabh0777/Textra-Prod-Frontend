import React, { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Bike, Plus } from 'lucide-react';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { VehicleModal } from '@/components/vehicles/vehicle-modal';
import {
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useCreateVehicleMutation,
} from '@/lib/api/endpoints/vehicleApi';
import { useCreateServiceMutation } from '@/lib/api/endpoints/serviceApi';
import { toastPromise } from '@/lib/toast-utils';
import { vehicleSchema } from '@/lib/validations/schemas';
import { Button } from '@/components/ui/button';
import type { IVehicle } from '@/types';

interface CustomerVehiclesSectionProps {
  vehicles: any[];
  customer: any;
}

export function CustomerVehiclesSection({ vehicles, customer }: CustomerVehiclesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IVehicle>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [createService] = useCreateServiceMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleOpenModal = (vehicle?: IVehicle) => {
    if (vehicle) {
      setFormData(vehicle);
      setEditingId(vehicle._id || null);
      setIsEditMode(true);
    } else {
      setFormData({
        customer_id: customer._id || customer,
      });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'registration_number' ? value.toUpperCase() : value;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : normalizedValue,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const result = vehicleSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      return newErrors;
    }
    return {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      let vehicleId: string | undefined;

      if (isEditMode && editingId) {
        await toastPromise(updateVehicle({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating vehicle...',
          success: 'Vehicle updated successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to update vehicle',
        });
      } else {
        const result = await toastPromise(createVehicle(formData).unwrap(), {
          loading: 'Adding vehicle...',
          success: 'Vehicle added successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to add vehicle',
        });
        vehicleId = result?.data?._id || result?._id;
      }

      // If service_date is provided, create a service record
      if (formData.service_date && vehicleId) {
        await toastPromise(
          createService({
            vehicle_id: vehicleId,
            last_service_date: formData.service_date,
            notes: 'Service created from customer details page',
          }).unwrap(),
          {
            loading: 'Creating service record...',
            success: (data) => data?.message || 'Service record & reminder created!',
            error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to create service record',
          },
        );
      }

      setIsModalOpen(false);
      setFormData({});
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await toastPromise(deleteVehicle(id).unwrap(), {
          loading: 'Deleting vehicle...',
          success: 'Vehicle deleted successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to delete vehicle',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bike size={20} className="text-neutral-500" />
          <h3 className="text-lg font-bold text-neutral-800">Vehicles</h3>
        </div>
        <Button size="sm" onClick={() => handleOpenModal()} className="gap-1">
          <Plus size={16} /> Add Vehicle
        </Button>
      </div>
      <Card>
        <CardBody className="!p-0">
          <VehicleTable vehicles={vehicles} onEdit={handleOpenModal} onDelete={handleDelete} />
        </CardBody>
      </Card>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        customers={[customer]}
        submitting={isSubmitting}
        onFormDataChange={setFormData}
        onInputChange={handleChange}
        onCustomerChange={(val) => {
          setFormData((prev) => ({ ...prev, customer_id: val as any }));
          if (errors.customer_id) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.customer_id;
              return next;
            });
          }
        }}
        onBrandChange={(val) => {
          setFormData((prev) => ({ ...prev, brand: val }));
          if (errors.brand) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.brand;
              return next;
            });
          }
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
