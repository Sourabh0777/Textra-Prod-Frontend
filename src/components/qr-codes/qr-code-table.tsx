import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IQRCode } from '@/types';

interface QRCodeTableProps {
  qrCodes: IQRCode[];
  onEdit: (qr: IQRCode) => void;
  onDelete: (id: string) => void;
}

export function QRCodeTable({ qrCodes, onEdit, onDelete }: QRCodeTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-4 py-3">ID</TableHeaderCell>
            <TableHeaderCell className="px-4 py-3">Code</TableHeaderCell>
            <TableHeaderCell className="px-4 py-3">Prefilled Message</TableHeaderCell>
            <TableHeaderCell className="px-4 py-3">Deep Link URL</TableHeaderCell>
            <TableHeaderCell className="px-4 py-3 text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qrCodes.map((qr) => (
            <TableRow key={qr._id}>
              <TableCell className="px-4 py-3 font-medium text-neutral-900">{qr.qr_id}</TableCell>
              <TableCell className="px-4 py-3 text-sm text-neutral-600">{qr.code}</TableCell>
              <TableCell className="px-4 py-3 text-sm text-neutral-600">
                <span className="line-clamp-2 max-w-xs" title={qr.prefilled_message}>
                  {qr.prefilled_message || '-'}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-neutral-600">
                <a
                  href={qr.deep_link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-block max-w-[200px] truncate"
                >
                  {qr.deep_link_url || '-'}
                </a>
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(qr)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(qr._id || '')}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {qrCodes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-neutral-500">
                No QR Codes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
