/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useBusinessesPage } from '@/lib/hooks/use-businesses-page';
import { BusinessTable } from '@/components/business/business-table';
import { BusinessDetailsModal } from '@/components/business/business-details-modal';
import { WhatsAppConnectionModal } from '@/components/business/whatsapp-connection-modal';

export default function BusinessesPage() {
  const {
    filteredBusinesses,
    businessTypes,
    loading,
    isSubmitting,
    fetchError,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    isEditMode,
    formData,
    errors,
    searchQuery,
    setSearchQuery,
    states,
    zones,
    handleOpenDetailsModal,
    handleOpenWhatsAppModal,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useBusinessesPage();

  if (loading) {
    return (
      <>
        <Header title="Businesses" subtitle="Manage your business locations" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Businesses" subtitle="Manage your business locations" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading businesses. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Businesses" subtitle="Manage your business locations" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Businesses</h2>
              <span className="text-sm text-neutral-500 font-medium">({filteredBusinesses.length})</span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search name, owner, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenDetailsModal()}>+ Add Business</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <BusinessTable
              businesses={filteredBusinesses}
              onEditDetails={handleOpenDetailsModal}
              onEditWhatsApp={handleOpenWhatsAppModal}
              onDelete={handleDelete}
            />
          </CardBody>
        </Card>
      </div>

      <BusinessDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        businessTypes={businessTypes}
        states={states}
        zones={zones}
        submitting={isSubmitting}
        onInputChange={handleChange}
        onSubmit={(e) => handleSubmit(e, 'details')}
      />

      <WhatsAppConnectionModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        formData={formData}
        errors={errors}
        submitting={isSubmitting}
        onInputChange={handleChange}
        onSubmit={(e) => handleSubmit(e, 'whatsapp')}
      />
    </>
  );
}
