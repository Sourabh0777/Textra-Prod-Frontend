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
import { useCreateServiceMutation } from '@/lib/api/endpoints/serviceApi';
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
  const [searchQuery, setSearchQuery] = useState('');

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
  const [createService, { isLoading: isServiceCreating }] = useCreateServiceMutation();

  const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : (vehiclesResponse as any)?.data || [];

  const filteredVehicles = vehicles.filter((vehicle: IVehicle) => {
    const searchLower = searchQuery.toLowerCase();
    const customer = vehicle?.customer_id;
    return (
      customer?.name?.toLowerCase().includes(searchLower) ||
      customer?.phone_number?.toLowerCase().includes(searchLower) ||
      vehicle.brand?.toLowerCase().includes(searchLower) ||
      vehicle.vehicle_model?.toLowerCase().includes(searchLower) ||
      vehicle.registration_number?.toLowerCase().includes(searchLower)
    );
  });

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
    if (!formData.daily_travel) newErrors.daily_travel = 'Daily travel is required';
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
      let vehicleId: string | undefined;

      if (isEditMode && editingId) {
        const result = await toastPromise(updateVehicle({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating vehicle...',
          success: 'Vehicle updated successfully',
          error: (err) => err?.data?.message || 'Failed to update vehicle',
        });
        vehicleId = editingId;
      } else {
        const result = await toastPromise(createVehicle(formData).unwrap(), {
          loading: 'Adding vehicle...',
          success: 'Vehicle added successfully',
          error: (err) => err?.data?.message || 'Failed to add vehicle',
        });
        vehicleId = result?.data?._id || result?._id;
      }

      // If service_date is provided, create a service record
      if (formData.service_date && vehicleId) {
        await toastPromise(
          createService({
            vehicle_id: vehicleId,
            last_service_date: formData.service_date,
            notes: 'Service created from vehicle page',
          }).unwrap(),
          {
            loading: 'Creating service record...',
            success: (data) => data?.message || 'Service record & reminder created!',
            error: (err) => err?.data?.message || 'Failed to create service record',
          },
        );
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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Vehicles</h2>
              <span className="text-sm text-neutral-500 font-medium">
                ({filteredVehicles.length}
                {filteredVehicles.length !== vehicles.length ? ` of ${vehicles.length}` : ''})
              </span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search customer, registration, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>+ Add Vehicle</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="px-2 md:px-4 py-3">Vehicle</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3">Owner</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3 text-center">
                      Year / Travel
                    </TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.map((vehicle: IVehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell className="px-2 md:px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-900 text-sm sm:text-base tracking-wide">
                            {vehicle.registration_number}
                          </span>
                          <span className="text-xs text-neutral-600 font-medium">
                            {vehicle.brand} {vehicle.vehicle_model}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 md:px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-neutral-800 font-medium">
                            {vehicle?.customer_id?.name || '-'}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {vehicle?.customer_id?.phone_number || ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3 text-center">
                        <div className="flex flex-col">
                          <span className="text-sm text-neutral-700">{vehicle.year}</span>
                          <span className="text-xs text-neutral-500">{vehicle.daily_travel} KM/day</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 md:px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(vehicle)}
                            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">✎</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(vehicle._id || '')}
                            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">✕</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg font-medium text-neutral-400">No Vehicles Found</span>
                        </div>
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
            <Input
              label="Daily Travel (KM)"
              name="daily_travel"
              type="number"
              placeholder="e.g. 30"
              value={formData.daily_travel || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  daily_travel: Number(e.target.value),
                }));
                if (errors.daily_travel) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.daily_travel;
                    return next;
                  });
                }
              }}
              error={errors.daily_travel}
              fullWidth
            />
            <div className="pt-2 border-t border-neutral-100">
              <Input
                label="Service Date"
                name="service_date"
                type="date"
                value={formData.service_date ? new Date(formData.service_date).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    service_date: e.target.value as any,
                  }));
                }}
                error={errors.service_date}
                fullWidth
              />
              <p className="mt-1 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded">
                💡 If the bike is getting service today, please select the date here so that a service record and
                reminder will be automatically created.
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
