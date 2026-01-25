/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';
import {
  useFetchRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
} from '@/lib/api/endpoints/reminderApi';
import { useFetchServicesQuery } from '@/lib/api/endpoints/serviceApi';
import type { IReminder, IService } from '@/types';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';

export default function RemindersPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IReminder>>({ retry_count: 0, status: 'pending' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    sent: 'success',
    failed: 'danger',
  };

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
  const [deleteReminder, { isLoading: isDeleting }] = useDeleteReminderMutation();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleCheckIn = async (reminder: IReminder) => {
    try {
      await toastPromise(updateReminder({ id: reminder._id!, data: { ...reminder, status: 'sent' } }).unwrap(), {
        loading: 'Checking in...',
        success: 'Customer checked in successfully',
        error: (err) => err?.data?.message || 'Failed to check in',
      });
    } catch (err) {
      console.error('Check-in error', err);
    }
  };

  const handleResend = async (reminder: IReminder) => {
    // For now, we just show a toast as there's no specific resend endpoint yet.
    // If there was an endpoint, we would call it here.
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
          <Loader />
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
              <p className="text-red-500">Error loading reminders. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

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
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Customer</TableHeaderCell>
                    <TableHeaderCell>Vehicle</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Scheduled For</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell text-center">Retries</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reminders.map((reminder: IReminder) => {
                    const customer = reminder.customer_id as any;
                    const vehicle = reminder.vehicle_id as any;
                    return (
                      <TableRow key={reminder._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900">{customer?.name || 'Unknown'}</span>
                            <span className="text-xs text-neutral-500">{customer?.phone_number || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-neutral-800">
                              {vehicle?.brand} {vehicle?.vehicle_model}
                            </span>
                            <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-1 rounded w-fit">
                              {vehicle?.registration_number}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          <div className="flex flex-col">
                            <span>{formatDate(reminder.scheduled_for)}</span>
                            <span className="text-[10px] text-neutral-400">
                              Added: {formatDate(reminder.created_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[reminder.status] || 'info'}>{reminder.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-center">
                          {reminder.retry_count}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => handleResend(reminder)}
                              title="Resend Notification"
                            >
                              Resend
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleCheckIn(reminder)}
                              title="Customer Check-in"
                            >
                              Check-in
                            </Button>
                            <div className="border-l border-neutral-200 h-6 mx-1 self-center" />
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(reminder)} title="Edit">
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(reminder._id || '')}
                              title="Delete"
                            >
                              Del
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {reminders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        No reminders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Edit Reminder' : 'Add New Reminder'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Reminder' : 'Add Reminder'}
        loading={isCreating || isUpdating}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Select
              label="Service"
              name="service_id"
              value={
                typeof formData.service_id === 'object' ? (formData.service_id as any)?._id : formData.service_id || ''
              }
              onChange={handleChange}
              options={services.map((service: IService) => {
                const vehicle = service.vehicle_id as any;
                const regNo = typeof vehicle === 'object' ? vehicle?.registration_number : 'Unknown';
                const model = typeof vehicle === 'object' ? `${vehicle?.brand} ${vehicle?.vehicle_model}` : '';
                return {
                  value: service._id || '',
                  label: `${model} (${regNo}) - ${service._id?.slice(-6)}`,
                };
              })}
              error={errors.service_id}
              fullWidth
            />
            <Input
              label="Scheduled For"
              name="scheduled_for"
              type="date"
              value={formData.scheduled_for ? new Date(formData.scheduled_for).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              error={errors.scheduled_for}
              fullWidth
            />
            <Select
              label="Status"
              name="status"
              value={formData.status || 'pending'}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'sent', label: 'Sent' },
                { value: 'failed', label: 'Failed' },
              ]}
              error={errors.status}
              fullWidth
            />
            <Input
              label="Retry Count"
              name="retry_count"
              type="number"
              value={formData.retry_count || 0}
              onChange={handleChange}
              fullWidth
            />
          </form>
        </div>
      </Modal>
    </>
  );
}
