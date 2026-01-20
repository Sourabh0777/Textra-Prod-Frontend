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
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle, fetchCustomers } from '@/lib/api';
import type { IVehicle, ICustomer } from '@/types';

export default function VehiclesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IVehicle>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [vehiclesRes, customersRes] = await Promise.all([fetchVehicles(), fetchCustomers()]);
    if (vehiclesRes.success && Array.isArray(vehiclesRes.data)) {
      setVehicles(vehiclesRes.data);
    }
    if (customersRes.success && Array.isArray(customersRes.data)) {
      setCustomers(customersRes.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (vehicle?: IVehicle) => {
    if (vehicle) {
      setFormData(vehicle);
      setEditingId(vehicle._id || null);
      setIsEditMode(true);
    } else {
      setFormData({});
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
      [name]: name === 'year' ? Number(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
    if (!formData.vehicle_type) newErrors.vehicle_type = 'Vehicle type is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.vehicle_model) newErrors.vehicle_model = 'Model is required';
    if (!formData.registration_number) newErrors.registration_number = 'Registration number is required';
    if (!formData.year) newErrors.year = 'Year is required';
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
        result = await updateVehicle(editingId, formData);
      } else {
        result = await createVehicle(formData);
      }

      if (result.success) {
        await loadData();
        setIsModalOpen(false);
        setFormData({});
      } else {
        setErrors({ submit: result.error || 'Failed to save vehicle' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const result = await deleteVehicle(id);
      if (result.success) {
        await loadData();
      } else {
        alert('Failed to delete vehicle');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="Vehicles" subtitle="Manage all vehicles" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Vehicles</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Vehicle</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Vehicle ID</TableHeaderCell>

                    <TableHeaderCell>Customer</TableHeaderCell>
                    <TableHeaderCell>Phone</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Brand</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Model</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Registration</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Year</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell className="font-semibold">{vehicle._id}</TableCell>
                      <TableCell className="font-semibold">{vehicle?.customer_id?.name}</TableCell>
                      <TableCell className="font-semibold">{vehicle.customer_id.phone_number}</TableCell>
                      <TableCell className="font-semibold">{vehicle.vehicle_type}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{vehicle.brand}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{vehicle.vehicle_model}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{vehicle.registration_number}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{vehicle.year}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(vehicle)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(vehicle._id || '')}>
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
        title={isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
        loading={submitting}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Customer"
            name="customer_id"
            // value={formData.customer_id || ""}
            onChange={handleChange}
            options={customers.map((customer) => ({
              value: customer._id || '',
              label: customer.name,
            }))}
            error={errors.customer_id}
            fullWidth
          />
          <Input
            label="Vehicle Type"
            name="vehicle_type"
            value={formData.vehicle_type || ''}
            onChange={handleChange}
            error={errors.vehicle_type}
            fullWidth
          />
          <Input
            label="Brand"
            name="brand"
            value={formData.brand || ''}
            onChange={handleChange}
            error={errors.brand}
            fullWidth
          />
          <Input
            label="Model"
            name="vehicle_model"
            value={formData.vehicle_model || ''}
            onChange={handleChange}
            error={errors.vehicle_model}
            fullWidth
          />
          <Input
            label="Registration Number"
            name="registration_number"
            value={formData.registration_number || ''}
            onChange={handleChange}
            error={errors.registration_number}
            fullWidth
          />
          <Input
            label="Year"
            name="year"
            type="number"
            value={formData.year || ''}
            onChange={handleChange}
            error={errors.year}
            fullWidth
          />
        </form>
      </Modal>
    </>
  );
}
