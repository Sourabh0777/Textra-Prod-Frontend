/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '@/lib/api/endpoints/customerApi';
import { useFetchBusinessesQuery } from '@/lib/api/endpoints/businessApi';
import { useFetchUserData } from '@/lib/hooks/useFetchUserData';
import type { ICustomer } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useCustomersPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const { user } = useFetchUserData();
  const businessDetails = user?.business_id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ICustomer>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // RTK Query hooks
  const {
    data: customersResponse,
    isLoading: loadingCustomers,
    error: customersError,
  } = useFetchCustomersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: businessesResponse, isLoading: loadingBusinesses } = useFetchBusinessesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers: ICustomer[] = Array.isArray(customersResponse)
    ? customersResponse
    : (customersResponse as any)?.data || [];

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (customer.name?.toLowerCase() || '').includes(searchLower) ||
      (customer.phone_number?.toLowerCase() || '').includes(searchLower) ||
      (customer.email?.toLowerCase() || '').includes(searchLower)
    );
  });

  const businesses = Array.isArray(businessesResponse) ? businessesResponse : (businessesResponse as any)?.data || [];

  const loading = loadingCustomers || loadingBusinesses;
  const isSubmitting = isCreating || isUpdating;

  const handleOpenModal = (customer?: ICustomer) => {
    if (customer) {
      setFormData(customer);
      setEditingId(customer._id || null);
      setIsEditMode(true);
    } else {
      setFormData({
        is_active: true,
        business_id: typeof businessDetails === 'object' ? (businessDetails as any)?._id : businessDetails || '',
      });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? value === 'true' : value,
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
    const newErrors: Record<string, string> = {};
    if (!formData.business_id) newErrors.business_id = 'Business is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
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
        await toastPromise(updateCustomer({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating customer...',
          success: 'Customer updated successfully',
          error: (err) => err?.data?.message || 'Failed to update customer',
        });
      } else {
        await toastPromise(createCustomer(formData).unwrap(), {
          loading: 'Adding customer...',
          success: 'Customer added successfully',
          error: (err) => err?.data?.message || 'Failed to add customer',
        });
      }
      setIsModalOpen(false);
      setFormData({ is_active: true });
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await toastPromise(deleteCustomer(id).unwrap(), {
          loading: 'Deleting customer...',
          success: 'Customer deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete customer',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  return {
    customers,
    filteredCustomers,
    businesses,
    loading,
    isSubmitting,
    customersError,
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
