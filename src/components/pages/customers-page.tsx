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
          <h2 className="text-xl font-semibold text-neutral-900">All Customers</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Customer</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Phone</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Email</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Address</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer: ICustomer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-semibold">{customer.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{customer.phone_number}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{customer.email || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{customer.address || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={customer.is_active ? 'success' : 'danger'}>
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(customer)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(customer._id || '')}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        No customers found.
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
