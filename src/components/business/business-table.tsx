/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IBusiness } from '@/types';

interface BusinessTableProps {
  businesses: IBusiness[];
  onEditDetails: (business: IBusiness) => void;
  onEditWhatsApp: (business: IBusiness) => void;
  onDelete: (id: string) => void;
}

export function BusinessTable({ businesses, onEditDetails, onEditWhatsApp, onDelete }: BusinessTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-2 md:px-4 py-3">Business Details</TableHeaderCell>
            <TableHeaderCell className="hidden sm:table-cell px-2 md:px-4 py-3">Business Type</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell px-2 md:px-4 py-3">Owner Info</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Location</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">Status</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">QR Code</TableHeaderCell>
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
              <TableCell className="hidden sm:table-cell px-2 md:px-4 py-3">
                <Badge variant="info" className="text-[10px] sm:text-xs">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {typeof business.business_type_id === 'object'
                    ? (business.business_type_id as any).name
                    : business.business_type_id}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-700 font-medium">{business.owner_name}</span>
                  <div className="flex flex-col text-xs text-neutral-500">
                    <span>{business.phone_number}</span>
                    {business.email && <span className="text-neutral-400">{business.email}</span>}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-700">{business.city}</span>
                  {(business.zone_id || business.zone) && (
                    <span className="text-xs text-neutral-500">
                      {typeof business.zone_id === 'object' ? business.zone_id.name : business.zone}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-center sm:text-left">
                <Badge variant={business.is_active ? 'success' : 'danger'} className="text-[10px] sm:text-xs">
                  {business.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-center sm:text-left">
                {business.qr_code_id && typeof business.qr_code_id === 'object' ? (
                  <div className="flex items-center gap-3 group relative">
                    {(business.qr_code_id as any).qr_image_url && (
                      <div className="w-10 h-10 border border-neutral-200 rounded p-1 bg-white shadow-sm overflow-hidden flex-shrink-0">
                        <img
                          src={(business.qr_code_id as any).qr_image_url}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-neutral-700 truncate">
                        {(business.qr_code_id as any).code}
                      </span>
                      {(business.qr_code_id as any).prefilled_message && (
                        <span
                          className="text-[9px] sm:text-[10px] text-neutral-500 line-clamp-1 italic"
                          title={(business.qr_code_id as any).prefilled_message}
                        >
                          "{(business.qr_code_id as any).prefilled_message}"
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] sm:text-xs text-neutral-400 italic">No QR Assigned</span>
                )}
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-right">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditDetails(business)}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                    title="Edit Details"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">✎</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditWhatsApp(business)}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="WhatsApp Settings"
                  >
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">📱</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(business._id || '')}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                    title="Delete Business"
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
              <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
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
