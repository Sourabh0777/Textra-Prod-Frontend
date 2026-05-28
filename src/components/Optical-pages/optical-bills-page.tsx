'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useFetchBillsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function OpticalBillsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: bills, isLoading } = useFetchBillsQuery(
    statusFilter ? { paymentStatus: statusFilter } : undefined as any,
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bills & Invoices</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage billing records and review outstanding payments.</p>
        </div>
        <Link
          href="/optical-service/bills/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15368A] text-white text-sm font-semibold hover:bg-[#0f286b] transition-all duration-300"
        >
          <FileText className="w-4 h-4" />
          Create Bill
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 min-w-55">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        {isLoading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow className="bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Invoice</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Customer</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Total</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Paid</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Date</th>
                  <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                </TableRow>
              </thead>
              <TableBody>
                {bills && bills.map((bill: any) => (
                  <TableRow key={bill._id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell>{bill.invoice_number}</TableCell>
                    <TableCell>{bill.customer_id?.name ?? 'Walk-in'}</TableCell>
                    <TableCell>₹{bill.total?.toFixed?.(2) ?? '0.00'}</TableCell>
                    <TableCell>₹{bill.amount_paid?.toFixed?.(2) ?? '0.00'}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize text-xs px-2 py-1 rounded-full ${
                          bill.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : bill.payment_status === 'partial'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {bill.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(bill.bill_date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/optical-service/bills/${bill._id}`}
                        className="text-xs font-semibold text-[#15368A] hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {!(bills?.length) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      No billing records available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
