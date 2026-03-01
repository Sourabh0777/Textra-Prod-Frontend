'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useCustomerDetailsPage } from '@/lib/hooks/use-customer-details-page';
import { CustomerInfoCard } from '@/components/customers/details/customer-info-card';
import { CustomerStats } from '@/components/customers/details/customer-stats';
import { CustomerVehiclesSection } from '@/components/customers/details/customer-vehicles-section';
import { CustomerRemindersSection } from '@/components/customers/details/customer-reminders-section';
import { CustomerServicesSection } from '@/components/customers/details/customer-services-section';
import { ReminderStatus } from '@/types';

export default function CustomerDetailsPage() {
  const { customerId, customerDetails, loading, error } = useCustomerDetailsPage();

  useEffect(() => {
    if (customerDetails) {
      console.log('Customer Details API Response:', customerDetails);
    }
  }, [customerDetails]);

  if (loading) {
    return (
      <>
        <Header title="Customer Details" subtitle="View customer information" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (error || !customerDetails) {
    return (
      <>
        <Header title="Customer Details" subtitle="View customer information" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading customer details. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  const { customer, vehicles: rawVehicles, services: rawServices, reminders: rawReminders } = customerDetails;

  // Map customer and vehicle data to ensure tables show populated info
  const vehicles = rawVehicles.map((v: any) => ({
    ...v,
    customer_id: customer,
  }));

  const services = rawServices.map((s: any) => {
    const v = vehicles.find((veh: any) => veh._id === (s.vehicle_id?._id || s.vehicle_id));
    return {
      ...s,
      vehicle_id: v || s.vehicle_id,
    };
  });

  const reminders = rawReminders.map((r: any) => {
    const v = vehicles.find((veh: any) => veh._id === (r.vehicle_id?._id || r.vehicle_id));
    return {
      ...r,
      customer_id: customer,
      vehicle_id: v || r.vehicle_id,
    };
  });

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CustomerInfoCard customer={customer} customerId={customerId} />
          <CustomerStats
            vehiclesCount={vehicles.length}
            servicesCount={services.length}
            remindersCount={
              reminders.filter(
                (r) => r.status !== ReminderStatus.COMPLETED && r.status !== ReminderStatus.LOST_SERVICE_CYCLE,
              ).length
            }
          />
        </div>

        <CustomerVehiclesSection vehicles={vehicles} customer={customer} />
        <CustomerRemindersSection reminders={reminders} vehicles={vehicles} customer={customer} />
        <CustomerServicesSection services={services} vehicles={vehicles} />
      </div>
    </>
  );
}
