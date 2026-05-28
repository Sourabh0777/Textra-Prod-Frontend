'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useFetchPrescriptionsQuery, useDeletePrescriptionMutation } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Search, FileText, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';

export default function OpticalPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: prescriptions, isLoading, refetch } = useFetchPrescriptionsQuery(undefined);
  const [deletePrescription, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

  const filteredPrescriptions = (prescriptions ?? []).filter((prescription: any) => {
    const customer = prescription.customer_id?.name?.toString().toLowerCase() ?? '';
    const lensType = prescription.lens_type?.toString().toLowerCase() ?? '';
    const query = searchTerm.toLowerCase();
    return customer.includes(query) || lensType.includes(query) || prescription._id?.toString().includes(query);
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
            Browse all optical prescriptions recorded for registered customers.
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
            placeholder="Search by customer name, lens type, or ID..."
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
          <>
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <thead>
                  <TableRow className="bg-slate-50/50">
                    <th className="px-6 py-3 text-left font-bold text-slate-600">Customer</th>
                    <th className="px-6 py-3 text-left font-bold text-slate-600">Lens Type</th>
                    <th className="px-6 py-3 text-left font-bold text-slate-600">Right Eye</th>
                    <th className="px-6 py-3 text-left font-bold text-slate-600">Left Eye</th>
                    <th className="px-6 py-3 text-left font-bold text-slate-600">Created</th>
                    <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                  </TableRow>
                </thead>
                <TableBody>
                  {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((prescription: any) => {
                      const isImage = prescription.prescription_type === 'image';
                      return (
                        <TableRow key={prescription._id} className="hover:bg-slate-50/30 transition-colors">
                          <TableCell>
                            <div className="flex flex-col text-slate-800 text-sm">
                              <span className="font-semibold">{prescription.customer_id?.name ?? 'Unknown Customer'}</span>
                              <span className="text-slate-400 text-xs">{prescription.customer_id?._id ?? prescription._id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isImage ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                Paper Prescription
                              </span>
                            ) : (
                              prescription.lens_type ?? 'N/A'
                            )}
                          </TableCell>
                          <TableCell className="text-slate-600 text-xs">
                            {isImage ? (
                              <span className="text-slate-400 italic">See Attached Photo</span>
                            ) : (
                              `${prescription.right_sph ?? '-'} / ${prescription.right_cyl ?? '-'} / ${prescription.right_axis ?? '-'}`
                            )}
                          </TableCell>
                          <TableCell className="text-slate-600 text-xs">
                            {isImage ? (
                              <span className="text-slate-400 italic">See Attached Photo</span>
                            ) : (
                              `${prescription.left_sph ?? '-'} / ${prescription.left_cyl ?? '-'} / ${prescription.left_axis ?? '-'}`
                            )}
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs">
                            {new Date(prescription.created_at).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex items-center gap-2 justify-end">
                              {isImage && prescription.image_url && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setPreviewImage(prescription.image_url)}
                                  className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View Photo
                                </Button>
                              )}
                              <Link
                                href={`/optical-service/customers/${prescription.customer_id?._id}`}
                                className="text-xs text-[#15368A] hover:underline font-semibold"
                              >
                                View Customer
                              </Link>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDelete(prescription._id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
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

            {/* Mobile view (stacked cards) */}
            <div className="block md:hidden divide-y divide-slate-100 bg-white">
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription: any) => {
                  const isImage = prescription.prescription_type === 'image';
                  return (
                    <div key={prescription._id} className="p-4 space-y-3.5 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm">
                            {prescription.customer_id?.name ?? 'Unknown Customer'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ID: {prescription.customer_id?._id?.slice(-6) ?? prescription._id.slice(-6)}
                          </span>
                        </div>
                        {isImage ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                            Paper Scan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#15368A] border border-blue-100 shadow-sm">
                            {prescription.lens_type ?? 'N/A'}
                          </span>
                        )}
                      </div>

                      {/* Diagnostic details */}
                      {isImage ? (
                        prescription.image_url ? (
                          <div
                            onClick={() => setPreviewImage(prescription.image_url)}
                            className="bg-emerald-50/20 hover:bg-emerald-50/40 border border-emerald-100/50 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-98"
                          >
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-emerald-100/60 text-emerald-700 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-xs font-semibold text-slate-700">View Hand-written Scan</span>
                                <span className="text-[10px] text-slate-400">Click to preview the paper draft</span>
                              </div>
                            </div>
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center text-xs text-slate-400 italic">
                            No Scan Image attached
                          </div>
                        )
                      ) : (
                        <div className="grid grid-cols-2 gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100/40 text-xs">
                          {/* Right Eye */}
                          <div className="space-y-1">
                            <p className="font-bold text-slate-700 border-b border-slate-200/60 pb-1">Right (OD)</p>
                            <div className="space-y-0.5 text-slate-600 text-[11px]">
                              <p><span className="text-slate-400">SPH:</span> <span className="font-medium text-slate-700">{prescription.right_sph ?? '—'}</span></p>
                              <p><span className="text-slate-400">CYL:</span> <span className="font-medium text-slate-700">{prescription.right_cyl ?? '—'}</span></p>
                              <p><span className="text-slate-400">AXIS:</span> <span className="font-medium text-slate-700">{prescription.right_axis ?? '—'}</span></p>
                            </div>
                          </div>
                          {/* Left Eye */}
                          <div className="space-y-1">
                            <p className="font-bold text-slate-700 border-b border-slate-200/60 pb-1">Left (OS)</p>
                            <div className="space-y-0.5 text-slate-600 text-[11px]">
                              <p><span className="text-slate-400">SPH:</span> <span className="font-medium text-slate-700">{prescription.left_sph ?? '—'}</span></p>
                              <p><span className="text-slate-400">CYL:</span> <span className="font-medium text-slate-700">{prescription.left_cyl ?? '—'}</span></p>
                              <p><span className="text-slate-400">AXIS:</span> <span className="font-medium text-slate-700">{prescription.left_axis ?? '—'}</span></p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100/60 pt-2.5 mt-1.5">
                        <span className="text-[10px]">
                          Created: {new Date(prescription.created_at).toLocaleDateString('en-GB')}
                        </span>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/optical-service/customers/${prescription.customer_id?._id}`}
                            className="text-xs text-[#15368A] hover:underline font-bold"
                          >
                            View Customer
                          </Link>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(prescription._id)}
                            disabled={isDeleting}
                            className="p-2 h-auto text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg border border-transparent"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm bg-white">
                  No prescriptions found.
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title="Prescription Details — Paper Scan"
        size="lg"
      >
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50/30">
          {previewImage ? (
            <div className="relative w-full flex justify-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm max-h-[60vh] overflow-hidden">
              <img
                src={previewImage}
                alt="Prescription Paper Scan"
                className="max-h-[55vh] object-contain rounded-xl"
              />
            </div>
          ) : (
            <p className="text-slate-400 py-12">No prescription image available.</p>
          )}
          <div className="mt-5 flex items-center justify-end w-full gap-3 border-t border-slate-100 pt-4 bg-white sticky bottom-0">
            {previewImage && (
              <a
                href={previewImage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[#15368A] hover:bg-[#0f286b] text-white text-xs font-semibold transition-all duration-300 shadow-sm"
              >
                Open Original Link
              </a>
            )}
            <Button variant="secondary" onClick={() => setPreviewImage(null)}>
              Close View
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
