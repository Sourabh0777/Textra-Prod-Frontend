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
  const [searchQuery, setSearchQuery] = useState('');

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
  const filteredBusinesses = businesses.filter((business: IBusiness) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      business.business_name?.toLowerCase().includes(searchLower) ||
      business.owner_name?.toLowerCase().includes(searchLower) ||
      business.city?.toLowerCase().includes(searchLower) ||
      business.phone_number?.toLowerCase().includes(searchLower)
    );
  });

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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Businesses</h2>
              <span className="text-sm text-neutral-500 font-medium">
                ({filteredBusinesses.length}
                {filteredBusinesses.length !== businesses.length ? ` of ${businesses.length}` : ''})
              </span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search name, owner, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>+ Add Business</Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="px-2 md:px-4 py-3">Business Details</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell px-2 md:px-4 py-3">Owner Info</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Location</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">Status</TableHeaderCell>
                    <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBusinesses.map((business: IBusiness) => (
                    <TableRow key={business._id}>
                      <TableCell className="px-2 md:px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-900 text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                            {business.business_name}
                          </span>
                          <span className="text-xs text-neutral-500 md:hidden">{business.owner_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-2 md:px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-neutral-700 font-medium">{business.owner_name}</span>
                          <span className="text-xs text-neutral-500">{business.phone_number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                        <span className="text-sm text-neutral-600">{business.city}</span>
                      </TableCell>
                      <TableCell className="px-2 md:px-4 py-3 text-center sm:text-left">
                        <Badge variant={business.is_active ? 'success' : 'danger'} className="text-[10px] sm:text-xs">
                          {business.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-2 md:px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(business)}
                            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">✎</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(business._id || '')}
                            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">✕</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBusinesses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-neutral-500">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg font-medium text-neutral-400">No Businesses Found</span>
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
