/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IBusinessType } from '@/types';

interface BusinessTypeTableProps {
  businessTypes: IBusinessType[];
  onEdit: (type: IBusinessType) => void;
  onDelete: (id: string) => void;
}

export function BusinessTypeTable({ businessTypes, onEdit, onDelete }: BusinessTypeTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {businessTypes.map((type: IBusinessType) => (
            <TableRow key={type._id}>
              <TableCell className="font-semibold">{type.name}</TableCell>
              <TableCell className="text-sm">{type.description || '-'}</TableCell>
              <TableCell>
                <Badge variant={type.is_active ? 'success' : 'danger'}>{type.is_active ? 'Active' : 'Inactive'}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(type)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(type._id || '')}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {businessTypes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                No business types found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
