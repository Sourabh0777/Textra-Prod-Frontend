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

export default function CustomersPage() {
  const { user: clerkUser, isLoaded } = useUser();

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
    console.log("🚀 ~ CustomersPage ~ customersResponse:", customersResponse)
  const { data: businessesResponse, isLoading: loadingBusinesses } = useFetchBusinessesQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  // Extract data from responses (handle both direct data and wrapped responses)
  const customers: ICustomer[] = Array.isArray(customersResponse?.data)
    ? customersResponse.data
    : Array.isArray(customersResponse)
      ? customersResponse
      : [];
  const businesses: IBusiness[] = Array.isArray(businessesResponse?.data)
    ? businessesResponse.data
    : Array.isArray(businessesResponse)
      ? businessesResponse
      : [];

  const loading = loadingCustomers || loadingBusinesses;
  const submitting = isCreating || isUpdating;

  const handleOpenModal = (customer?: ICustomer) => {
    if (customer) {
      setFormData(customer);
      setEditingId(customer._id || null);
      setIsEditMode(true);
    } else {
      setFormData({ is_active: true });
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
      [name]: name === 'is_active' ? value === 'true' : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
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
        await updateCustomer({ id: editingId, data: formData }).unwrap();
      } else {
        await createCustomer(formData).unwrap();
      }
      setIsModalOpen(false);
      setFormData({ is_active: true });
    } catch (err: any) {
      console.error('Error saving customer:', err);
      setErrors({
        submit: err.data?.message || err.message || 'Failed to save customer',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id).unwrap();
      } catch (err: any) {
        console.error('Error deleting customer:', err);
        alert(err.data?.message || err.message || 'Failed to delete customer');
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
                  {customers.map((customer) => (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Business"
            name="business_id"
            value={formData.business_id || ''}
            onChange={handleChange}
            options={businesses.map((business) => ({
              value: business._id || '',
              label: business.business_name,
            }))}
            error={errors.business_id}
            fullWidth
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
            value={String(formData.is_active)}
            onChange={handleChange}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            fullWidth
          />
        </form>
      </Modal>
    </>
  );
}
