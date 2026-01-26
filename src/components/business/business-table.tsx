/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IBusiness } from '@/types';

interface BusinessTableProps {
  businesses: IBusiness[];
  onEdit: (business: IBusiness) => void;
  onDelete: (id: string) => void;
}

export function BusinessTable({ businesses, onEdit, onDelete }: BusinessTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-2 md:px-4 py-3">Business Details</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell px-2 md:px-4 py-3">Owner Info</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Location</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">Status</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {businesses.map((business: IBusiness) => (
            <TableRow key={business._id}>
              <TableCell className="px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-900 text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                    {business.business_name}
                  </span>
                  <span className="text-xs text-neutral-500 md:hidden">{business.owner_name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-700 font-medium">{business.owner_name}</span>
                  <span className="text-xs text-neutral-500">{business.phone_number}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                <span className="text-sm text-neutral-600">{business.city}</span>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-center sm:text-left">
                <Badge variant={business.is_active ? 'success' : 'danger'} className="text-[10px] sm:text-xs">
                  {business.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-right">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(business)}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">✎</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(business._id || '')}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  >
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">✕</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {businesses.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-neutral-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-medium text-neutral-400">No Businesses Found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
