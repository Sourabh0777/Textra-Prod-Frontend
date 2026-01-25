/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

import type { IBusiness } from '@/types';
import {
  useGetBusinessDetailsQuery,
  useUpdateBusinessDetailsMutation,
  useFetchBusinessTypesQuery,
} from '@/lib/api/endpoints/businessApi';
import { useUser } from '@clerk/nextjs';
import { toastPromise } from '@/lib/toast-utils';

const BusinessPage = () => {
  const { user: clerkUser, isLoaded } = useUser();

  const [formData, setFormData] = useState<Partial<IBusiness>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** Fetch business details */
  const {
    data: businessResponse,
    isLoading: loading,
    error,
  } = useGetBusinessDetailsQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  /** Fetch business types */
  const { data: businessTypes } = useFetchBusinessTypesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  /** Update mutation */
  const [updateBusinessDetails, { isLoading: saving }] = useUpdateBusinessDetailsMutation();

  /** Populate form on load */
  useEffect(() => {
    const businessData = (businessResponse as any)?.data || businessResponse;
    if (businessData) {
      setFormData(businessData);
    }
  }, [businessResponse]);

  /** Handle input/select change */
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

  /** Save business details */
  const handleSave = async () => {
    console.log('formData', formData);

    try {
      setErrors({});
      await toastPromise(updateBusinessDetails(formData).unwrap(), {
        loading: 'Saving business details...',
        success: 'Business details updated successfully',
        error: (err) => err?.data?.message || 'Failed to update business details',
      });
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  /** Loading state */
  if (loading) {
    return (
      <>
        <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />
        <div className="p-4 md:p-8 max-w-4xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  /** Error state */
  if (error) {
    return (
      <>
        <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading business details. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card>
          <CardBody className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{errors.general}</div>
            )}

            {/* Business Type */}
            <Select
              label="Business Type"
              name="business_type_id"
              value={formData.business_type_id || ''}
              onChange={handleChange}
              options={
                businessTypes?.map((type) => ({
                  value: type?._id || '',
                  label: type?.name || '',
                })) || []
              }
              error={errors.business_type_id}
              fullWidth
              disabled
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
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              error={errors.city}
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

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">WhatsApp Configuration</h3>

              <Input
                label="WABA ID"
                name="waba_id"
                value={formData.waba_id || ''}
                onChange={handleChange}
                error={errors.waba_id}
                fullWidth
                disabled
              />

              <Input
                label="Phone Number ID"
                name="phone_number_id"
                value={formData.phone_number_id || ''}
                onChange={handleChange}
                error={errors.phone_number_id}
                fullWidth
                disabled
              />

              <Input
                label="Display Number"
                name="phone_number_display"
                value={formData.phone_number_display || ''}
                onChange={handleChange}
                error={errors.phone_number_display}
                fullWidth
                disabled
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button loading={saving} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default BusinessPage;
