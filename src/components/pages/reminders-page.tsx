'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';
import { fetchReminders, createReminder, updateReminder, deleteReminder, fetchServices } from '@/lib/api';
import type { IReminder, IService } from '@/types';

export default function RemindersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reminders, setReminders] = useState<IReminder[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IReminder>>({ retry_count: 0, status: 'pending' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    sent: 'success',
    failed: 'danger',
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [remindersRes, servicesRes] = await Promise.all([fetchReminders(), fetchServices()]);
    if (remindersRes.success && Array.isArray(remindersRes.data)) {
      setReminders(remindersRes.data);
    }
    if (servicesRes.success && Array.isArray(servicesRes.data)) {
      setServices(servicesRes.data);
    }
    setLoading(false);
  };

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
    setFormData({
      ...formData,
      [name]: name === 'retry_count' || name === 'scheduled_for' ? new Date(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
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

    setSubmitting(true);
    try {
      let result;
      if (isEditMode && editingId) {
        result = await updateReminder(editingId, formData);
      } else {
        result = await createReminder(formData);
      }

      if (result.success) {
        await loadData();
        setIsModalOpen(false);
        setFormData({ retry_count: 0, status: 'pending' });
      } else {
        setErrors({ submit: result.error || 'Failed to save reminder' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const result = await deleteReminder(id);
      if (result.success) {
        await loadData();
      } else {
        alert('Failed to delete reminder');
      }
    }
  };

  if (loading) {
    return <Loader />;
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
                    <TableHeaderCell>Service ID</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Scheduled For</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Retries</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Last Attempt</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reminders.map((reminder) => (
                    <TableRow key={reminder._id}>
                      <TableCell className="font-semibold text-sm">{reminder.service_id._id}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {formatDate(reminder.scheduled_for)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[reminder.status] || 'info'}>{reminder.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{reminder.retry_count}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {formatDate(reminder.last_attempt_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(reminder)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(reminder._id || '')}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
        loading={submitting}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Service"
            name="service_id"
            value={formData.service_id?._id || ''}
            onChange={handleChange}
            options={services.map((service) => ({
              value: service._id || '',
              label: `Service ${service._id}`,
            }))}
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
      </Modal>
    </>
  );
}
