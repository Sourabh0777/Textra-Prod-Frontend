/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ICustomer, FlowStep } from '@/types';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, MoreHorizontal, LayoutList } from 'lucide-react';

interface CustomerTableProps {
  customers: ICustomer[];
  onEdit: (customer: ICustomer) => void;
  onDelete: (id: string) => void;
}

const STEP_CONFIG: Record<string, { label: string; variant: any }> = {
  [FlowStep.START]: { label: 'Started', variant: 'secondary' },
  [FlowStep.ASK_VEHICLE]: { label: 'Vehicle Info', variant: 'info' },
  [FlowStep.VEHICLE_CONFIRM]: { label: 'Confirmation', variant: 'info' },
  [FlowStep.ASK_LAST_SERVICE]: { label: 'Service Info', variant: 'info' },
  [FlowStep.ASK_VEHICLE_TYPE]: { label: 'Vehicle Type', variant: 'info' },
  [FlowStep.ASK_DAILY_USAGE]: { label: 'Usage Info', variant: 'info' },
  [FlowStep.ASK_MODEL]: { label: 'Model Info', variant: 'info' },
  [FlowStep.RETURNING_USER_OPTIONS]: { label: 'Returning', variant: 'warning' },
  [FlowStep.COMPLETED]: { label: 'Finished', variant: 'success' },
};

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const [openDraftId, setOpenDraftId] = useState<string | null>(null);

  const toggleDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDraftId(openDraftId === id ? null : id);
  };

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-2 md:px-4 py-3">Customer Info</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell px-2 md:px-4 py-3">Contact</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-center">Onboarding Status</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Joined</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">Account</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer: ICustomer) => (
            <TableRow key={customer._id}>
              <TableCell className="px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <Link
                    href={`/vehicle-service/customers/${customer._id}`}
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                  >
                    {customer.name}
                  </Link>
                  <span className="text-xs text-neutral-500 sm:hidden">{customer.phone_number}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell px-2 md:px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-700 font-medium">{customer.phone_number}</span>
                  {customer.email && <span className="text-xs text-neutral-500">{customer.email}</span>}
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2">
                    {customer.onboarding?.status ? (
                      <Badge
                        variant={customer.onboarding.status === 'COMPLETED' ? 'success' : 'warning'}
                        className="text-[10px] uppercase tracking-wider font-bold"
                      >
                        {customer.onboarding.status}
                      </Badge>
                    ) : (
                      <span className="text-neutral-400 text-xs">-</span>
                    )}

                    {customer.onboarding?.draft && (
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDraft(customer._id || '', e)}
                          className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
                          title="View Draft Data"
                        >
                          <LayoutList className="h-3.5 w-3.5" />
                        </button>

                        {openDraftId === customer._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDraftId(null)} />
                            <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-neutral-200 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200 origin-top-right">
                              <div className="flex items-center gap-2 border-b pb-2 mb-3">
                                <Info className="h-4 w-4 text-blue-500" />
                                <h4 className="font-bold text-sm text-neutral-900">Onboarding Draft</h4>
                              </div>
                              <div className="space-y-2.5">
                                {Object.entries(customer.onboarding?.draft || {}).map(([key, value]) => (
                                  <div key={key} className="flex flex-col">
                                    <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-tight">
                                      {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-xs text-neutral-800 font-medium truncate">
                                      {value
                                        ? key.includes('date')
                                          ? formatDate(value as string)
                                          : String(value)
                                        : 'N/A'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {customer.onboarding?.current_step && (
                    <Badge
                      variant={STEP_CONFIG[customer.onboarding.current_step]?.variant || 'secondary'}
                      className="text-[9px] py-0 px-2 font-normal italic"
                    >
                      {STEP_CONFIG[customer.onboarding.current_step]?.label || customer.onboarding.current_step}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                <span className="text-sm text-neutral-600">{formatDate(customer.created_at || '')}</span>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-center sm:text-left">
                <Badge variant={customer.is_active ? 'success' : 'danger'} className="text-[10px] sm:text-xs">
                  {customer.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="px-2 md:px-4 py-3 text-right">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(customer)}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">✎</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(customer._id || '')}
                    className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  >
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">✕</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-neutral-500">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-medium text-neutral-400">No Customers Found</span>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
