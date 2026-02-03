/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useGetBusinessDetailsQuery,
  useUpdateBusinessDetailsMutation,
  useFetchBusinessTypesQuery,
} from '@/lib/api/endpoints/businessApi';
import { useFetchStatesQuery, useFetchZonesQuery } from '@/lib/api/endpoints/configApi';
import type { IBusiness } from '@/types';
import { toastPromise } from '@/lib/toast-utils';

export function useBusinessProfile() {
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

  /** Fetch states and zones */
  const { data: states } = useFetchStatesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });
  const { data: zones } = useFetchZonesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  /** Update mutation */
  const [updateBusinessDetails, { isLoading: saving }] = useUpdateBusinessDetailsMutation();

  /** Populate form on load */
  useEffect(() => {
    const businessData = (businessResponse as any)?.data || businessResponse;
    if (businessData) {
      console.log('🚀 ~ useBusinessProfile ~ businessData:', businessData);

      // Normalize IDs if they are objects
      const normalizedData = {
        ...businessData,
        state: typeof businessData.state === 'object' ? businessData.state?._id : businessData.state,
        zone: typeof businessData.zone === 'object' ? businessData.zone?._id : businessData.zone,
      };

      setFormData(normalizedData);
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
    try {
      setErrors({});
      await toastPromise(updateBusinessDetails(formData).unwrap(), {
        loading: 'Saving business details...',
        success: 'Business details updated successfully',
        error: (err) => err?.data?.error?.reason || err?.data?.message || 'Failed to update business details',
      });
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
    }
  };

  return {
    formData,
    businessTypes,
    states,
    zones,
    loading,
    saving,
    error,
    errors,
    handleChange,
    handleSave,
  };
}
