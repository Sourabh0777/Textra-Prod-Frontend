/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchSubAdminServicesQuery,
  useCreateSubAdminServiceMutation,
  useUpdateSubAdminServiceMutation,
  useDeleteSubAdminServiceMutation,
  useFetchSubAdminVehiclesQuery,
} from '@/lib/api/endpoints/subAdminApi';
import type { IService } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useSubAdminServicesPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IService>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  /** RTK Query hooks */
  const {
    data: servicesResponse,
    isLoading: loadingServices,
    error: fetchError,
    refetch: refetchServices,
  } = useFetchSubAdminServicesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: vehiclesResponse, isLoading: loadingVehicles } = useFetchSubAdminVehiclesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createService, { isLoading: isCreating }] = useCreateSubAdminServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateSubAdminServiceMutation();
  const [deleteService] = useDeleteSubAdminServiceMutation();

  const services = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse as any)?.data || [];
  const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : (vehiclesResponse as any)?.data || [];

  const filteredServices = services.filter((service: IService) => {
    const searchLower = searchQuery.toLowerCase();
    const vehicle = service.vehicle_id as any;
    const customer = vehicle?.customer_id as any;
    return (
      (vehicle?.registration_number?.toLowerCase() || '').includes(searchLower) ||
      (vehicle?.brand?.toLowerCase() || '').includes(searchLower) ||
      (vehicle?.vehicle_model?.toLowerCase() || '').includes(searchLower) ||
      (customer?.name?.toLowerCase() || '').includes(searchLower) ||
      (customer?.phone_number?.toLowerCase() || '').includes(searchLower)
    );
  });

  const loading = !isLoaded || loadingServices || loadingVehicles;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.vehicle_id) newErrors.vehicle_id = 'Vehicle is required';
    if (!formData.last_service_date) newErrors.last_service_date = 'Last service date is required';
    return newErrors;
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
        await toastPromise(updateService({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating service...',
          success: 'Service updated successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to update service',
        });
      } else {
        await toastPromise(createService(formData).unwrap(), {
          loading: 'Adding service...',
          success: (data) => data?.message || 'Service added successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to add service',
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
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to delete service',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  return {
    services,
    filteredServices,
    vehicles,
    loading,
    isSubmitting,
    fetchError,
    refetchServices,
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
