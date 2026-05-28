'use client';

import { useFetchOpticalCustomersQuery, useFetchPrescriptionsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Loader } from '@/components/ui/loader';
import { Users, FileText, PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OpticalDashboardPage() {
  const { data: customers, isLoading: isCustomersLoading } = useFetchOpticalCustomersQuery();
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useFetchPrescriptionsQuery();

  if (isCustomersLoading || isPrescriptionsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const activeCustomersCount = customers?.length || 0;
  const totalPrescriptionsCount = prescriptions?.length || 0;

  const statCards = [
    {
      title: "Total Registered Customers",
      value: activeCustomersCount,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      description: "Examination profile registry count",
    },
    {
      title: "Total Eye Prescriptions",
      value: totalPrescriptionsCount,
      icon: FileText,
      color: "from-purple-500 to-pink-600",
      description: "Diagnostic records logged to date",
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
            Quick CRM overview, customer registries, and prescription diagnostic archives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/optical-service/prescriptions/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15368A] hover:bg-[#0f286b] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            Record Prescription
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white group">
              <div className="p-6 flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {card.title}
                  </span>
                  <h3 className="text-3xl font-bold text-slate-800 tracking-tight group-hover:text-[#15368A] transition-colors duration-300">
                    {card.value}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${card.color} text-white shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Customers */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Registrations</h2>
              <p className="text-slate-400 text-xs mt-0.5">Latest additions to your customer directory.</p>
            </div>
            <Link
              href="/optical-service/customers"
              className="text-xs font-bold text-[#15368A] hover:underline flex items-center gap-1"
            >
              View Registry <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Name</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Contact</th>
                  <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                </TableRow>
              </thead>
              <TableBody>
                {customers && customers.length > 0 ? (
                  customers.slice(0, 5).map((cust: any) => (
                    <TableRow key={cust._id} className="hover:bg-slate-50/40 transition-colors duration-200">
                      <TableCell className="font-semibold text-slate-700">{cust.name}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{cust.phone_number || 'No Phone'}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/optical-service/customers/${cust._id}`}
                          className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold text-[#15368A] hover:bg-slate-100 border border-slate-100 transition-colors duration-200"
                        >
                          View Profile
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                      No customers registered yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Recent Prescriptions */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Diagnostic Prescriptions</h2>
              <p className="text-slate-400 text-xs mt-0.5">Recently recorded eye checkup prescriptions.</p>
            </div>
            <Link
              href="/optical-service/prescriptions"
              className="text-xs font-bold text-[#15368A] hover:underline flex items-center gap-1"
            >
              All Prescriptions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <TableRow>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Customer</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Lens Type</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Date</th>
                </TableRow>
              </thead>
              <TableBody>
                {prescriptions && prescriptions.length > 0 ? (
                  prescriptions.slice(0, 5).map((pres: any) => (
                    <TableRow key={pres._id} className="hover:bg-slate-50/40 transition-colors duration-200">
                      <TableCell className="font-semibold text-slate-700">{pres.customer_id?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-slate-500 text-xs">{pres.lens_type || 'N/A'}</TableCell>
                      <TableCell className="text-slate-400 text-xxs">
                        {new Date(pres.created_at).toLocaleDateString('en-GB')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                      No prescriptions generated yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
