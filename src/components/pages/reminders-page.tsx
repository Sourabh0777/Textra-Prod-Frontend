/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import {
  useFetchRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useMarkVisitedMutation,
} from '@/lib/api/endpoints/reminderApi';
import { useFetchServicesQuery } from '@/lib/api/endpoints/serviceApi';
import type { IReminder } from '@/types';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';

// Sub-components
import { ReminderTable } from '@/components/reminders/reminder-table';
import { ReminderModal } from '@/components/reminders/reminder-modal';
import { CheckInDialog } from '@/components/reminders/check-in-dialog';

export default function RemindersPage() {
  const { user: clerkUser, isLoaded } = useUser();

  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IReminder>>({ retry_count: 0, status: 'pending' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          error: (err) => err?.data?.message || 'Failed to update reminder',
        });
      } else {
        await toastPromise(createReminder(formData).unwrap(), {
          loading: 'Adding reminder...',
          success: 'Reminder added successfully',
          error: (err) => err?.data?.message || 'Failed to add reminder',
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
          error: (err) => err?.data?.message || 'Failed to delete reminder',
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
        error: (err) => err?.data?.message || 'Failed to record shop visit',
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

  if (loading) {
    return (
      <>
        <Header title="Reminders" subtitle="Manage service reminders" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader className="animate-spin text-blue-500" />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Reminders" subtitle="Manage service reminders" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500 text-center py-8">Error loading reminders. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Reminders" subtitle="Manage service reminders" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Reminders</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Reminder</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <ReminderTable
              reminders={reminders}
              onResend={handleResend}
              onCheckIn={handleCheckInClick}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              isCheckInLoading={isMarkingVisited}
            />
          </CardBody>
        </Card>
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        services={services}
        loading={isCreating || isUpdating}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <CheckInDialog
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onConfirm={handleMarkVisited}
        reminder={selectedReminder}
        loading={isMarkingVisited}
      />
    </>
  );
}
