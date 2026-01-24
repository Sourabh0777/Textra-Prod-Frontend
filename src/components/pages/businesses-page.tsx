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
  useFetchBusinessesQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useFetchBusinessTypesQuery,
} from '@/lib/api/endpoints/businessApi';
import type { IBusiness, IBusinessType } from '@/types';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';

export default function BusinessesPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IBusiness>>({ is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** RTK Query hooks */
  const {
    data: businessesResponse,
    isLoading: loadingBusinesses,
    error: fetchError,
  } = useFetchBusinessesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const { data: businessTypesResponse, isLoading: loadingTypes } = useFetchBusinessTypesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createBusiness, { isLoading: isCreating }] = useCreateBusinessMutation();
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();
  const [deleteBusiness, { isLoading: isDeleting }] = useDeleteBusinessMutation();

  const businesses = Array.isArray(businessesResponse) ? businessesResponse : (businessesResponse as any)?.data || [];
  const businessTypes = Array.isArray(businessTypesResponse)
    ? businessTypesResponse
    : (businessTypesResponse as any)?.data || [];

  const loading = loadingBusinesses || loadingTypes;

  const handleOpenModal = (business?: IBusiness) => {
    if (business) {
      setFormData(business);
      setEditingId(business._id || null);
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
    if (!formData.business_name) newErrors.business_name = 'Business name is required';
    if (!formData.owner_name) newErrors.owner_name = 'Owner name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.business_type_id) newErrors.business_type_id = 'Business type is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.waba_id) newErrors.waba_id = 'WABA ID is required';
    if (!formData.phone_number_id) newErrors.phone_number_id = 'Phone Number ID is required';
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
        await toastPromise(updateBusiness({ id: editingId, data: formData as IBusiness }).unwrap(), {
          loading: 'Updating business...',
          success: 'Business updated successfully',
          error: (err) => err?.data?.message || 'Failed to update business',
        });
      } else {
        await toastPromise(createBusiness(formData as any).unwrap(), {
          loading: 'Adding business...',
          success: 'Business added successfully',
          error: (err) => err?.data?.message || 'Failed to add business',
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
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await toastPromise(deleteBusiness(id).unwrap(), {
          loading: 'Deleting business...',
          success: 'Business deleted successfully',
          error: (err) => err?.data?.message || 'Failed to delete business',
        });
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Businesses" subtitle="Manage your business locations" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Businesses" subtitle="Manage your business locations" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading businesses. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Businesses" subtitle="Manage your business locations" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Businesses</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Business</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Business Name</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Owner</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Phone</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">City</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businesses.map((business: IBusiness) => (
                    <TableRow key={business._id}>
                      <TableCell className="font-semibold">{business.business_name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{business.owner_name}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{business.phone_number}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{business.city}</TableCell>
                      <TableCell>
                        <Badge variant={business.is_active ? 'success' : 'danger'}>
                          {business.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(business)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(business._id || '')}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {businesses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        No businesses found.
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
        title={isEditMode ? 'Edit Business' : 'Add New Business'}
        onConfirm={handleSubmit}
        confirmText={isEditMode ? 'Update Business' : 'Add Business'}
        loading={isCreating || isUpdating}
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
            <Select
              label="Business Type"
              name="business_type_id"
              value={formData.business_type_id || ''}
              onChange={handleChange}
              options={businessTypes.map((type: IBusinessType) => ({
                value: type._id || '',
                label: type.name,
              }))}
              error={errors.business_type_id}
              fullWidth
            />
            <Input
              label="Business Name"
              name="business_name"
              value={formData.business_name || ''}
              onChange={handleChange}
              error={errors.business_name}
              fullWidth
            />
            <Input
              label="Owner Name"
              name="owner_name"
              value={formData.owner_name || ''}
              onChange={handleChange}
              error={errors.owner_name}
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
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              error={errors.address}
              fullWidth
            />
            <Input
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              error={errors.city}
              fullWidth
            />
            <Input
              label="WABA ID"
              name="waba_id"
              value={formData.waba_id || ''}
              onChange={handleChange}
              error={errors.waba_id}
              fullWidth
            />
            <Input
              label="Phone Number ID"
              name="phone_number_id"
              value={formData.phone_number_id || ''}
              onChange={handleChange}
              error={errors.phone_number_id}
              fullWidth
            />
            <Input
              label="Phone Number Display (Optional)"
              name="phone_number_display"
              value={formData.phone_number_display || ''}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Access Token (Optional)"
              name="access_token"
              value={formData.access_token || ''}
              onChange={handleChange}
              type="password"
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
