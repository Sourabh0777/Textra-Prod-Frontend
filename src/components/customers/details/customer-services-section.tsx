import React, { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { History, Plus } from 'lucide-react';
import { ServiceTable } from '@/components/services/service-table';
import { ServiceModal } from '@/components/services/service-modal';
import { Button } from '@/components/ui/button';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '@/lib/api/endpoints/serviceApi';
import { toastPromise } from '@/lib/toast-utils';
import type { IService, IVehicle } from '@/types';

interface CustomerServicesSectionProps {
  services: any[];
  vehicles: IVehicle[];
}

export function CustomerServicesSection({ services, vehicles }: CustomerServicesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IService>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleOpenModal = (service?: IService) => {
    if (service) {
      setFormData(service);
      setEditingId(service._id || null);
      setIsEditMode(true);
    } else {
      setFormData({});
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    setFormData((prev) => ({ ...prev, vehicle_id: vehicleId }));
    if (errors.vehicle_id) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.vehicle_id;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await toastPromise(updateService({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating service...',
          success: 'Service updated successfully',
          error: (err) => err?.data?.message || 'Failed to update service',
        });
      } else {
        await toastPromise(createService(formData).unwrap(), {
          loading: 'Adding service...',
          success: 'Service added successfully',
          error: (err) => err?.data?.message || 'Failed to add service',
        });
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
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await toastPromise(deleteService(id).unwrap(), {
          loading: 'Deleting service...',
          success: 'Service deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete service',
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
          <History size={20} className="text-neutral-500" />
          <h3 className="text-lg font-bold text-neutral-800">Service History</h3>
        </div>
        <Button size="sm" onClick={() => handleOpenModal()} className="gap-1">
          <Plus size={16} /> Add Service
        </Button>
      </div>
      <Card>
        <CardBody className="!p-0">
          <ServiceTable services={services} onEdit={handleOpenModal} onDelete={handleDelete} />
        </CardBody>
      </Card>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        vehicles={vehicles}
        submitting={isSubmitting}
        onFormDataChange={setFormData}
        onInputChange={handleInputChange}
        onVehicleChange={handleVehicleChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
