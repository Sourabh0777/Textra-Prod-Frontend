'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';
import { fetchServices, createService, updateService, deleteService, fetchVehicles } from '@/lib/api';
import type { IService, IVehicle } from '@/types';

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [services, setServices] = useState<IService[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IService>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [servicesRes, vehiclesRes] = await Promise.all([fetchServices(), fetchVehicles()]);
    if (servicesRes.success && Array.isArray(servicesRes.data)) {
      setServices(servicesRes.data);
    }
    if (vehiclesRes.success && Array.isArray(vehiclesRes.data)) {
      setVehicles(vehiclesRes.data);
    }
    setLoading(false);
  };

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
    setFormData({
      ...formData,
      [name]: name === 'service_interval_days' ? Number(value) : name.includes('date') ? new Date(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.vehicle_id) newErrors.vehicle_id = 'Vehicle is required';
    if (!formData.last_service_date) newErrors.last_service_date = 'Last service date is required';
    if (!formData.next_service_date) newErrors.next_service_date = 'Next service date is required';
    if (!formData.service_interval_days) newErrors.service_interval_days = 'Service interval is required';
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
        result = await updateService(editingId, formData);
      } else {
        result = await createService(formData);
      }

      if (result.success) {
        await loadData();
        setIsModalOpen(false);
        setFormData({});
      } else {
        setErrors({ submit: result.error || 'Failed to save service' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const result = await deleteService(id);
      if (result.success) {
        await loadData();
      } else {
        alert('Failed to delete service');
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
      <Header title="Services" subtitle="Track vehicle services" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Services</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Service</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Vehicle ID</TableHeaderCell>
                    <TableHeaderCell>Brand</TableHeaderCell>
                    <TableHeaderCell>Model</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Last Service</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Next Service</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Interval</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Status</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Notes</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell className="font-semibold text-sm">{service.vehicle_id._id}</TableCell>
                      <TableCell className="font-semibold text-sm">{service.vehicle_id.brand}</TableCell>
                      <TableCell className="font-semibold text-sm">{service.vehicle_id.vehicle_model}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {formatDate(service.last_service_date)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {formatDate(service.next_service_date)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {service.service_interval_days} days
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{service.status}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{service.notes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(service)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(service._id || '')}>
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
        title={isEditMode ? 'Edit Service' : 'Add New Service'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Service' : 'Add Service'}
        loading={submitting}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Vehicle"
            name="vehicle_id"
            value={formData.vehicle_id?._id || ''}
            onChange={handleChange}
            options={vehicles.map((vehicle) => ({
              value: vehicle._id || '',
              label: `${vehicle.brand} ${vehicle.vehicle_model}`,
            }))}
            error={errors.vehicle_id}
            fullWidth
          />
          <Input
            label="Last Service Date"
            name="last_service_date"
            type="date"
            value={formData.last_service_date ? new Date(formData.last_service_date).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            error={errors.last_service_date}
            fullWidth
          />
          <Input
            label="Next Service Date"
            name="next_service_date"
            type="date"
            value={formData.next_service_date ? new Date(formData.next_service_date).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            error={errors.next_service_date}
            fullWidth
          />
          <Input
            label="Service Interval (days)"
            name="service_interval_days"
            type="number"
            value={formData.service_interval_days || ''}
            onChange={handleChange}
            error={errors.service_interval_days}
            fullWidth
          />
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
