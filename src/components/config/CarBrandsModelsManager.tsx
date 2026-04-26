'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { CarBrandTable } from './CarBrandTable';
import { CarBrandModal } from './CarBrandModal';
import { CarModelModal } from './CarModelModal';
import { useCarBrandsConfig } from '@/lib/hooks/use-car-brands-config';

export function CarBrandsModelsManager() {
  const {
    brands,
    loadingBrands,
    editingBrand,
    editingModel,
    isBrandModalOpen,
    setIsBrandModalOpen,
    brandFormData,
    setBrandFormData,
    handleOpenBrandModal,
    handleBrandSubmit,
    handleDeleteBrand,
    isModelModalOpen,
    setIsModelModalOpen,
    modelFormData,
    setModelFormData,
    handleOpenModelModal,
    handleModelSubmit,
    handleDeleteModel,
    expandedBrands,
    toggleBrandExpansion,
  } = useCarBrandsConfig();

  return (
    <>
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Manage Car Brands & Models</h2>
            <Button onClick={() => handleOpenBrandModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </div>

          {loadingBrands ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <CarBrandTable
              brands={brands}
              onEdit={handleOpenBrandModal}
              onDelete={handleDeleteBrand}
              expandedBrands={expandedBrands}
              onToggleExpand={toggleBrandExpansion}
              onAddModel={handleOpenModelModal}
              onEditModel={handleOpenModelModal}
              onDeleteModel={handleDeleteModel}
            />
          )}
        </CardBody>
      </Card>

      <CarBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSubmit={handleBrandSubmit}
        formData={brandFormData}
        setFormData={setBrandFormData}
        isEdit={!!editingBrand}
      />

      <CarModelModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        onSubmit={handleModelSubmit}
        formData={modelFormData}
        setFormData={setModelFormData}
        isEdit={!!editingModel}
      />
    </>
  );
}
