/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchBusinessTypesQuery,
  useCreateBusinessTypeMutation,
  useUpdateBusinessTypeMutation,
  useDeleteBusinessTypeMutation,
} from '@/lib/api/endpoints/businessApi';
import type { IBusinessType } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useBusinessTypesPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IBusinessType>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** RTK Query hooks */
  const {
    data: businessTypesResponse,
    isLoading: loading,
    error: fetchError,
  } = useFetchBusinessTypesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createBusinessType, { isLoading: isCreating }] = useCreateBusinessTypeMutation();
  const [updateBusinessType, { isLoading: isUpdating }] = useUpdateBusinessTypeMutation();
  const [deleteBusinessType] = useDeleteBusinessTypeMutation();

  const businessTypes = Array.isArray(businessTypesResponse)
    ? businessTypesResponse
    : (businessTypesResponse as any)?.data || [];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinessTypes = businessTypes.filter((type: IBusinessType) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (type.name?.toLowerCase() || '').includes(searchLower) ||
      (type.description?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleOpenModal = (type?: IBusinessType) => {
    if (type) {
      setFormData(type);
      setEditingId(type._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ is_active: true, name: '', description: '' });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    if (!formData.name) newErrors.name = 'Name is required';
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
        await toastPromise(updateBusinessType({ id: editingId, data: formData as IBusinessType }).unwrap(), {
          loading: 'Updating business type...',
          success: 'Business type updated successfully',
          error: (err) => err?.data?.message || 'Failed to update business type',
        });
      } else {
        await toastPromise(createBusinessType(formData as any).unwrap(), {
          loading: 'Adding business type...',
          success: 'Business type added successfully',
          error: (err) => err?.data?.message || 'Failed to add business type',
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this business type?')) {
      try {
        await toastPromise(deleteBusinessType(id).unwrap(), {
          loading: 'Deleting business type...',
          success: 'Business type deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete business type',
        });
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return {
    businessTypes,
    filteredBusinessTypes,
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
