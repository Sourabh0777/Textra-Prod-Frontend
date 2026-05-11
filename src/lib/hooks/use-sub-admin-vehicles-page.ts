/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchSubAdminVehiclesQuery,
  useCreateSubAdminVehicleMutation,
  useUpdateSubAdminVehicleMutation,
  useDeleteSubAdminVehicleMutation,
  useFetchSubAdminCustomersQuery,
} from '@/lib/api/endpoints/subAdminApi';
import type { IVehicle } from '@/types';
import { toastPromise } from '@/lib/toast-utils';
import { vehicleSchema } from '@/lib/validations/schemas';

export function useSubAdminVehiclesPage() {
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
    refetch: refetchVehicles,
  } = useFetchSubAdminVehiclesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: customersResponse, isLoading: loadingCustomers } = useFetchSubAdminCustomersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createVehicle, { isLoading: isCreating }] = useCreateSubAdminVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateSubAdminVehicleMutation();
  const [deleteVehicle] = useDeleteSubAdminVehicleMutation();

  const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : (vehiclesResponse as any)?.data || [];
  const customers = Array.isArray(customersResponse) ? customersResponse : (customersResponse as any)?.data || [];

  const filteredVehicles = vehicles.filter((vehicle: IVehicle) => {
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
      setFormData({});
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

      if (isEditMode && editingId) {
        await toastPromise(updateVehicle({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating vehicle...',
          success: 'Vehicle updated successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to update vehicle',
        });
      } else {
        await toastPromise(createVehicle(formData).unwrap(), {
          loading: 'Adding vehicle...',
          success: 'Vehicle added successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to add vehicle',
        });
      }

      // NOTE: We omit createService here as sub-admin might not have service creation endpoints yet.

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

  return {
    vehicles,
    filteredVehicles,
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
    refetchVehicles,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
  };
}
