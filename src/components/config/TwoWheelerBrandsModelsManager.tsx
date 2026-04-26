'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { TwoWheelerBrandTable } from './TwoWheelerBrandTable';
import { TwoWheelerBrandModal } from './TwoWheelerBrandModal';
import { TwoWheelerModelModal } from './TwoWheelerModelModal';
import { useTwoWheelerBrandsConfig } from '@/lib/hooks/use-two-wheeler-brands-config';

export function TwoWheelerBrandsModelsManager() {
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
  } = useTwoWheelerBrandsConfig();

  return (
    <>
      <Card
        className={`${!isExpanded ? 'bg-neutral-50/50 border-dashed transition-all hover:bg-neutral-50' : 'transition-all'}`}
      >
        <CardBody>
          <div className={`flex justify-between items-center ${isExpanded ? 'mb-6' : ''}`}>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Manage Two-Wheeler Brands & Models</h2>
              {!isExpanded && (
                <p className="text-sm text-neutral-500 mt-1">
                  Configure the list of bike and scooter brands and models.
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
                  Manage Two-Wheelers
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
              <TwoWheelerBrandTable
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

      <TwoWheelerBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSubmit={handleBrandSubmit}
        formData={brandFormData}
        setFormData={setBrandFormData}
        isEdit={!!editingBrand}
      />

      <TwoWheelerModelModal
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
