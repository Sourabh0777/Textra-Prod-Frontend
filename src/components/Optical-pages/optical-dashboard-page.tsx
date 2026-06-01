'use client';

import { useState } from 'react';
import { 
  useFetchOpticalCustomersQuery, 
  useCreateOpticalCustomerMutation, 
  useFetchPrescriptionsQuery, 
  useCreatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useDeleteOpticalCustomerMutation
} from '@/lib/api/endpoints/opticalApi';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { 
  Search, Users, FileText, Plus, Phone, User, 
  Sparkles, Star, Camera, Trash2, X, Check, Calendar, ZoomIn 
} from 'lucide-react';

export default function OpticalDashboardPage() {
  // RTK Query hooks
  const { data: customers, isLoading: isCustomersLoading, refetch: refetchCustomers } = useFetchOpticalCustomersQuery();
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateOpticalCustomerMutation();
  const [createPrescription, { isLoading: isSavingPrescription }] = useCreatePrescriptionMutation();
  const [deletePrescription, { isLoading: isDeletingPrescription }] = useDeletePrescriptionMutation();
  const [deleteCustomer, { isLoading: isDeletingCustomer }] = useDeleteOpticalCustomerMutation();

  // Search, selections & modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
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
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useFetchPrescriptionsQuery(activeCustomerId || '', {
    skip: !activeCustomerId
  });

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
        phone_number: newCustPhone.trim()
      }).unwrap();
      
      toast.success('Customer registered successfully!');
      setNewCustName('');
      setNewCustPhone('');
      setShowAddCustomer(false);
      
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
      // Remove any small 8MB size constraints to allow high-resolution base64 snaps up to 50MB
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
        image_base64: imageBase64
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
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Mobile-Friendly Premium Header */}
      <div className="bg-[#15368A] text-white py-6 px-4 sm:px-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-8">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              👓 Optical CRM & Diagnostics
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-0.5 font-medium">
              Simplified command center designed for rapid mobile entry
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Customer Directory (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-4 sm:p-5 border border-slate-100 shadow-sm rounded-2xl bg-white flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-[#15368A]" />
                Customer Directory
              </h2>
              <button
                type="button"
                onClick={() => setShowAddCustomer(!showAddCustomer)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  showAddCustomer 
                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                    : 'bg-blue-50 text-[#15368A] hover:bg-blue-100'
                }`}
              >
                {showAddCustomer ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showAddCustomer ? 'Cancel' : 'New Customer'}
              </button>
            </div>

            {/* Quick Add Customer Panel */}
            {showAddCustomer && (
              <form onSubmit={handleAddCustomer} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Registration</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="custName" className="text-xxs font-bold text-slate-600 uppercase">Customer Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="custName"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-9 h-10.5 rounded-xl border-slate-200 focus-visible:ring-[#15368A] text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="custPhone" className="text-xxs font-bold text-slate-600 uppercase">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="custPhone"
                        type="tel"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        placeholder="9876543210"
                        className="pl-9 h-10.5 rounded-xl border-slate-200 focus-visible:ring-[#15368A] text-sm"
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isCreatingCustomer}
                  className="w-full bg-[#15368A] hover:bg-[#0f286b] h-10 rounded-xl text-xs font-bold shadow-sm"
                >
                  {isCreatingCustomer ? 'Saving...' : 'Register & Select Customer'}
                </Button>
              </form>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or phone..."
                className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#15368A] text-sm"
              />
            </div>

            {/* Customer List */}
            <div className="divide-y divide-slate-100 max-h-[50vh] lg:max-h-[65vh] overflow-y-auto pr-1">
              {isCustomersLoading ? (
                <div className="py-8 flex items-center justify-center"><Loader /></div>
              ) : filteredCustomers && filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust: any) => (
                  <div
                    key={cust._id}
                    onClick={() => setActiveCustomerId(cust._id)}
                    className={`p-3.5 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 my-1 ${
                      activeCustomerId === cust._id 
                        ? 'bg-blue-50/70 border border-blue-100/50 shadow-sm scale-[1.01]' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        activeCustomerId === cust._id ? 'bg-[#15368A] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="font-bold text-slate-800 text-sm truncate">{cust.name}</span>
                        <span className="text-slate-500 text-xxs flex items-center gap-1 mt-0.5 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" /> {cust.phone_number}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomer(cust._id, cust.name)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No customers found matching search.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Active Workspace (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {activeCustomer ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Selected Customer Panel */}
              <Card className="p-4 sm:p-5 border border-slate-100 shadow-sm rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#15368A] to-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                    {activeCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">{activeCustomer.name}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {activeCustomer.phone_number}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCustomerId(null)}
                  className="px-3.5 py-2 rounded-xl text-xxs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-center"
                >
                  Close Profile
                </button>
              </Card>

              {/* Quick Record Prescription Form */}
              <Card className="p-4 sm:p-5 border border-slate-100 shadow-sm rounded-2xl bg-white space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#15368A]" />
                    Quick Log Prescription Pad
                  </h3>
                  <p className="text-slate-400 text-xxs mt-0.5">Snap a photo and assign spectacle type & price category</p>
                </div>

                <form onSubmit={handleSavePrescription} className="space-y-5">
                  {/* Spectacle Type Buttons */}
                  <div className="space-y-2">
                    <Label className="text-xxs font-black text-slate-600 uppercase tracking-wider">Spectacles Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'single', label: 'Single Vision', emoji: '👓' },
                        { key: 'kt', label: 'Bifocal (KT)', emoji: '👓' },
                        { key: 'progressive', label: 'Progressive', emoji: '👓' },
                        { key: 'contact', label: 'Contact Lens', emoji: '👁️' }
                      ].map((type) => (
                        <button
                          key={type.key}
                          type="button"
                          onClick={() => setSpectacleType(type.key as any)}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all duration-200 active:scale-95 ${
                            spectacleType === type.key
                              ? 'border-[#15368A] bg-blue-50/50 text-[#15368A] font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                          }`}
                        >
                          <span className="text-lg">{type.emoji}</span>
                          <span className="text-xxs tracking-tight">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Category Rating */}
                  <div className="space-y-2">
                    <Label className="text-xxs font-black text-slate-600 uppercase tracking-wider">Price Category</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { key: '1 star', stars: 1, text: 'Under 1000' },
                        { key: '2 star', stars: 2, text: '1000 - 2000' },
                        { key: '3 star', stars: 3, text: 'Above 2000' }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setPriceCategory(item.key as any)}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-left transition-all duration-200 active:scale-95 ${
                            priceCategory === item.key
                              ? 'border-[#15368A] bg-blue-50/50 text-[#15368A] font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xxs text-slate-400 font-medium">Category</span>
                            <span className="text-xs truncate font-semibold">{item.text}</span>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
                            {Array.from({ length: item.stars }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prescription Camera Upload Area */}
                  <div className="space-y-2">
                    <Label className="text-xxs font-black text-slate-600 uppercase tracking-wider">Capture Prescription Pad</Label>
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-slate-200 hover:border-[#15368A]/40 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer relative group">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="p-3 bg-white shadow-xs border border-slate-100 rounded-xl mb-2.5 text-slate-400 group-hover:text-[#15368A] transition-colors duration-200">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Tap to Snap Doctor's Prescription Pad</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Launches phone camera directly</p>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/20 flex flex-col items-center justify-center p-3">
                        <img
                          src={imagePreview}
                          alt="Prescription Preview"
                          className="max-h-[220px] object-contain rounded-xl shadow-xs bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageBase64(null);
                          }}
                          className="absolute top-3 right-3 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-1.5 rounded-xl shadow-xs border border-rose-100 text-xxs font-bold active:scale-95 transition-all duration-200"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <Button 
                    type="submit" 
                    disabled={isSavingPrescription || !imagePreview}
                    className="w-full bg-[#15368A] hover:bg-[#0f286b] h-11 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-200"
                  >
                    {isSavingPrescription ? (
                      <span className="flex items-center justify-center gap-1"><Loader /> Logging...</span>
                    ) : 'Save Prescription Log'}
                  </Button>
                </form>
              </Card>

              {/* Prescription Diagnostics Log Timeline */}
              <Card className="p-4 sm:p-5 border border-slate-100 shadow-sm rounded-2xl bg-white space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#15368A]" />
                    Diagnostics & Prescription Log
                  </h3>
                  <p className="text-slate-400 text-xxs mt-0.5">Timeline of all hand-written prescription sheets recorded</p>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {isPrescriptionsLoading ? (
                    <div className="py-8 flex items-center justify-center"><Loader /></div>
                  ) : prescriptions && prescriptions.length > 0 ? (
                    prescriptions.map((pres: any) => {
                      const starsCount = pres.price_category === '3 star' ? 3 : pres.price_category === '2 star' ? 2 : 1;
                      const specLabel = pres.spectacle_type === 'single' ? 'Single Vision' : pres.spectacle_type === 'kt' ? 'Bifocal (KT)' : pres.spectacle_type === 'progressive' ? 'Progressive' : 'Contact Lens';
                      
                      return (
                        <div key={pres._id} className="p-3.5 bg-slate-50 border border-slate-100/60 rounded-2xl flex items-center justify-between gap-4 hover:shadow-xs transition-shadow duration-200">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Clickable Image Thumbnail */}
                            <div 
                              onClick={() => setPreviewModalImage(pres.image_url)}
                              className="w-14 h-14 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs cursor-pointer relative group flex items-center justify-center shrink-0"
                            >
                              <img
                                src={pres.image_url}
                                alt="Prescription Pad"
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                                <ZoomIn className="w-4 h-4" />
                              </div>
                            </div>

                            <div className="min-w-0 flex flex-col">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#15368A]/10 text-[#15368A]">
                                  {specLabel}
                                </span>
                                <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                                  {Array.from({ length: starsCount }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <span className="text-slate-400 text-xxs flex items-center gap-1 mt-1 font-medium">
                                <Calendar className="w-3 h-3 text-slate-300" /> 
                                {new Date(pres.created_at).toLocaleDateString('en-IN', {
                                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeletePrescription(pres._id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                            title="Delete Prescription Log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs bg-slate-50/50 border border-slate-100 border-dashed rounded-2xl">
                      No prescriptions logged for this customer.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 border border-slate-100 border-dashed rounded-2xl bg-white text-center flex flex-col items-center justify-center min-h-[50vh]">
              <div className="p-4 bg-blue-50 text-[#15368A] rounded-2xl mb-4 shadow-xs">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Select a Customer Profile</h3>
              <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
                Search the directory or register a new customer above to view their diagnostic profile, upload doctor prescription pad snaps, and view checkup records.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* FULLSCREEN IMAGE PREVIEW MODAL */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300"
          onClick={() => setPreviewModalImage(null)}
        >
          <div 
            className="bg-white border border-slate-100 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Prescription Pad Viewer</span>
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[300px]">
              <img
                src={previewModalImage}
                alt="Prescription Pad Fullscreen"
                className="max-h-[70vh] object-contain rounded-xl shadow-xs bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
