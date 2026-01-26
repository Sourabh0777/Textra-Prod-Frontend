/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useBusinessTypesPage } from '@/lib/hooks/use-business-types-page';
import { BusinessTypeTable } from '@/components/business/business-type-table';
import { BusinessTypeModal } from '@/components/business/business-type-modal';

export default function BusinessTypesPage() {
  const {
    businessTypes,
    loading,
    isSubmitting,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    errors,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useBusinessTypesPage();

  if (loading) {
    return (
      <>
        <Header title="Business Types" subtitle="Manage categories for your businesses" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Business Types" subtitle="Manage categories for your businesses" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading business types. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Business Types" subtitle="Manage categories for your businesses" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Business Types</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Business Type</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <BusinessTypeTable businessTypes={businessTypes} onEdit={handleOpenModal} onDelete={handleDelete} />
          </CardBody>
        </Card>
      </div>

      <BusinessTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        submitting={isSubmitting}
        onInputChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
