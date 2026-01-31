/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchBusinessesQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useFetchBusinessTypesQuery,
  useUpdateBusinessWabaMutation,
} from '@/lib/api/endpoints/businessApi';
import type { IBusiness } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useBusinessesPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IBusiness>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  /** RTK Query hooks */
  const {
    data: businessesResponse,
    isLoading: loadingBusinesses,
    error: fetchError,
  } = useFetchBusinessesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: businessTypesResponse, isLoading: loadingTypes } = useFetchBusinessTypesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createBusiness, { isLoading: isCreating }] = useCreateBusinessMutation();
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();
  const [updateBusinessWaba, { isLoading: isUpdatingWaba }] = useUpdateBusinessWabaMutation();
  const [deleteBusiness] = useDeleteBusinessMutation();

  const businesses = Array.isArray(businessesResponse) ? businessesResponse : (businessesResponse as any)?.data || [];
  const filteredBusinesses = businesses.filter((business: IBusiness) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (business.business_name?.toLowerCase() || '').includes(searchLower) ||
      (business.owner_name?.toLowerCase() || '').includes(searchLower) ||
      (business.city?.toLowerCase() || '').includes(searchLower) ||
      (business.phone_number?.toLowerCase() || '').includes(searchLower) ||
      (business.email?.toLowerCase() || '').includes(searchLower)
    );
  });

  const businessTypes = Array.isArray(businessTypesResponse)
    ? businessTypesResponse
    : (businessTypesResponse as any)?.data || [];

  const loading = loadingBusinesses || loadingTypes;
  const isSubmitting = isCreating || isUpdating || isUpdatingWaba;

  const handleOpenDetailsModal = (business?: IBusiness) => {
    if (business) {
      // Normalize business_type_id if it's an object
      const normalizedBusiness = {
        ...business,
        business_type_id:
          typeof business.business_type_id === 'object'
            ? (business.business_type_id as any)._id
            : business.business_type_id,
      };
      setFormData(normalizedBusiness);
      setEditingId(business._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ is_active: true });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsDetailsModalOpen(true);
  };

  const handleOpenWhatsAppModal = (business: IBusiness) => {
    setFormData(business);
    setEditingId(business._id || null);
    setIsEditMode(true);
    setErrors({});
    setIsWhatsAppModalOpen(true);
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

  const validateDetailsForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.business_name) newErrors.business_name = 'Business name is required';
    if (!formData.owner_name) newErrors.owner_name = 'Owner name is required';
    if (!formData.business_type_id) newErrors.business_type_id = 'Business type is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    return newErrors;
  };

  const validateWhatsAppForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.waba_id) newErrors.waba_id = 'WABA ID is required';
    if (!formData.phone_number_id) newErrors.phone_number_id = 'Phone Number ID is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent, type: 'details' | 'whatsapp') => {
    e.preventDefault();
    const newErrors = type === 'details' ? validateDetailsForm() : validateWhatsAppForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      if (isEditMode && editingId) {
        if (type === 'whatsapp') {
          await toastPromise(updateBusinessWaba({ id: editingId, data: formData }).unwrap(), {
            loading: 'Updating WhatsApp credentials...',
            success: 'WhatsApp credentials updated successfully',
            error: (err: any) => err?.data?.message || 'Failed to update WhatsApp credentials',
          });
        } else {
          await toastPromise(updateBusiness({ id: editingId, data: formData as IBusiness }).unwrap(), {
            loading: 'Updating business...',
            success: 'Business updated successfully',
            error: (err) => err?.data?.message || 'Failed to update business',
          });
        }
      } else {
        await toastPromise(createBusiness(formData as any).unwrap(), {
          loading: 'Adding business...',
          success: 'Business added successfully',
          error: (err) => err?.data?.message || 'Failed to add business',
        });
      }
      setIsDetailsModalOpen(false);
      setIsWhatsAppModalOpen(false);
      setFormData({ is_active: true });
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await toastPromise(deleteBusiness(id).unwrap(), {
          loading: 'Deleting business...',
          success: 'Business deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete business',
        });
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  return {
    businesses,
    filteredBusinesses,
    businessTypes,
    loading,
    isSubmitting,
    fetchError,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    isEditMode,
    formData,
    setFormData,
    errors,
    setErrors,
    searchQuery,
    setSearchQuery,
    handleOpenDetailsModal,
    handleOpenWhatsAppModal,
    handleChange,
    handleSubmit,
    handleDelete,
  };
}
