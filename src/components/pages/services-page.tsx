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
import {
  useFetchServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '@/lib/api/endpoints/serviceApi';
import { useFetchVehiclesQuery } from '@/lib/api/endpoints/vehicleApi';
import type { IService, IVehicle } from '@/types';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';

export default function ServicesPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IService>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [searchQuery, setSearchQuery] = useState('');

  /** RTK Query hooks */
  const {
    data: servicesResponse,
    isLoading: loadingServices,
    error: fetchError,
  } = useFetchServicesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: vehiclesResponse, isLoading: loadingVehicles } = useFetchVehiclesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const services = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse as any)?.data || [];
  const vehicles = Array.isArray(vehiclesResponse) ? vehiclesResponse : (vehiclesResponse as any)?.data || [];

  const filteredServices = services.filter((service: IService) => {
    const searchLower = searchQuery.toLowerCase();
    const vehicle = service.vehicle_id as any;
    const customer = vehicle?.customer_id as any;
    return (
      vehicle?.registration_number?.toLowerCase().includes(searchLower) ||
      vehicle?.brand?.toLowerCase().includes(searchLower) ||
      vehicle?.vehicle_model?.toLowerCase().includes(searchLower) ||
      customer?.name?.toLowerCase().includes(searchLower) ||
      customer?.phone_number?.toLowerCase().includes(searchLower)
    );
  });

  const loading = loadingServices || loadingVehicles;
  const submits = isCreating || isUpdating;

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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.vehicle_id) newErrors.vehicle_id = 'Vehicle is required';
    if (!formData.last_service_date) newErrors.last_service_date = 'Last service date is required';
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
        await toastPromise(updateService({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating service...',
          success: 'Service updated successfully',
          error: (err) => err?.data?.message || 'Failed to update service',
        });
      } else {
        await toastPromise(createService(formData).unwrap(), {
          loading: 'Adding service...',
          success: 'Service added successfully',
          error: (err) => err?.data?.message || 'Failed to add service',
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
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await toastPromise(deleteService(id).unwrap(), {
          loading: 'Deleting service...',
          success: 'Service deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete service',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Services" subtitle="Track vehicle services" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Services" subtitle="Track vehicle services" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading services. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Header title="Services" subtitle="Track vehicle services" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Services</h2>
              <span className="text-sm text-neutral-500 font-medium">
                ({filteredServices.length}
                {filteredServices.length !== services.length ? ` of ${services.length}` : ''})
              </span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search registration, owner, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-auto">
            <Button className="flex-1 md:flex-none" onClick={() => handleOpenModal()}>
              + New Service
            </Button>
          </div>
        </div>

        <Card>
          <CardBody className="!p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="px-2 md:px-4 py-3">Vehicle</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3">Service Info</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Status</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.map((service: IService) => {
                    const vehicle = service.vehicle_id as any;
                    const customer = vehicle?.customer_id as any;
                    return (
                      <TableRow key={service._id}>
                        <TableCell className="px-2 md:px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 text-sm sm:text-base tracking-wide">
                              {vehicle?.registration_number || 'N/A'}
                            </span>
                            <span className="text-xs text-neutral-600 font-medium">
                              {vehicle?.brand} {vehicle?.vehicle_model}
                            </span>
                            <span className="text-[11px] text-blue-600 font-semibold mt-0.5">
                              {customer?.name || 'Unknown Owner'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-2 md:px-4 py-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-neutral-400 font-bold uppercase">Last:</span>
                              <span className="text-xs font-semibold text-neutral-800">
                                {formatDate(service.last_service_date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-neutral-400 font-bold uppercase">Next:</span>
                              <span className="text-xs font-semibold text-indigo-600">
                                {formatDate(service.next_service_date)}
                              </span>
                            </div>
                            <div className="lg:hidden mt-1">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ring-1 ring-inset ${
                                  service.status === 'completed'
                                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                                    : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                }`}
                              >
                                {service.status}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              service.status === 'completed'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                            }`}
                          >
                            {service.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-2 md:px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(service)}
                              className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                            >
                              <span className="hidden sm:inline">Edit</span>
                              <span className="sm:hidden">✎</span>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(service._id || '')}
                              className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                            >
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">✕</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredServices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg font-medium text-neutral-400">No Services Found</span>
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
        title={isEditMode ? 'Edit Service' : 'Add New Service'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Service' : 'Add Service'}
        loading={submits}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Combobox
              label="Vehicle"
              placeholder="Select a vehicle"
              searchPlaceholder="Search by customer name, phone, email or registration number..."
              value={
                typeof formData.vehicle_id === 'object' ? (formData.vehicle_id as any)?._id : formData.vehicle_id || ''
              }
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, vehicle_id: val as any }));
                if (errors.vehicle_id) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.vehicle_id;
                    return next;
                  });
                }
              }}
              options={vehicles.map((vehicle: IVehicle) => {
                const customer = vehicle.customer_id as any;
                const label = `${vehicle.brand} ${vehicle.vehicle_model} (${vehicle.registration_number}) - ${customer?.name || 'No Owner'}`;
                const searchTerms =
                  `${customer?.name || ''} ${customer?.phone_number || ''} ${customer?.email || ''} ${vehicle.registration_number} ${vehicle.brand} ${vehicle.vehicle_model}`.toLowerCase();
                return {
                  value: vehicle._id || '',
                  label,
                  searchTerms,
                };
              })}
              error={errors.vehicle_id}
              fullWidth
            />
            <Input
              label="Service Date"
              name="last_service_date"
              type="date"
              value={formData.last_service_date ? new Date(formData.last_service_date).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              error={errors.last_service_date}
              fullWidth
            />
            {/* <Input
              label="Service Interval (days)"
              name="service_interval_days"
              type="number"
              value={formData.service_interval_days || ''}
              onChange={handleChange}
              error={errors.service_interval_days}
              fullWidth
            /> */}
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
        </div>
      </Modal>
    </>
  );
}
