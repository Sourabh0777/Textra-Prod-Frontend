'use client';

import { useState } from 'react';
import { useFetchOpticalCustomerQuery, useFetchPrescriptionsQuery } from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Phone, Mail, Calendar, User, PlusCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface OpticalCustomerDetailsPageProps {
  customerId: string;
}

export default function OpticalCustomerDetailsPage({ customerId }: OpticalCustomerDetailsPageProps) {
  const { data: customer, isLoading: loadingCustomer } = useFetchOpticalCustomerQuery(customerId);
  const { data: prescriptions, isLoading: loadingPrescriptions } = useFetchPrescriptionsQuery(customerId);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
                  <th className="px-6 py-3 text-right font-bold text-slate-600">Actions</th>
                </TableRow>
              </thead>
              <TableBody>
                {prescriptions && prescriptions.length > 0 ? (
                  prescriptions.map((item: any) => {
                    const isImage = item.prescription_type === 'image';
                    return (
                      <TableRow key={item._id} className="hover:bg-slate-50/30 transition-colors">
                        <TableCell className="font-semibold text-slate-700">
                          {isImage ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                              Paper Prescription
                            </span>
                          ) : (
                            item.lens_type || 'N/A'
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600 text-xs">
                          {isImage ? (
                            <span className="text-slate-400 italic">See Attached Photo</span>
                          ) : (
                            `${item.right_sph ?? '-'} / ${item.right_cyl ?? '-'} / ${item.right_axis ?? '-'}`
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600 text-xs">
                          {isImage ? (
                            <span className="text-slate-400 italic">See Attached Photo</span>
                          ) : (
                            `${item.left_sph ?? '-'} / ${item.left_cyl ?? '-'} / ${item.left_axis ?? '-'}`
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {new Date(item.created_at).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell className="text-right">
                          {isImage && item.image_url ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setPreviewImage(item.image_url)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Photo
                            </Button>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No eye examination records stored for this customer yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
