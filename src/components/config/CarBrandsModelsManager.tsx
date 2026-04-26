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
  const [isExpanded, setIsExpanded] = React.useState(false);
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
      <Card
        className={`${!isExpanded ? 'bg-neutral-50/50 border-dashed transition-all hover:bg-neutral-50' : 'transition-all'}`}
      >
        <CardBody>
          <div className={`flex justify-between items-center ${isExpanded ? 'mb-6' : ''}`}>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Manage Car Brands & Models</h2>
              {!isExpanded && (
                <p className="text-sm text-neutral-500 mt-1">
                  Configure the list of car brands and models available in the system.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {isExpanded ? (
                <>
                  <Button onClick={() => handleOpenBrandModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Brand
                  </Button>
                  <Button variant="ghost" onClick={() => setIsExpanded(false)}>
                    Hide
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={() => setIsExpanded(true)}>
                  Manage Brands
                </Button>
              )}
            </div>
          </div>

          {isExpanded &&
            (loadingBrands ? (
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
            ))}
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
