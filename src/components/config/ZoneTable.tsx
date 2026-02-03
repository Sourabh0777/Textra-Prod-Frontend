import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IZone } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';

interface ZoneTableProps {
  zones: IZone[];
  onEdit: (zone: IZone) => void;
  onDelete: (id: string) => void;
}

export function ZoneTable({ zones, onEdit, onDelete }: ZoneTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Zone Name</TableHeaderCell>
            <TableHeaderCell>State</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone._id}>
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell>{typeof zone.state_id === 'object' ? zone.state_id.name : 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={zone.is_active ? 'success' : 'danger'}>{zone.is_active ? 'Active' : 'Inactive'}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(zone)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(zone._id || '')}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {zones.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                No zones found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
