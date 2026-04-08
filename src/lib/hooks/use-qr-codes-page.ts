/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchQRCodesQuery,
  useCreateQRCodeMutation,
  useUpdateQRCodeMutation,
  useDeleteQRCodeMutation,
} from '@/lib/api/endpoints/qrCodeApi';
import type { IQRCode } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useQRCodesPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IQRCode>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  /** RTK Query hooks */
  const {
    data: qrCodes,
    isLoading: loading,
    error: fetchError,
  } = useFetchQRCodesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createQRCode, { isLoading: isCreating }] = useCreateQRCodeMutation();
  const [updateQRCode, { isLoading: isUpdating }] = useUpdateQRCodeMutation();
  const [deleteQRCode] = useDeleteQRCodeMutation();

  const filteredQRCodes = (qrCodes || []).filter((qr: IQRCode) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (qr.code?.toLowerCase() || '').includes(searchLower) ||
      (qr.prefilled_message?.toLowerCase() || '').includes(searchLower) ||
      qr.qr_id?.toString().includes(searchLower)
    );
  });

  const isSubmitting = isCreating || isUpdating;

  const handleInstantCreate = async () => {
    try {
      const createData = {
        prefilled_message: 'This is a dummy QR code',
      };
      await toastPromise(createQRCode(createData).unwrap(), {
        loading: 'Creating QR Code...',
        success: 'QR Code created successfully',
        error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to create QR Code',
      });
    } catch (err) {
      console.error('Create error', err);
    }
  };

  const handleOpenModal = (qr?: IQRCode) => {
    if (qr) {
      setFormData(qr);
      setEditingId(qr._id || null);
      setIsEditMode(true);
      setErrors({});
      setIsModalOpen(true);
    } else {
      handleInstantCreate();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!isEditMode && !formData.prefilled_message) {
      newErrors.prefilled_message = 'Prefilled message is required for creation';
    }
    // For updates, the user only sends prefilled_message and code (optional)
    // But in our UI, we might want to ensure at least one is there if they are editing.
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
        // When updating, only send prefilled_message and code as per user request
        const updateData = {
          prefilled_message: formData.prefilled_message,
          code: formData.code,
        };
        await toastPromise(updateQRCode({ id: editingId, data: updateData }).unwrap(), {
          loading: 'Updating QR Code...',
          success: 'QR Code updated successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to update QR Code',
        });
        setIsModalOpen(false);
        setFormData({});
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this QR Code?')) {
      try {
        await toastPromise(deleteQRCode(id).unwrap(), {
          loading: 'Deleting QR Code...',
          success: 'QR Code deleted successfully',
          error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to delete QR Code',
        });
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  return {
    qrCodes,
    filteredQRCodes,
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
