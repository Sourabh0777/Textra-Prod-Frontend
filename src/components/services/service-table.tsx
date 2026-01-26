import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IService } from '@/types';
import { formatDate } from '@/lib/utils';

interface ServiceTableProps {
  services: IService[];
  onEdit: (service: IService) => void;
  onDelete: (id: string) => void;
}

export function ServiceTable({ services, onEdit, onDelete }: ServiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-2 md:px-4 py-3">Vehicle</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3">Service Info</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Status</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service: IService) => {
            const vehicle = service.vehicle_id as any;
            const customer = vehicle?.customer_id as any;
            return (
              <TableRow key={service._id}>
                <TableCell className="px-2 md:px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900 text-sm sm:text-base tracking-wide">
                      {vehicle?.registration_number || 'N/A'}
                    </span>
                    <span className="text-xs text-neutral-600 font-medium">
                      {vehicle?.brand} {vehicle?.vehicle_model}
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold mt-0.5">
                      {customer?.name || 'Unknown Owner'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-2 md:px-4 py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Last:</span>
                      <span className="text-xs font-semibold text-neutral-800">
                        {formatDate(service.last_service_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Next:</span>
                      <span className="text-xs font-semibold text-indigo-600">
                        {formatDate(service.next_service_date)}
                      </span>
                    </div>
                    <div className="lg:hidden mt-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ring-1 ring-inset ${
                          service.status === 'completed'
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      service.status === 'completed'
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                    }`}
                  >
                    {service.status}
                  </span>
                </TableCell>
                <TableCell className="px-2 md:px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(service)}
                      className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                    >
                      <span className="hidden sm:inline">Edit</span>
                      <span className="sm:hidden">✎</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(service._id || '')}
                      className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                    >
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">✕</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-medium text-neutral-400">No Services Found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
