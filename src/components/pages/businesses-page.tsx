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
import { BusinessModal } from '@/components/business/business-modal';

export default function BusinessesPage() {
  const {
    filteredBusinesses,
    businessTypes,
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

  console.log('🚀 ~ BusinessesPage ~ filteredBusinesses:', filteredBusinesses);
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
          <Button onClick={() => handleOpenModal()}>+ Add Business</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <BusinessTable businesses={filteredBusinesses} onEdit={handleOpenModal} onDelete={handleDelete} />
          </CardBody>
        </Card>
      </div>

      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        businessTypes={businessTypes}
        submitting={isSubmitting}
        onInputChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
