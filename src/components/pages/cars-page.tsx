/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useCarsPage } from '@/lib/hooks/use-cars-page';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { CarModal } from '@/components/vehicles/car-modal';

export default function CarsPage() {
  const {
    vehicles,
    customers,
    loading,
    isSubmitting,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    setFormData,
    errors,
    setErrors,
    searchQuery,
    setSearchQuery,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useCarsPage();

  if (loading) {
    return (
      <>
        <Header title="Cars" subtitle="Manage all cars" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Cars" subtitle="Manage all cars" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading cars. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Cars" subtitle="Manage all cars" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Cars</h2>
              <span className="text-sm text-neutral-500 font-medium">({vehicles.length})</span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search customer, registration, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>+ Add Car</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <VehicleTable vehicles={vehicles} onEdit={handleOpenModal} onDelete={handleDelete} />
          </CardBody>
        </Card>
      </div>

      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        customers={customers}
        submitting={isSubmitting}
        onFormDataChange={setFormData}
        onInputChange={handleChange}
        onCustomerChange={(val) => {
          setFormData((prev) => ({ ...prev, customer_id: val as any }));
          if (errors.customer_id) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.customer_id;
              return next;
            });
          }
        }}
        onBrandChange={(val) => {
          setFormData((prev) => ({ ...prev, brand: val }));
          if (errors.brand) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.brand;
              return next;
            });
          }
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
