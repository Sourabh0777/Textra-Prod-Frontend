/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from '@clerk/nextjs';
import { useFetchWhatsAppLogsQuery } from '@/lib/api/endpoints/whatsappApi';

export function useWhatsAppLogsPage() {
  const { user: clerkUser, isLoaded } = useUser();

  /** RTK Query hooks */
  const {
    data: logsResponse,
    isLoading: loading,
    error: fetchError,
  } = useFetchWhatsAppLogsQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const logs = Array.isArray(logsResponse) ? logsResponse : (logsResponse as any)?.data || [];

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    sent: 'success',
    delivered: 'success',
    read: 'info',
    failed: 'danger',
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return {
    logs,
    loading,
    fetchError,
    statusVariant,
    formatDate,
  };
}
