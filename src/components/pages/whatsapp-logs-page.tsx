'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { fetchWhatsAppLogs } from '@/lib/api';
import type { IWhatsAppLog } from '@/types';

export default function WhatsAppLogsPage() {
  const [logs, setLogs] = useState<IWhatsAppLog[]>([]);
  const [loading, setLoading] = useState(true);

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    sent: 'success',
    delivered: 'success',
    read: 'info',
    failed: 'danger',
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchWhatsAppLogs();
    if (result.success && Array.isArray(result.data)) {
      setLogs(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
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
                    logs.map((log) => (
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
