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

import { RefreshCw } from 'lucide-react';

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
    refetchCustomers,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useCustomersPage();

  const [isRefetching, setIsRefetching] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetchCustomers();
    setTimeout(() => setIsRefetching(false), 500);
  };

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
              <Button onClick={() => refetchCustomers()} className="mt-4">
                Retry
              </Button>
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
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="secondary" onClick={handleRefresh} disabled={isRefetching} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => handleOpenModal()} className="flex-1 md:flex-none">
              + Add Customer
            </Button>
          </div>
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
