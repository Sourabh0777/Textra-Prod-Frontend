/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IVehicle } from '@/types';

interface VehicleTableProps {
  vehicles: IVehicle[];
  onEdit: (vehicle: IVehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-2 md:px-4 py-3">Vehicle</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3">Owner</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3 text-center">
              Year / Travel
            </TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle: IVehicle) => (
            <TableRow key={vehicle._id}>
              <TableCell className="px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-900 text-sm sm:text-base tracking-wide">
                    {vehicle.registration_number}
                  </span>
                  <span className="text-xs text-neutral-600 font-medium">
                    {vehicle.brand} {vehicle.vehicle_model}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-800 font-medium">{vehicle?.customer_id?.name || '-'}</span>
                  <span className="text-[11px] text-neutral-500">{vehicle?.customer_id?.phone_number || ''}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3 text-center">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-700">{vehicle.year}</span>
                  <span className="text-xs text-neutral-500">{vehicle.daily_travel} KM/day</span>
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-right">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">✎</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(vehicle._id || '')}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  >
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">✕</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {vehicles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-neutral-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-medium text-neutral-400">No Vehicles Found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
