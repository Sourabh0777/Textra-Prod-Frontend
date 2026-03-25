/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  useGetBusinessDetailsQuery,
  useUpdateBusinessDetailsMutation,
  useFetchBusinessTypesQuery,
  useUpdateBusinessWabaMutation,
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

  /** Update mutations */
  const [updateBusinessDetails, { isLoading: saving }] = useUpdateBusinessDetailsMutation();
  const [updateBusinessWaba, { isLoading: wabaSaving }] = useUpdateBusinessWabaMutation();

  /** Populate form on load */
  useEffect(() => {
    const businessData = (businessResponse as any)?.data || businessResponse;
    if (businessData) {
      // Normalize IDs if they are objects
      const normalizedData = {
        ...businessData,
        state:
          typeof businessData.state_id === 'object'
            ? businessData.state_id?._id
            : businessData.state_id || businessData.state,
        zone:
          typeof businessData.zone_id === 'object'
            ? businessData.zone_id?._id
            : businessData.zone_id || businessData.zone,
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

  /** Save WhatsApp details */
  const handleWabaSave = async () => {
    try {
      const businessId = (businessResponse as any)?.data?._id || businessResponse?._id;
      if (!businessId) {
        throw new Error('Business ID not found');
      }

      setErrors({});
      await toastPromise(
        updateBusinessWaba({
          id: businessId,
          data: {
            business_id: formData.business_id,
          },
        }).unwrap(),
        {
          loading: 'Updating WhatsApp credentials...',
          success: 'WhatsApp credentials updated successfully',
          error: (err: any) =>
            err?.data?.error?.reason || err?.data?.message || 'Failed to update WhatsApp credentials',
        },
      );
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
    wabaSaving,
    error,
    errors,
    handleChange,
    handleSave,
    handleWabaSave,
  };
}
