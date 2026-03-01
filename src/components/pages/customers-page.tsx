/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useCustomersPage } from '@/lib/hooks/use-customers-page';
import { CustomerTable } from '@/components/customers/customer-table';
import { CustomerModal } from '@/components/customers/customer-modal';

export default function CustomersPage() {
  const {
    filteredCustomers,
    businesses,
    loading,
    isSubmitting,
    customersError,
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
  } = useCustomersPage();

  if (loading) {
    return (
      <>
        <Header title="Customers" subtitle="Manage your customer base" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (customersError) {
    return (
      <>
        <Header title="Customers" subtitle="Manage your customer base" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading customers. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Customers" subtitle="Manage your customer base" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Customers</h2>
              <span className="text-sm text-neutral-500 font-medium">({filteredCustomers.length})</span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>+ Add Customer</Button>
        </div>

        <Card>
          <CardBody className="!p-0">
            <CustomerTable customers={filteredCustomers} onEdit={handleOpenModal} onDelete={handleDelete} />
          </CardBody>
        </Card>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        businesses={businesses}
        submitting={isSubmitting}
        onInputChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
