/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useFetchCustomerDetailsQuery } from '@/lib/api/endpoints/customerApi';
import { ICustomer, IVehicle, IService, IReminder } from '@/types';

export interface ICustomerDetailsData {
  customer: ICustomer;
  vehicles: IVehicle[];
  services: IService[];
  reminders: IReminder[];
}

export function useCustomerDetailsPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const { isLoaded, user } = useUser();

  const {
    data: response,
    isLoading: isQueryLoading,
    error,
  } = useFetchCustomerDetailsQuery(customerId, {
    skip: !isLoaded || !user || !customerId,
  });
  console.log('response', response);

  const loading = !isLoaded || isQueryLoading;
  const customerDetails = response as any as ICustomerDetailsData | undefined;
  console.log('🚀 ~ useCustomerDetailsPage ~ customerDetails:', customerDetails);

  return {
    customerId,
    customerDetails,
    loading,
    error,
  };
}
