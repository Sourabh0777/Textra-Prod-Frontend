'use client';

import { useFetchOpticalSummaryQuery, useFetchBillsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default function OpticalDashboardHome() {
  const { data: summary, isLoading: isSummaryLoading } = useFetchOpticalSummaryQuery();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bills, isLoading: isBillsLoading } = useFetchBillsQuery({ limit: 5 } as any);

  if (isSummaryLoading || isBillsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Sales",
      value: `₹${summary?.today_sales?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600",
      description: "Billed value generated today",
    },
    {
      title: "Total Revenue Collected",
      value: `₹${summary?.total_revenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      description: "Total payment received to date",
    },
    {
      title: "Total Collection Pending",
      value: `₹${summary?.pending_revenue?.toFixed(2) || '0.00'}`,
      icon: Calendar,
      color: "from-amber-500 to-orange-600",
      description: "Total outstanding balances",
    },
    {
      title: "Active Patients",
      value: summary?.active_customers || 0,
      icon: Users,
      color: "from-purple-500 to-pink-600",
      description: "Total registered checkup profiles",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Optical Shop Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Quick statistics overview, patient registry summaries, and sales analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/optical-service/orders/new"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15368A] hover:bg-[#0f286b] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Create Quick Order
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white group">
              <div className="p-6 flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {card.title}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-[#15368A] transition-colors duration-300">
                    {card.value}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3.5 rounded-2xl bg-linear-to-tr ${card.color} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            <p className="text-slate-400 text-xs mt-0.5">List of the latest bills and payments generated.</p>
          </div>
          <Link
            href="/optical-service/bills"
            className="text-xs font-bold text-[#15368A] hover:underline"
          >
            View All Bills
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
              <TableRow>
                <TableHead className="font-bold text-slate-600">Invoice Number</TableHead>
                <TableHead className="font-bold text-slate-600">Patient Name</TableHead>
                <TableHead className="font-bold text-slate-600">Date</TableHead>
                <TableHead className="font-bold text-slate-600">Total Bill</TableHead>
                <TableHead className="font-bold text-slate-600">Amount Paid</TableHead>
                <TableHead className="font-bold text-slate-600">Payment Status</TableHead>
                <TableHead className="font-bold text-slate-600 text-right">Actions</TableHead>
              </TableRow>
            <TableBody>
              {bills && bills.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                bills.map((bill:any) => (
                  <TableRow key={bill._id} className="hover:bg-slate-50/40 transition-colors duration-200">
                    <TableCell className="font-semibold text-slate-700">{bill.invoice_number}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{bill.customer_id?.name || 'Walk-in Patient'}</TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(bill.bill_date).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">₹{bill.total.toFixed(2)}</TableCell>
                    <TableCell className="text-emerald-600 font-medium">₹{bill.amount_paid.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="success"
                        className={`capitalize font-bold text-xs px-2.5 py-0.5 rounded-full ${
                          bill.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : bill.payment_status === 'partial'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {bill.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/optical-service/bills/${bill._id}`}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold text-[#15368A] hover:bg-slate-100 border border-slate-100 transition-colors duration-200"
                      >
                        View Invoice
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                    No transactions generated yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
