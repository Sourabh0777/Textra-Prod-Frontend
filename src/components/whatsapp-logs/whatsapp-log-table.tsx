/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { IWhatsAppLog } from '@/types';

interface WhatsAppLogTableProps {
  logs: IWhatsAppLog[];
  statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'>;
  onFormatDate: (date: any) => string;
}

export function WhatsAppLogTable({ logs, statusVariant, onFormatDate }: WhatsAppLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Phone Number</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell">Template</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell">Message ID</TableHeaderCell>
            <TableHeaderCell>Source</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell">Sent At</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-neutral-500 py-8">
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
                  <Badge variant={log.source === 'manual' ? 'warning' : 'info'} className="capitalize">
                    {log.source || 'cron'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[log.message_status] || 'info'}>{log.message_status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">{onFormatDate(log.sent_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
