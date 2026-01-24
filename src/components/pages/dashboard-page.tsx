/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Header } from '@/components/layout/header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';
import { useFetchBusinessesQuery } from '@/lib/api/endpoints/businessApi';
import { useFetchCustomersQuery } from '@/lib/api/endpoints/customerApi';
import { useFetchVehiclesQuery } from '@/lib/api/endpoints/vehicleApi';
import { useFetchRemindersQuery } from '@/lib/api/endpoints/reminderApi';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
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
    { label: 'Manage Customers', href: '/customers', icon: '👥' },
    { label: 'Manage Vehicles', href: '/vehicles', icon: '🏍️' },
    { label: 'Manage Services', href: '/services', icon: '🔧' },
    { label: 'Manage Reminders', href: '/reminders', icon: '🔔' },
    { label: 'View Logs', href: '/whatsapp-logs', icon: '📱' },
  ];

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Welcome to your Bike Service CRM" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Welcome to your Bike Service CRM" />

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="text-center p-4 md:p-6">
                <p className="text-neutral-600 text-xs md:text-sm font-medium">{stat.label}</p>
                <p className="text-2xl md:text-4xl font-bold text-neutral-900 mt-2">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Modules</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="p-3 md:p-4 border border-neutral-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="text-2xl md:text-3xl mb-2">{module.icon}</div>
                  <p className="font-semibold text-neutral-900 text-sm md:text-base">{module.label}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
