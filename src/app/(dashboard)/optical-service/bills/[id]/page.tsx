'use client';

import { useParams, useRouter } from 'next/navigation';
import OpticalBillDetailsPage from '@/components/Optical-pages/optical-bill-details-page';

export default function Page() {
  const params = useParams();
  const billId = params?.id as string;
  const router = useRouter();

  return (
    <OpticalBillDetailsPage
      billId={billId}
      onRefresh={() => router.refresh()}
    />
  );
}
