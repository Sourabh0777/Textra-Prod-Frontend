'use client';

import { useState } from 'react';
import {
  useFetchOpticalCustomersQuery,
  useCreateOpticalCustomerMutation,
  useFetchPrescriptionsQuery,
  useCreatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useDeleteOpticalCustomerMutation,
} from '@/lib/api/endpoints/opticals/opticalApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { Search, Trash2, X, Camera } from 'lucide-react';

export default function OpticalDashboardPage() {
  // RTK Query hooks
  const { data: customers, isLoading: isCustomersLoading } = useFetchOpticalCustomersQuery();
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateOpticalCustomerMutation();
  const [createPrescription, { isLoading: isSavingPrescription }] = useCreatePrescriptionMutation();
  const [deletePrescription, { isLoading: isDeletingPrescription }] = useDeletePrescriptionMutation();
  const [deleteCustomer, { isLoading: isDeletingCustomer }] = useDeleteOpticalCustomerMutation();

  // Search, selections & modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // New customer form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // New prescription form state
  const [spectacleType, setSpectacleType] = useState<'single' | 'kt' | 'progressive' | 'contact'>('single');
  const [priceCategory, setPriceCategory] = useState<'1 star' | '2 star' | '3 star'>('1 star');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Fetch prescriptions for active customer if selected
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useFetchPrescriptionsQuery(
    activeCustomerId || '',
    {
      skip: !activeCustomerId,
    },
  );

  const activeCustomer = customers?.find((c: any) => c._id === activeCustomerId);

  // Handle live search matching
  const filteredCustomers = customers?.filter((c: any) => {
    const term = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(term) || (c.phone_number && c.phone_number.includes(term));
  });

  // Handle registration of new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      toast.error('Please enter customer name.');
      return;
    }
    if (!newCustPhone.trim()) {
      toast.error('Please enter phone number.');
      return;
    }

    try {
      const result = await createCustomer({
        name: newCustName.trim(),
        phone_number: newCustPhone.trim(),
      }).unwrap();

      toast.success('Customer registered successfully!');
      setNewCustName('');
      setNewCustPhone('');

      // Auto-select the newly created customer
      if (result?._id) {
        setActiveCustomerId(result._id);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to register customer.');
    }
  };

  // Convert uploaded image to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Image size must be less than 50MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new prescription pad
  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomerId) {
      toast.error('Please select a customer first.');
      return;
    }
    if (!imageBase64) {
      toast.error('Please capture/upload the prescription pad photo.');
      return;
    }

    try {
      await createPrescription({
        customer_id: activeCustomerId,
        spectacle_type: spectacleType,
        price_category: priceCategory,
        image_base64: imageBase64,
      }).unwrap();

      toast.success('Prescription pad logged successfully!');
      // Reset form states
      setImagePreview(null);
      setImageBase64(null);
      setSpectacleType('single');
      setPriceCategory('1 star');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to record prescription.');
    }
  };

  // Delete a customer
  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"? This will soft delete all their records.`)) {
      return;
    }
    try {
      await deleteCustomer(id).unwrap();
      toast.success('Customer profile deleted.');
      if (activeCustomerId === id) {
        setActiveCustomerId(null);
      }
    } catch (err: any) {
      toast.error('Failed to delete customer.');
    }
  };

  // Delete a logged prescription
  const handleDeletePrescription = async (presId: string) => {
    if (!confirm('Are you sure you want to delete this prescription log?')) {
      return;
    }
    try {
      await deletePrescription(presId).unwrap();
      toast.success('Prescription log deleted.');
    } catch (err: any) {
      toast.error('Failed to delete prescription log.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-4">
      {/* High Density Top Header Bar */}
      <div className="bg-[#15368A] text-white py-2 px-3 shadow-sm flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-tight">👓 Optical Diagnostics</span>
          <span className="bg-blue-600 text-[8px] font-bold px-1 py-0.2 rounded-sm text-blue-100 tracking-wider">
            POS MOBILE
          </span>
        </div>
        {activeCustomer && (
          <button
            type="button"
            onClick={() => setActiveCustomerId(null)}
            className="text-[9.5px] font-bold bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded transition-colors"
          >
            ← Back to Directory
          </button>
        )}
      </div>

      <div className="max-w-xl mx-auto p-1.5 space-y-1.5">
        {/* DIRECTORY VIEW: Visible only when no customer is selected */}
        {!activeCustomer ? (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {/* Search & Add Inline Box */}
            <div className="bg-white border border-slate-100 p-2 rounded-lg flex flex-col gap-1.5 shadow-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or phone..."
                  className="pl-8 h-7.5 text-xs rounded-md border-slate-200 focus-visible:ring-[#15368A]"
                />
              </div>

              <div className="border-t border-slate-100 pt-1.5">
                <form onSubmit={handleAddCustomer} className="flex gap-1 items-center">
                  <Input
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="New Customer Name"
                    className="h-7.5 text-xs rounded-md border-slate-200 focus-visible:ring-[#15368A] flex-1 px-2"
                  />
                  <Input
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="Phone"
                    type="tel"
                    className="h-7.5 text-xs rounded-md border-slate-200 focus-visible:ring-[#15368A] w-24 px-2"
                  />
                  <Button
                    type="submit"
                    disabled={isCreatingCustomer}
                    className="bg-[#15368A] hover:bg-[#0f286b] h-7.5 px-2.5 rounded-md text-[10px] font-bold shrink-0"
                  >
                    {isCreatingCustomer ? '...' : '+ Add'}
                  </Button>
                </form>
              </div>
            </div>

            {/* High Density Customer List */}
            <div className="bg-white border border-slate-100 rounded-lg p-1 shadow-sm max-h-[78vh] overflow-y-auto divide-y divide-slate-50">
              {isCustomersLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader />
                </div>
              ) : filteredCustomers && filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust: any) => (
                  <div
                    key={cust._id}
                    onClick={() => setActiveCustomerId(cust._id)}
                    className="p-2.5 rounded-md flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="min-w-0 flex items-baseline gap-1.5">
                      <span className="font-extrabold text-slate-800 text-[12px] truncate">{cust.name}</span>
                      <span className="text-slate-400 text-[10.5px] truncate">({cust.phone_number})</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomer(cust._id, cust.name);
                      }}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-md shrink-0 transition-colors"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-[11px] font-bold">
                  No customers found. Register above!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* WORKSPACE VIEW: Visible only when customer is selected */
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {/* Extremely compact Selected Customer Row */}
            <div className="bg-white border border-slate-100 p-1.5 px-2 rounded-lg flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 bg-blue-100 text-[#15368A] rounded-md flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {activeCustomer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-800 text-[12px] truncate leading-tight">
                    {activeCustomer.name}
                  </div>
                  <div className="text-slate-500 text-[10.5px] font-medium leading-tight">
                    {activeCustomer.phone_number}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCustomerId(null)}
                className="text-[9.5px] font-bold text-[#15368A] bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md shrink-0 transition-colors"
              >
                Change Customer
              </button>
            </div>

            {/* Quick Log Prescription Form */}
            <Card className="p-2 border border-slate-100 shadow-sm rounded-lg bg-white space-y-2">
              <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                <span className="font-extrabold text-[9px] text-slate-400 uppercase tracking-wider">
                  Log Prescription Details
                </span>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded-sm">
                  Step 2 of 2
                </span>
              </div>

              <form onSubmit={handleSavePrescription} className="space-y-2">
                {/* Spectacle Type Buttons */}
                <div className="space-y-0.5">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    Spectacles Type
                  </Label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { key: 'single', label: 'Single' },
                      { key: 'kt', label: 'Bifocal' },
                      { key: 'progressive', label: 'Progr.' },
                      { key: 'contact', label: 'Contact' },
                    ].map((type) => (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => setSpectacleType(type.key as any)}
                        className={`py-1 px-0.5 rounded text-[10.5px] border flex items-center justify-center font-bold text-center transition-all ${
                          spectacleType === type.key
                            ? 'border-[#15368A] bg-blue-50 text-[#15368A] font-black shadow-xxs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Category Star Selection */}
                <div className="space-y-0.5">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    Price Category
                  </Label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: '1 star', stars: 1, label: '< ₹1k' },
                      { key: '2 star', stars: 2, label: '₹1k-2k' },
                      { key: '3 star', stars: 3, label: '> ₹2k' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setPriceCategory(item.key as any)}
                        className={`py-1 px-1 rounded text-[10.5px] border flex items-center justify-between transition-all ${
                          priceCategory === item.key
                            ? 'border-[#15368A] bg-blue-50 text-[#15368A] font-black shadow-xxs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="flex text-amber-500 shrink-0 select-none">
                          {Array.from({ length: item.stars }).map((_, i) => (
                            <span key={i} className="text-[9px]">
                              ★
                            </span>
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload / Camera Row */}
                <div className="space-y-0.5">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    Upload Pad Photo (Mandatory)
                  </Label>
                  <div className="flex gap-1.5 items-center">
                    {!imagePreview ? (
                      <div className="relative border border-dashed border-slate-200 hover:border-[#15368A]/40 rounded-md p-2 flex items-center justify-center bg-slate-50 flex-1 h-9.5 cursor-pointer transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Camera className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-600">Snap Doctors Pad</span>
                      </div>
                    ) : (
                      <div className="relative rounded-md border border-slate-100 bg-slate-50 flex items-center justify-between p-1 flex-1 h-9.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-7.5 w-7.5 object-cover rounded border bg-white cursor-pointer"
                            onClick={() => setPreviewModalImage(imagePreview)}
                          />
                          <span className="text-[9.5px] font-bold text-emerald-600 truncate">Photo Captured</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageBase64(null);
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded border border-rose-100 text-[9px] font-bold transition-all shrink-0"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  disabled={isSavingPrescription || !imagePreview}
                  className="w-full bg-[#15368A] hover:bg-[#0f286b] h-8 rounded-md text-[11px] font-bold shadow-xs disabled:bg-slate-100 disabled:text-slate-400 mt-1 transition-all"
                >
                  {isSavingPrescription ? (
                    <span className="flex items-center justify-center gap-1">Saving Pad Log...</span>
                  ) : (
                    'Save Prescription Pad Log'
                  )}
                </Button>
              </form>
            </Card>

            {/* Diagnostic Logs timeline */}
            <Card className="p-2 border border-slate-100 shadow-sm rounded-lg bg-white space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                <span className="font-extrabold text-[9px] text-slate-400 uppercase tracking-wider">
                  Diagnostic History
                </span>
                <span className="text-[9.5px] font-bold text-[#15368A] bg-blue-50 px-1 rounded-sm">
                  {prescriptions?.length || 0} Logs
                </span>
              </div>

              <div className="space-y-1 max-h-[38vh] overflow-y-auto divide-y divide-slate-50">
                {isPrescriptionsLoading ? (
                  <div className="py-6 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : prescriptions && prescriptions.length > 0 ? (
                  prescriptions.map((pres: any) => {
                    const starsCount = pres.price_category === '3 star' ? 3 : pres.price_category === '2 star' ? 2 : 1;
                    const specLabel =
                      pres.spectacle_type === 'single'
                        ? 'Single'
                        : pres.spectacle_type === 'kt'
                          ? 'Bifocal'
                          : pres.spectacle_type === 'progressive'
                            ? 'Progressive'
                            : 'Contact';

                    return (
                      <div
                        key={pres._id}
                        className="py-1 flex items-center justify-between gap-2 hover:bg-slate-50 rounded transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Thumbnail */}
                          <div
                            onClick={() => setPreviewModalImage(pres.image_url)}
                            className="w-7 h-9 bg-white border border-slate-200 rounded overflow-hidden shadow-xxs cursor-pointer relative flex items-center justify-center shrink-0"
                          >
                            <img src={pres.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0 flex flex-col">
                            <div className="flex items-center gap-1 flex-wrap leading-none">
                              <span className="text-[9.5px] font-extrabold text-[#15368A] bg-blue-50 px-1 rounded-sm leading-none py-0.5">
                                {specLabel}
                              </span>
                              <span className="text-amber-500 leading-none text-[9.5px] tracking-tighter shrink-0 select-none">
                                {Array.from({ length: starsCount }).map((_, i) => '★')}
                              </span>
                            </div>
                            <span className="text-slate-400 text-[8.5px] leading-tight mt-0.5">
                              {new Date(pres.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeletePrescription(pres._id)}
                          className="p-1 text-slate-300 hover:text-rose-500 rounded shrink-0 transition-colors"
                          title="Delete Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-400 text-[10.5px] font-medium border border-dashed border-slate-100 rounded-md bg-slate-50/50">
                    No prescription history. Log the first above!
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE PREVIEW MODAL */}
      {previewModalImage && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 z-[9999] animate-in fade-in duration-200"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="bg-white border border-slate-100 max-w-sm w-full rounded-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 border-b border-slate-50 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 text-[11px]">Prescription Sheet Viewer</span>
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2 bg-slate-100 flex items-center justify-center min-h-[250px]">
              <img
                src={previewModalImage}
                alt="Prescription Sheet"
                className="max-h-[60vh] object-contain rounded shadow bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
