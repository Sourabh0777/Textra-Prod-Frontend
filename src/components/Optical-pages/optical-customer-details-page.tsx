'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchOpticalCustomerQuery, useFetchPrescriptionsQuery, useFetchLensOrdersQuery, useFetchFrameOrdersQuery, useFetchBillsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface OpticalCustomerDetailsPageProps {
  customerId: string;
}

export default function OpticalCustomerDetailsPage({ customerId }: OpticalCustomerDetailsPageProps) {
  const { data: customer, isLoading: loadingCustomer } = useFetchOpticalCustomerQuery(customerId);
  const { data: prescriptions, isLoading: loadingPrescriptions } = useFetchPrescriptionsQuery(customerId);
  const { data: lensOrders, isLoading: loadingLensOrders } = useFetchLensOrdersQuery({ customerId });
  const { data: frameOrders, isLoading: loadingFrameOrders } = useFetchFrameOrdersQuery({ customerId });
  const { data: bills, isLoading: loadingBills } = useFetchBillsQuery({ customerId } as any);

  if (loadingCustomer || !customer) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{customer.name}</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Patient profile, prescriptions, orders, and billing summary.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/optical-service/orders"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all duration-300"
          >
            Orders
          </Link>
          <Link
            href="/optical-service/bills"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all duration-300"
          >
            Bills
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Contact</p>
          <p className="text-slate-800 font-semibold mt-2">{customer.phone_number}</p>
          <p className="text-slate-500 text-sm">{customer.email ?? 'No email provided'}</p>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Age / Gender</p>
          <p className="text-slate-800 font-semibold mt-2">{customer.age ?? 'N/A'} yrs</p>
          <p className="text-slate-500 text-sm capitalize">{customer.gender ?? 'Unknown'}</p>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Records</p>
          <p className="text-slate-800 font-semibold mt-2">{prescriptions?.length ?? 0} prescriptions</p>
          <p className="text-slate-500 text-sm">{lensOrders?.length ?? 0} lens orders, {frameOrders?.length ?? 0} frame orders</p>
          <p className="text-slate-500 text-sm">{bills?.length ?? 0} bills</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Latest Prescriptions</h2>
          <div className="mt-4">
            {loadingPrescriptions ? (
              <Loader />
            ) : prescriptions?.length ? (
              <ul className="space-y-3 text-slate-700 text-sm">
                {prescriptions.slice(0, 4).map((item: any) => (
                  <li key={item._id} className="rounded-2xl border border-slate-100 p-3 bg-slate-50">
                    <p>{item.lens_type ?? 'Prescription'}</p>
                    <p className="text-slate-400 text-xs">{new Date(item.created_at).toLocaleDateString('en-GB')}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm">No prescriptions found.</p>
            )}
          </div>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <div className="mt-4">
            {(loadingLensOrders || loadingFrameOrders) ? (
              <Loader />
            ) : (lensOrders?.slice(0, 3) ?? []).concat(frameOrders?.slice(0, 3) ?? []).length ? (
              <ul className="space-y-3 text-slate-700 text-sm">
                {(lensOrders ?? []).slice(0, 2).map((order: any) => (
                  <li key={order._id} className="rounded-2xl border border-slate-100 p-3 bg-slate-50">
                    <p className="font-semibold">Lens • {order.lens_type}</p>
                    <p className="text-slate-400 text-xs">₹{order.price?.toFixed?.(2) ?? '0.00'}</p>
                  </li>
                ))}
                {(frameOrders ?? []).slice(0, 2).map((order: any) => (
                  <li key={order._id} className="rounded-2xl border border-slate-100 p-3 bg-slate-50">
                    <p className="font-semibold">Frame • {order.frame_name}</p>
                    <p className="text-slate-400 text-xs">₹{order.price?.toFixed?.(2) ?? '0.00'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm">No orders available.</p>
            )}
          </div>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Recent Bills</h2>
          <div className="mt-4">
            {loadingBills ? (
              <Loader />
            ) : bills?.length ? (
              <ul className="space-y-3 text-slate-700 text-sm">
                {bills.slice(0, 4).map((bill: any) => (
                  <li key={bill._id} className="rounded-2xl border border-slate-100 p-3 bg-slate-50">
                    <p>{bill.invoice_number}</p>
                    <p className="text-slate-400 text-xs">₹{bill.total?.toFixed?.(2) ?? '0.00'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm">No bills found.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Patient activity</h2>
          <Table>
            <thead>
              <TableRow className="bg-slate-50/50">
                <th className="px-6 py-3 text-left font-bold text-slate-600">Type</th>
                <th className="px-6 py-3 text-left font-bold text-slate-600">Reference</th>
                <th className="px-6 py-3 text-left font-bold text-slate-600">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-slate-600">Date</th>
              </TableRow>
            </thead>
            <TableBody>
              {(bills ?? []).slice(0, 4).map((bill: any) => (
                <TableRow key={bill._id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell>Bill</TableCell>
                  <TableCell>{bill.invoice_number}</TableCell>
                  <TableCell>₹{bill.total?.toFixed?.(2) ?? '0.00'}</TableCell>
                  <TableCell>{new Date(bill.bill_date).toLocaleDateString('en-GB')}</TableCell>
                </TableRow>
              ))}
              {!(bills?.length) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                    No recent activity recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
