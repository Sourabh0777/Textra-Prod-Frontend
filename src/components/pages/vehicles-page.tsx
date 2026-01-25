/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Loader } from '@/components/ui/loader';
import { VEHICLE_TYPES, INDIAN_TWO_WHEELER_BRANDS } from '@/config/vehicle-config';
import {
  useFetchVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '@/lib/api/endpoints/vehicleApi';
import { useFetchCustomersQuery } from '@/lib/api/endpoints/customerApi';
import type { IVehicle, ICustomer } from '@/types';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';

export default function VehiclesPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IVehicle>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** RTK Query hooks */
  const {
    data: vehiclesResponse,
    isLoading: loadingVehicles,
    error: fetchError,
  } = useFetchVehiclesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: customersResponse, isLoading: loadingCustomers } = useFetchCustomersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : (vehiclesResponse as any)?.data || [];
  const customers = Array.isArray(customersResponse) ? customersResponse : (customersResponse as any)?.data || [];

  const loading = loadingVehicles || loadingCustomers;

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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
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

    try {
      setErrors({});
      if (isEditMode && editingId) {
        await toastPromise(updateVehicle({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating vehicle...',
          success: 'Vehicle updated successfully',
          error: (err) => err?.data?.message || 'Failed to update vehicle',
        });
      } else {
        await toastPromise(createVehicle(formData).unwrap(), {
          loading: 'Adding vehicle...',
          success: 'Vehicle added successfully',
          error: (err) => err?.data?.message || 'Failed to add vehicle',
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
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await toastPromise(deleteVehicle(id).unwrap(), {
          loading: 'Deleting vehicle...',
          success: 'Vehicle deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete vehicle',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Vehicles" subtitle="Manage all vehicles" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Vehicles" subtitle="Manage all vehicles" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading vehicles. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
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
                  {vehicles.map((vehicle: IVehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell className="font-semibold">{vehicle._id}</TableCell>
                      <TableCell className="font-semibold">{vehicle?.customer_id?.name || '-'}</TableCell>
                      <TableCell className="font-semibold">{vehicle?.customer_id?.phone_number || '-'}</TableCell>
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
                  {vehicles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-neutral-500">
                        No vehicles found.
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
        title={isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
        loading={isCreating || isUpdating}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Combobox
              label="Customer"
              placeholder="Select a customer"
              searchPlaceholder="Search by name, phone or email..."
              value={
                typeof formData.customer_id === 'object'
                  ? (formData.customer_id as any)?._id
                  : formData.customer_id || ''
              }
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, customer_id: val as any }));
                if (errors.customer_id) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.customer_id;
                    return next;
                  });
                }
              }}
              options={customers.map((customer: ICustomer) => ({
                value: customer._id || '',
                label: `${customer.name} | ${customer.phone_number} ${customer.email ? `| ${customer.email}` : ''}`,
                searchTerms: `${customer.name} ${customer.phone_number} ${customer.email || ''}`.toLowerCase(),
              }))}
              error={errors.customer_id}
              fullWidth
            />
            <Select
              label="Vehicle Type"
              name="vehicle_type"
              value={formData.vehicle_type || ''}
              onChange={handleChange}
              options={VEHICLE_TYPES}
              error={errors.vehicle_type}
              fullWidth
            />
            <Combobox
              label="Brand"
              placeholder="Select or search brand"
              value={formData.brand || ''}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, brand: val }));
                if (errors.brand) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.brand;
                    return next;
                  });
                }
              }}
              options={INDIAN_TWO_WHEELER_BRANDS}
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
              label="Registration Number / Number Plate"
              name="registration_number"
              placeholder="e.g. MH 12 AB 1234"
              value={formData.registration_number || ''}
              onChange={handleChange}
              error={errors.registration_number}
              fullWidth
            />
            <Input
              label="Model Year"
              name="year"
              type="number"
              placeholder="e.g. 2023"
              value={formData.year || ''}
              onChange={handleChange}
              error={errors.year}
              fullWidth
            />
          </form>
        </div>
      </Modal>
    </>
  );
}
