'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useQRCodesPage } from '@/lib/hooks/use-qr-codes-page';
import { QRCodeTable } from '@/components/qr-codes/qr-code-table';
import { QRCodeModal } from '@/components/qr-codes/qr-code-modal';
import { AssignQRCodeModal } from '@/components/qr-codes/assign-qr-modal';

export default function QRCodesPage() {
  const {
    filteredQRCodes,
    loading,
    isSubmitting,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    errors,
    searchQuery,
    setSearchQuery,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
    isAssignModalOpen,
    setIsAssignModalOpen,
    assigningQR,
    isAssigning,
    handleAssign,
    handleOpenAssignModal,
  } = useQRCodesPage();

  if (loading) {
    return (
      <>
        <Header title="QR Codes" subtitle="Manage system-level QR codes" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="QR Codes" subtitle="Manage system-level QR codes" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading QR codes. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="QR Codes" subtitle="Manage system-level QR codes" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">QR Codes</h2>
              <span className="text-sm text-neutral-500 font-medium">({filteredQRCodes.length})</span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search code, message, id..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>+ Create QR Code</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <QRCodeTable
              qrCodes={filteredQRCodes}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onConnect={handleOpenAssignModal}
            />
          </CardBody>
        </Card>
      </div>

      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        submitting={isSubmitting}
        onInputChange={handleChange}
        onSubmit={handleSubmit}
      />

      <AssignQRCodeModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        qrCode={assigningQR}
        onAssign={handleAssign}
        isAssigning={isAssigning}
      />
    </>
  );
}
