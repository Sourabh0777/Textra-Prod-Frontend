/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '@/lib/api/endpoints/vehicleApi';
import { useFetchCustomersQuery } from '@/lib/api/endpoints/customerApi';
import { useCreateServiceMutation } from '@/lib/api/endpoints/serviceApi';
import type { IVehicle } from '@/types';
import { toastPromise } from '@/lib/toast-utils';
import { vehicleSchema } from '@/lib/validations/schemas';
import { CAR_VEHICLE_TYPES } from '@/config/vehicle-config';

export function useCarsPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IVehicle>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  /** RTK Query hooks */
  const {
    data: vehiclesResponse,
    isLoading: loadingVehicles,
    error: fetchError,
  } = useFetchVehiclesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: customersResponse, isLoading: loadingCustomers } = useFetchCustomersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [createService] = useCreateServiceMutation();

  const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : (vehiclesResponse as any)?.data || [];
  const customers = Array.isArray(customersResponse) ? customersResponse : (customersResponse as any)?.data || [];

  const CAR_TYPES = CAR_VEHICLE_TYPES.map((t) => t.value);

  const filteredVehicles = vehicles.filter((vehicle: IVehicle) => {
    // Only show Cars
    if (!vehicle.vehicle_type || !CAR_TYPES.includes(vehicle.vehicle_type)) {
      return false;
    }

    const searchLower = searchQuery.toLowerCase();
    const customer = vehicle?.customer_id;
    const customerName = typeof customer !== 'string' ? customer?.name || '' : '';
    const customerPhone = typeof customer !== 'string' ? customer?.phone_number || '' : '';

    return (
      customerName.toLowerCase().includes(searchLower) ||
      customerPhone.toLowerCase().includes(searchLower) ||
      (vehicle.brand?.toLowerCase() || '').includes(searchLower) ||
      (vehicle.vehicle_model?.toLowerCase() || '').includes(searchLower) ||
      (vehicle.registration_number?.toLowerCase() || '').includes(searchLower)
    );
  });

  const loading = !isLoaded || loadingVehicles || loadingCustomers;
  const isSubmitting = isCreating || isUpdating;

  const handleOpenModal = (vehicle?: IVehicle) => {
    if (vehicle) {
      setFormData(vehicle);
      setEditingId(vehicle._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ vehicle_type: CAR_VEHICLE_TYPES[0].value });
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
          loading: 'Updating car...',
          success: 'Car updated successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to update car',
        });
      } else {
        const result = await toastPromise(createVehicle(formData).unwrap(), {
          loading: 'Adding car...',
          success: 'Car added successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to add car',
        });
        vehicleId = result?.data?._id || result?._id;
      }

      // If service_date is provided, create a service record
      if (formData.service_date && vehicleId) {
        await toastPromise(
          createService({
            vehicle_id: vehicleId,
            last_service_date: formData.service_date,
            notes: 'Service created from cars page',
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
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await toastPromise(deleteVehicle(id).unwrap(), {
          loading: 'Deleting car...',
          success: 'Car deleted successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to delete car',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  return {
    vehicles: filteredVehicles,
    customers,
    loading,
    isSubmitting,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    setFormData,
    errors,
    setErrors,
    searchQuery,
    setSearchQuery,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
  };
}
