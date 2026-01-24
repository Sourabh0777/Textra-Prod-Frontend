/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { useFetchWhatsAppLogsQuery } from '@/lib/api/endpoints/whatsappApi';
import type { IWhatsAppLog } from '@/types';
import { useUser } from '@clerk/nextjs';

export default function WhatsAppLogsPage() {
  const { user: clerkUser, isLoaded } = useUser();

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    sent: 'success',
    delivered: 'success',
    read: 'info',
    failed: 'danger',
  };

  /** RTK Query hooks */
  const {
    data: logsResponse,
    isLoading: loading,
    error: fetchError,
  } = useFetchWhatsAppLogsQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const logs = Array.isArray(logsResponse) ? logsResponse : (logsResponse as any)?.data || [];

  if (loading) {
    return (
      <>
        <Header title="WhatsApp Logs" subtitle="View message delivery logs" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="WhatsApp Logs" subtitle="View message delivery logs" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading logs. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <Header title="WhatsApp Logs" subtitle="View message delivery logs" />

      <div className="p-4 md:p-8">
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Phone Number</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Template</TableHeaderCell>
                    <TableHeaderCell className="hidden lg:table-cell">Message ID</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell className="hidden md:table-cell">Sent At</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-neutral-500 py-8">
                        No WhatsApp logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log: IWhatsAppLog) => (
                      <TableRow key={log._id}>
                        <TableCell className="font-semibold">{log.phone_number}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{log.template_name}</TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs">{log.message_id}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[log.message_status] || 'info'}>{log.message_status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{formatDate(log.sent_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
