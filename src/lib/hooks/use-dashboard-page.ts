/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchBusinessesQuery } from '@/lib/api/endpoints/businessApi';
import { useFetchCustomersQuery } from '@/lib/api/endpoints/customerApi';
import { useFetchVehiclesQuery } from '@/lib/api/endpoints/vehicleApi';
import { useFetchRemindersQuery } from '@/lib/api/endpoints/reminderApi';
import { useUser } from '@clerk/nextjs';

export function useDashboardPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const { data: businesses, isLoading: loadingBusinesses } = useFetchBusinessesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });
  const { data: customers, isLoading: loadingCustomers } = useFetchCustomersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });
  const { data: vehicles, isLoading: loadingVehicles } = useFetchVehiclesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });
  const { data: reminders, isLoading: loadingReminders } = useFetchRemindersQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const loading = loadingBusinesses || loadingCustomers || loadingVehicles || loadingReminders;

  const getCount = (data: any) => {
    if (Array.isArray(data)) return data.length;
    if (data?.data && Array.isArray(data.data)) return data.data.length;
    return 0;
  };

  const pendingRemindersCount = Array.isArray(reminders)
    ? reminders.filter((r: any) => r.status === 'pending').length
    : Array.isArray((reminders as any)?.data)
      ? (reminders as any).data.filter((r: any) => r.status === 'pending').length
      : 0;

  const stats = [
    { label: 'Total Businesses', value: String(getCount(businesses)), color: 'blue' },
    { label: 'Total Customers', value: String(getCount(customers)), color: 'green' },
    { label: 'Total Vehicles', value: String(getCount(vehicles)), color: 'orange' },
    { label: 'Pending Reminders', value: String(pendingRemindersCount), color: 'red' },
  ];

  const modules = [
    { label: 'Manage Businesses', href: '/businesses', icon: '🏢' },
    { label: 'Manage Customers', href: '/bike-service/customers', icon: '👥' },
    { label: 'Manage Vehicles', href: '/bike-service/vehicles', icon: '🏍️' },
    { label: 'Manage Services', href: '/bike-service/services', icon: '🔧' },
    { label: 'Manage Reminders', href: '/bike-service/reminders', icon: '🔔' },
    { label: 'View Logs', href: '/bike-service/whatsapp-logs', icon: '📱' },
  ];

  return {
    stats,
    modules,
    loading,
  };
}
