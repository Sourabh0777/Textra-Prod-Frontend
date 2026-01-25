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
  useFetchCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '@/lib/api/endpoints/customerApi';
import { useFetchBusinessesQuery } from '@/lib/api/endpoints/businessApi';
import type { ICustomer, IBusiness } from '@/types';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';
import { useFetchUserData } from '@/lib/hooks/useFetchUserData';

export default function CustomersPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const { user } = useFetchUserData();
  const businessDetails = user?.business_id;
  console.log('🚀 ~ CustomersPage ~ businessDetails:', businessDetails);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ICustomer>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // RTK Query hooks
  const {
    data: customersResponse,
    isLoading: loadingCustomers,
    error: customersError,
  } = useFetchCustomersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: businessesResponse, isLoading: loadingBusinesses } = useFetchBusinessesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  // Extract data from responses (handle both direct data and wrapped responses)
  const customers: ICustomer[] = Array.isArray(customersResponse)
    ? customersResponse
    : (customersResponse as any)?.data || [];

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.phone_number?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower)
    );
  });

  const businesses: IBusiness[] = Array.isArray(businessesResponse)
    ? businessesResponse
    : (businessesResponse as any)?.data || [];

  const loading = loadingCustomers || loadingBusinesses;
  const submitting = isCreating || isUpdating;

  const handleOpenModal = (customer?: ICustomer) => {
    if (customer) {
      setFormData(customer);
      setEditingId(customer._id || null);
      setIsEditMode(true);
    } else {
      setFormData({
        is_active: true,
        business_id: typeof businessDetails === 'object' ? (businessDetails as any)?._id : businessDetails || '',
      });
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
      [name]: name === 'is_active' ? value === 'true' : value,
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
    if (!formData.business_id) newErrors.business_id = 'Business is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
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
        await toastPromise(updateCustomer({ id: editingId, data: formData }).unwrap(), {
          loading: 'Updating customer...',
          success: 'Customer updated successfully',
          error: (err) => err?.data?.message || 'Failed to update customer',
        });
      } else {
        await toastPromise(createCustomer(formData).unwrap(), {
          loading: 'Adding customer...',
          success: 'Customer added successfully',
          error: (err) => err?.data?.message || 'Failed to add customer',
        });
      }
      setIsModalOpen(false);
      setFormData({ is_active: true });
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await toastPromise(deleteCustomer(id).unwrap(), {
          loading: 'Deleting customer...',
          success: 'Customer deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete customer',
        });
      } catch (err: any) {
        console.error('Delete error', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Customers" subtitle="Manage your customer base" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (customersError) {
    return (
      <>
        <Header title="Customers" subtitle="Manage your customer base" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading customers. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Customers" subtitle="Manage your customer base" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Customers</h2>
              <span className="text-sm text-neutral-500 font-medium">
                ({filteredCustomers.length}
                {filteredCustomers.length !== customers.length ? ` of ${customers.length}` : ''})
              </span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>+ Add Customer</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="px-2 md:px-4 py-3">Customer Information</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell px-2 md:px-4 py-3">
                      Contact Details
                    </TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Joined On</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">Status</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer: ICustomer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="px-2 md:px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-900 text-sm sm:text-base">{customer.name}</span>
                          <span className="text-xs text-neutral-500 sm:hidden">{customer.phone_number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-2 md:px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-neutral-700 font-medium">{customer.phone_number}</span>
                          {customer.email && <span className="text-xs text-neutral-500">{customer.email}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                        <span className="text-sm text-neutral-600">
                          {customer.created_at
                            ? new Date(customer.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 md:px-4 py-3 text-center sm:text-left">
                        <Badge variant={customer.is_active ? 'success' : 'danger'} className="text-[10px] sm:text-xs">
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-2 md:px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(customer)}
                            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">✎</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(customer._id || '')}
                            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">✕</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-neutral-500">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg font-medium text-neutral-400">No Customers Found</span>
                          <p className="text-sm">Try adjusting your search criteria</p>
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
        title={isEditMode ? 'Edit Customer' : 'Add New Customer'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Customer' : 'Add Customer'}
        loading={submitting}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Select
              label="Business"
              name="business_id"
              value={
                typeof formData.business_id === 'object'
                  ? (formData.business_id as any)?._id
                  : formData.business_id || ''
              }
              onChange={handleChange}
              options={businesses.map((business: IBusiness) => ({
                value: business._id || '',
                label: business.business_name,
              }))}
              error={errors.business_id}
              fullWidth
              disabled
            />
            <Input
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              error={errors.name}
              fullWidth
            />
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
              error={errors.phone_number}
              fullWidth
            />
            <Input
              label="Email (Optional)"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Address (Optional)"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              fullWidth
            />
            <Select
              label="Status"
              name="is_active"
              value={String(formData.is_active ?? true)}
              onChange={handleChange}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              fullWidth
            />
          </form>
        </div>
      </Modal>
    </>
  );
}
