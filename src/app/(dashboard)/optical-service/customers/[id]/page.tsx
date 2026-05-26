'use client';

import { useParams } from 'next/navigation';
import OpticalCustomerDetailsPage from '@/components/Optical-pages/optical-customer-details-page';

export default function Page() {
  const params = useParams();
  const customerId = params?.id as string;

  return <OpticalCustomerDetailsPage customerId={customerId} />;
}
