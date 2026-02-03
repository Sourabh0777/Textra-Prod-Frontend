import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IState } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';

interface StateTableProps {
  states: IState[];
  onEdit: (state: IState) => void;
  onDelete: (id: string) => void;
}

export function StateTable({ states, onEdit, onDelete }: StateTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>State Name</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {states.map((state) => (
            <TableRow key={state._id}>
              <TableCell className="font-medium">{state.name}</TableCell>
              <TableCell>
                <Badge variant={state.is_active ? 'success' : 'danger'}>
                  {state.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(state)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(state._id || '')}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {states.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-neutral-500">
                No states found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
