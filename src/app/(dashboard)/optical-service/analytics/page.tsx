'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useFetchOpticalSummaryQuery, useFetchOpticalRevenueQuery, useFetchOpticalTopItemsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/table';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart, TrendingUp } from 'lucide-react';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function OpticalAnalyticsPage() {
  const today = new Date();
  const [startDate, setStartDate] = useState(formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState(formatDate(today));

  const { data: summary, isLoading: loadingSummary } = useFetchOpticalSummaryQuery();
  const { data: revenue, isLoading: loadingRevenue } = useFetchOpticalRevenueQuery({ startDate, endDate });
  const { data: topItems, isLoading: loadingTopItems } = useFetchOpticalTopItemsQuery(undefined);
  const loading = loadingSummary || loadingRevenue || loadingTopItems;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Optical Analytics</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            View sales trends, revenue performance, and top-selling optical items.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Total Revenue</p>
              <p className="text-2xl font-semibold text-slate-900">₹{summary?.total_revenue?.toFixed?.(2) ?? '0.00'}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-[#15368A]" />
          </div>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Pending Amount</p>
              <p className="text-2xl font-semibold text-slate-900">₹{summary?.pending_revenue?.toFixed?.(2) ?? '0.00'}</p>
            </div>
            <BarChart className="w-6 h-6 text-[#15368A]" />
          </div>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Active Patients</p>
              <p className="text-2xl font-semibold text-slate-900">{summary?.active_customers ?? 0}</p>
            </div>
            <Calendar className="w-6 h-6 text-[#15368A]" />
          </div>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Revenue Range</h2>
            <p className="text-slate-500 text-xs">Choose a date range to update the revenue chart.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="space-y-1 text-slate-500 text-xs">
              <label htmlFor="startDate">Start date</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div className="space-y-1 text-slate-500 text-xs">
              <label htmlFor="endDate">End date</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <Button onClick={() => setStartDate(formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)))} type="button">
              Last 7 days
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHead className="bg-slate-50/50">
                <TableRow>
                  <TableHeaderCell className="font-bold text-slate-600">Metric</TableHeaderCell>
                  <TableHeaderCell className="font-bold text-slate-600">Value</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total revenue</TableCell>
                  <TableCell>₹{revenue?.total_revenue?.toFixed?.(2) ?? '0.00'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total invoices</TableCell>
                  <TableCell>{revenue?.invoice_count ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average invoice</TableCell>
                  <TableCell>₹{revenue?.average_invoice?.toFixed?.(2) ?? '0.00'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Top Selling Items</h2>
            <p className="text-slate-500 text-xs">Top ordered optical products across lens and frame orders.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead className="bg-slate-50/50">
                <TableRow>
                  <TableHeaderCell className="font-bold text-slate-600">Item</TableHeaderCell>
                  <TableHeaderCell className="font-bold text-slate-600">Orders</TableHeaderCell>
                  <TableHeaderCell className="font-bold text-slate-600">Revenue</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(topItems ?? []).length > 0 ? (
                  topItems.map((item: any) => (
                    <TableRow key={item._id ?? item.name}>
                      <TableCell>{item.name ?? item.label ?? 'Unknown item'}</TableCell>
                      <TableCell>{item.count ?? item.quantity ?? 0}</TableCell>
                      <TableCell>₹{item.revenue?.toFixed?.(2) ?? '0.00'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                      No top item analytics available.
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
