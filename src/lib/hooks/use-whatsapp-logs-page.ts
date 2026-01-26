/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
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

  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.phone_number?.toLowerCase() || '').includes(searchLower) ||
      (log.template_name?.toLowerCase() || '').includes(searchLower) ||
      (log.message_id?.toLowerCase() || '').includes(searchLower)
    );
  });

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
    searchQuery,
    setSearchQuery,
    filteredLogs,
  };
}
