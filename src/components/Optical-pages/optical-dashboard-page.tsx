'use client';

import { useOpticalDashboard } from '@/lib/hooks/use-optical-dashboard';
import { OpticalHeader } from './optical-header';
import { CustomerDirectory } from './customer-directory';
import { ActiveCustomerHeader } from './active-customer-header';
import { PrescriptionForm } from './prescription-form';
import { DiagnosticsTimeline } from './diagnostics-timeline';
import { ImagePreviewModal } from './image-preview-modal';

export default function OpticalDashboardPage() {
  const {
    isCustomersLoading,
    setActiveCustomerId,
    previewModalImage,
    setPreviewModalImage,
    searchQuery,
    setSearchQuery,
    newCustName,
    setNewCustName,
    newCustPhone,
    setNewCustPhone,
    spectacleType,
    setSpectacleType,
    priceCategory,
    setPriceCategory,
    imagePreview,
    setImagePreview,
    setImageBase64,
    prescriptions,
    isPrescriptionsLoading,
    activeCustomer,
    filteredCustomers,
    isCreatingCustomer,
    isSavingPrescription,
    handleAddCustomer,
    handleFileChange,
    handleSavePrescription,
    handleDeleteCustomer,
    handleDeletePrescription,
  } = useOpticalDashboard();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-4">
      {/* Dynamic Header */}
      <OpticalHeader
        hasActiveCustomer={!!activeCustomer}
        onBack={() => setActiveCustomerId(null)}
      />

      <div className="max-w-xl mx-auto p-1.5 space-y-1.5">
        {/* DIRECTORY VIEW: No Customer selected */}
        {!activeCustomer ? (
          <CustomerDirectory
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            newCustName={newCustName}
            setNewCustName={setNewCustName}
            newCustPhone={newCustPhone}
            setNewCustPhone={setNewCustPhone}
            isCreatingCustomer={isCreatingCustomer}
            handleAddCustomer={handleAddCustomer}
            isCustomersLoading={isCustomersLoading}
            filteredCustomers={filteredCustomers || []}
            setActiveCustomerId={setActiveCustomerId}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        ) : (
          /* WORKSPACE VIEW: Active Customer details & forms */
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {/* Customer Details Row */}
            <ActiveCustomerHeader
              name={activeCustomer.name}
              phoneNumber={activeCustomer.phone_number}
              onClear={() => setActiveCustomerId(null)}
            />

            {/* Diagnostic Details Log Form */}
            <PrescriptionForm
              spectacleType={spectacleType}
              setSpectacleType={setSpectacleType}
              priceCategory={priceCategory}
              setPriceCategory={setPriceCategory}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              setImageBase64={setImageBase64}
              isSavingPrescription={isSavingPrescription}
              handleFileChange={handleFileChange}
              handleSavePrescription={handleSavePrescription}
              setPreviewModalImage={setPreviewModalImage}
            />

            {/* History Logs Timeline */}
            <DiagnosticsTimeline
              isPrescriptionsLoading={isPrescriptionsLoading}
              prescriptions={prescriptions}
              setPreviewModalImage={setPreviewModalImage}
              handleDeletePrescription={handleDeletePrescription}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Overlay Viewer */}
      <ImagePreviewModal
        previewModalImage={previewModalImage}
        onClose={() => setPreviewModalImage(null)}
      />
    </div>
  );
}
