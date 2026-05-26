'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useFetchPrescriptionsQuery, useDeletePrescriptionMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Search, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OpticalPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: prescriptions, isLoading, refetch } = useFetchPrescriptionsQuery(undefined);
  const [deletePrescription, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

  const filteredPrescriptions = (prescriptions ?? []).filter((prescription: any) => {
    const patient = prescription.customer_id?.name?.toString().toLowerCase() ?? '';
    const lensType = prescription.lens_type?.toString().toLowerCase() ?? '';
    const query = searchTerm.toLowerCase();
    return patient.includes(query) || lensType.includes(query) || prescription._id?.toString().includes(query);
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePrescription(id).unwrap();
      toast.success('Prescription deleted successfully.');
      refetch();
    } catch (error: unknown) {
      toast.error('Unable to delete prescription.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prescriptions</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Browse all optical prescriptions recorded for registered patients.
          </p>
        </div>
        <Link
          href="/optical-service/prescriptions/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15368A] text-white text-sm font-semibold hover:bg-[#0f286b] transition-all duration-300"
        >
          <FileText className="w-4 h-4" />
          New Prescription
        </Link>
      </div>

      <Card className="p-4 border border-slate-100 shadow-sm rounded-xl bg-white flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, lens type, or ID..."
            className="pl-10 w-full rounded-xl border-slate-200"
          />
        </div>
      </Card>

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
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Patient</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Lens Type</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Right Eye</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Left Eye</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-600">Created</th>
                  <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                </TableRow>
              </thead>
              <TableBody>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription: any) => (
                    <TableRow key={prescription._id} className="hover:bg-slate-50/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col text-slate-800 text-sm">
                          <span className="font-semibold">{prescription.customer_id?.name ?? 'Unknown Patient'}</span>
                          <span className="text-slate-400 text-xs">{prescription.customer_id?._id ?? prescription._id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.lens_type ?? 'N/A'}</TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {prescription.right_sph ?? '-'} / {prescription.right_cyl ?? '-'} / {prescription.right_axis ?? '-'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {prescription.left_sph ?? '-'} / {prescription.left_cyl ?? '-'} / {prescription.left_axis ?? '-'}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {new Date(prescription.created_at).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Link
                            href={`/optical-service/customers/${prescription.customer_id?._id}`}
                            className="text-xs text-[#15368A] hover:underline"
                          >
                            View Patient
                          </Link>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(prescription._id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                      No prescriptions found.
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
