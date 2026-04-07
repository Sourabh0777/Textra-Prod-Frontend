import React, { useState } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Bell, Plus } from 'lucide-react';
import { ReminderTable } from '@/components/reminders/reminder-table';
import { ReminderModal } from '@/components/reminders/reminder-modal';
import { Button } from '@/components/ui/button';
import {
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useMarkVisitedMutation,
  useTriggerReminderWorkerMutation,
} from '@/lib/api/endpoints/reminderApi';
import { toastPromise } from '@/lib/toast-utils';
import type { IReminder, IVehicle, ICustomer } from '@/types';

interface CustomerRemindersSectionProps {
  reminders: any[];
  vehicles: IVehicle[];
  customer: ICustomer;
}

export function CustomerRemindersSection({ reminders, vehicles, customer }: CustomerRemindersSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IReminder>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();
  const [markVisited, { isLoading: isCheckingIn }] = useMarkVisitedMutation();
  const [triggerReminder] = useTriggerReminderWorkerMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleOpenModal = (reminder?: IReminder) => {
    if (reminder) {
      setFormData(reminder);
      setEditingId(reminder._id || null);
      setIsEditMode(true);
    } else {
      setFormData({
        customer_id: customer._id,
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      setFormData({});
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

  const handleResend = async (reminder: IReminder) => {
    try {
    } catch (err) {
      console.error('Resend error', err);
    }
  };

  const handleCheckIn = async (reminder: IReminder) => {
    try {
      await toastPromise(markVisited(reminder._id!).unwrap(), {
        loading: 'Checking in...',
        success: 'Checked in successfully',
        error: (err) => err?.data?.message || 'Failed to check in',
      });
    } catch (err) {
      console.error('Check-in error', err);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-neutral-500" />
          <h3 className="text-lg font-bold text-neutral-800">Pending Reminders</h3>
        </div>
        <Button size="sm" onClick={() => handleOpenModal()} className="gap-1">
          <Plus size={16} /> Add Reminder
        </Button>
      </div>
      <Card>
        <CardBody className="!p-0">
          <ReminderTable
            reminders={reminders}
            onResend={handleResend}
            onCheckIn={handleCheckIn}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            isCheckInLoading={isCheckingIn}
          />
        </CardBody>
      </Card>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        services={[]} // This might need services from the page if we want to link them
        loading={isSubmitting}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
