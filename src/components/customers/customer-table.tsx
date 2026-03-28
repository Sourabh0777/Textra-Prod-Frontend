/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ICustomer } from '@/types';
import { formatDate } from '@/lib/utils';

interface CustomerTableProps {
  customers: ICustomer[];
  onEdit: (customer: ICustomer) => void;
  onDelete: (id: string) => void;
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className="px-2 md:px-4 py-3">Customer Information</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell px-2 md:px-4 py-3">Contact Details</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell px-2 md:px-4 py-3">Joined On</TableHeaderCell>
            <TableHeaderCell className="px-2 md:px-4 py-3 text-center sm:text-left">Status</TableHeaderCell>
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
              <TableCell className="hidden lg:table-cell px-2 md:px-4 py-3">
                <span className="text-sm text-neutral-600">{formatDate(customer.created_at)}</span>
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
              <TableCell colSpan={5} className="text-center py-12 text-neutral-500">
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
