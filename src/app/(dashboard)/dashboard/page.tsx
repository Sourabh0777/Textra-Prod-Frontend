'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchUserData } from '@/lib/hooks/useFetchUserData';
import { UserRole } from '@/types';
import DashboardPage from '@/components/pages/dashboard-page';
import { Loader } from '@/components/ui/loader';

export default function Page() {
  const { user, isLoading } = useFetchUserData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role === UserRole.OPTICAL_SERVICE) {
      router.push('/optical-service/customers');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (user && user.role === UserRole.OPTICAL_SERVICE) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return <DashboardPage />;
}
