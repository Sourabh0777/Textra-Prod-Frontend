/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams } from 'next/navigation';
import { useFetchPortalDataQuery } from '@/lib/api/endpoints/portalCustomerApi';
import { ICustomerDetailsData } from './use-customer-details-page';

export function useCustomerPortal() {
  const params = useParams();
  const uid = params.uid as string;

  const {
    data: response,
    isLoading: isQueryLoading,
    error,
    refetch,
  } = useFetchPortalDataQuery(uid, {
    skip: !uid,
  });

  const loading = isQueryLoading;
  const customerDetails = response as any as ICustomerDetailsData | undefined;

  return {
    uid,
    customerDetails,
    loading,
    error,
    refetch,
  };
}
