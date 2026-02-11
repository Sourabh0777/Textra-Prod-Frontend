'use client';

import { useFetchUserData } from '@/lib/hooks/useFetchUserData';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/components/ui/loader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useFetchUserData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
    if (!isLoading && !user) {
      // If user data is missing after loading, redirect to dashboard as well
      // This assumes useFetchUserData handles Clerk authentication state
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user || user.role !== UserRole.ADMIN) {
    return null; // Or a custom unauthorized message
  }

  return <>{children}</>;
}
