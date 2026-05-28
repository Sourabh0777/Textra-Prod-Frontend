'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchOpticalCustomerQuery, useFetchPrescriptionsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Phone, Mail, Calendar, User, PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface OpticalCustomerDetailsPageProps {
  customerId: string;
}

export default function OpticalCustomerDetailsPage({ customerId }: OpticalCustomerDetailsPageProps) {
  const { data: customer, isLoading: loadingCustomer } = useFetchOpticalCustomerQuery(customerId);
  const { data: prescriptions, isLoading: loadingPrescriptions } = useFetchPrescriptionsQuery(customerId);

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
            Customer profile registry and eye examination history.
          </p>
        </div>
        <Link
          href="/optical-service/prescriptions/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15368A] text-white text-sm font-semibold hover:bg-[#0f286b] transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4" />
          Add Prescription
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-slate-400" />
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Contact Number</p>
          </div>
          <p className="text-slate-800 font-semibold mt-2">{customer.phone_number || 'No contact number'}</p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {customer.email ?? 'No email address'}
          </p>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-slate-400" />
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Age / Gender</p>
          </div>
          <p className="text-slate-800 font-semibold mt-2">{customer.age ?? 'N/A'} yrs</p>
          <p className="text-slate-500 text-sm capitalize">{customer.gender ?? 'Unknown'}</p>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Prescriptions Count</p>
          </div>
          <p className="text-slate-800 font-semibold mt-2">{prescriptions?.length ?? 0} eye diagnostics</p>
          <p className="text-slate-500 text-sm">Recorded in customer profile</p>
        </Card>
      </div>

      {customer.notes && (
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-5">
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Optometrist Notes / Primary Complaints</p>
          <p className="text-slate-700 text-sm mt-2 font-medium bg-slate-50 border border-slate-100 rounded-xl p-3">{customer.notes}</p>
        </Card>
      )}

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Eye Examination Registry</h2>
            <p className="text-slate-400 text-xs mt-0.5">List of historical optical prescription details recorded.</p>
          </div>
        </div>
        {loadingPrescriptions ? (
          <div className="flex h-44 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow className="bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Lens Type</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Right Eye (SPH/CYL/AXIS)</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Left Eye (SPH/CYL/AXIS)</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Examination Date</th>
                </TableRow>
              </thead>
              <TableBody>
                {prescriptions && prescriptions.length > 0 ? (
                  prescriptions.map((item: any) => (
                    <TableRow key={item._id} className="hover:bg-slate-50/30 transition-colors">
                      <TableCell className="font-semibold text-slate-700">{item.lens_type || 'N/A'}</TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {item.right_sph ?? '-'} / {item.right_cyl ?? '-'} / {item.right_axis ?? '-'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {item.left_sph ?? '-'} / {item.left_cyl ?? '-'} / {item.left_axis ?? '-'}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString('en-GB')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                      No eye examination records stored for this customer yet.
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
