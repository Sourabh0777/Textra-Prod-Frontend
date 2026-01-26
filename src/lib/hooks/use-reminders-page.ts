/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useFetchRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useMarkVisitedMutation,
} from '@/lib/api/endpoints/reminderApi';
import { useFetchServicesQuery } from '@/lib/api/endpoints/serviceApi';
import type { IReminder } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useRemindersPage() {
  const { user: clerkUser, isLoaded } = useUser();

  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IReminder>>({ retry_count: 0, status: 'pending' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // State for Check-in Dialog
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<IReminder | null>(null);

  /** RTK Query hooks */
  const {
    data: remindersResponse,
    isLoading: loadingReminders,
    error: fetchError,
  } = useFetchRemindersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: servicesResponse, isLoading: loadingServices } = useFetchServicesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();
  const [markVisited, { isLoading: isMarkingVisited }] = useMarkVisitedMutation();

  const reminders = Array.isArray(remindersResponse) ? remindersResponse : (remindersResponse as any)?.data || [];
  const services = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse as any)?.data || [];

  const loading = loadingReminders || loadingServices;
  const isSubmitting = isCreating || isUpdating;

  const handleOpenModal = (reminder?: IReminder) => {
    if (reminder) {
      setFormData(reminder);
      setEditingId(reminder._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ retry_count: 0, status: 'pending' });
      setEditingId(null);
      setIsEditMode(false);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'retry_count' ? Number(value) : value,
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
    if (!formData.service_id) newErrors.service_id = 'Service is required';
    if (!formData.scheduled_for) newErrors.scheduled_for = 'Scheduled date is required';
    if (!formData.status) newErrors.status = 'Status is required';
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
        await toastPromise(updateReminder({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating reminder...',
          success: 'Reminder updated successfully',
          error: (err) => err?.data?.error || err?.data?.message || 'Failed to update reminder',
        });
      } else {
        await toastPromise(createReminder(formData).unwrap(), {
          loading: 'Adding reminder...',
          success: 'Reminder added successfully',
          error: (err) => err?.data?.error || err?.data?.message || 'Failed to add reminder',
        });
      }
      setIsModalOpen(false);
      setFormData({ retry_count: 0, status: 'pending' });
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await toastPromise(deleteReminder(id).unwrap(), {
          loading: 'Deleting reminder...',
          success: 'Reminder deleted successfully',
          error: (err) => err?.data?.error || err?.data?.message || 'Failed to delete reminder',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  const handleCheckInClick = (reminder: IReminder) => {
    setSelectedReminder(reminder);
    setIsCheckInOpen(true);
  };

  const handleMarkVisited = async () => {
    if (!selectedReminder?._id) return;

    try {
      await toastPromise(markVisited(selectedReminder._id).unwrap(), {
        loading: 'Recording shop visit...',
        success: 'Shop visit recorded successfully',
        error: (err) => err?.data?.error || err?.data?.message || 'Failed to record shop visit',
      });
      setIsCheckInOpen(false);
      setSelectedReminder(null);
    } catch (err) {
      console.error('Check-in error', err);
    }
  };

  const handleResend = async (reminder: IReminder) => {
    toastPromise(Promise.resolve(), {
      loading: 'Preparing to resend...',
      success: 'Reminder notification queued for resending',
      error: 'Failed to resend reminder',
    });
  };

  const filteredReminders = reminders.filter((reminder: IReminder) => {
    const searchLower = searchQuery.toLowerCase();
    const customer = reminder.customer_id;
    const vehicle = reminder.vehicle_id;
    return (
      (customer?.name?.toLowerCase() || '').includes(searchLower) ||
      (customer?.phone_number?.toLowerCase() || '').includes(searchLower) ||
      (vehicle?.registration_number?.toLowerCase() || '').includes(searchLower) ||
      (vehicle?.brand?.toLowerCase() || '').includes(searchLower)
    );
  });

  return {
    reminders,
    filteredReminders,
    services,
    loading,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    errors,
    isCheckInOpen,
    setIsCheckInOpen,
    selectedReminder,
    isMarkingVisited,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
    handleCheckInClick,
    handleMarkVisited,
    handleResend,
  };
}
