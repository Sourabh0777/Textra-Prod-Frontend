/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useServicesPage } from '@/lib/hooks/use-services-page';
import { ServiceTable } from '@/components/services/service-table';
import { ServiceModal } from '@/components/services/service-modal';

export default function ServicesPage() {
  const {
    services,
    filteredServices,
    vehicles,
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
  } = useServicesPage();

  if (loading) {
    return (
      <>
        <Header title="Services" subtitle="Track vehicle services" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Services" subtitle="Track vehicle services" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading services. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Services" subtitle="Track vehicle services" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Services</h2>
              <span className="text-sm text-neutral-500 font-medium">
                ({filteredServices.length}
                {filteredServices.length !== services.length ? ` of ${services.length}` : ''})
              </span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search registration, owner, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-auto">
            <Button className="flex-1 md:flex-none" onClick={() => handleOpenModal()}>
              + New Service
            </Button>
          </div>
        </div>

        <Card>
          <CardBody className="!p-0">
            <ServiceTable services={filteredServices} onEdit={handleOpenModal} onDelete={handleDelete} />
          </CardBody>
        </Card>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        vehicles={vehicles}
        submitting={isSubmitting}
        onFormDataChange={setFormData}
        onInputChange={handleChange}
        onVehicleChange={(val) => {
          setFormData((prev) => ({ ...prev, vehicle_id: val as any }));
          if (errors.vehicle_id) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.vehicle_id;
              return next;
            });
          }
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
