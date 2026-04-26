'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { StateTable } from './StateTable';
import { StateModal } from './StateModal';
import { ZoneModal } from './ZoneModal';
import { useConfigurationsPage } from '@/lib/hooks/use-configurations-page';

export function StatesZonesManager() {
  const {
    states,
    loadingStates,
    isStateModalOpen,
    setIsStateModalOpen,
    stateFormData,
    setStateFormData,
    handleOpenStateModal,
    handleStateSubmit,
    handleDeleteState,
    isZoneModalOpen,
    setIsZoneModalOpen,
    zoneFormData,
    setZoneFormData,
    handleOpenZoneModal,
    handleZoneSubmit,
    handleDeleteZone,
    expandedStates,
    toggleStateExpansion,
    zonesByState,
  } = useConfigurationsPage();

  return (
    <>
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Manage States & Zones</h2>
            <Button onClick={() => handleOpenStateModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add State
            </Button>
          </div>

          {loadingStates ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <StateTable
              states={states}
              onEdit={handleOpenStateModal}
              onDelete={handleDeleteState}
              expandedStates={expandedStates}
              onToggleExpand={toggleStateExpansion}
              zonesByState={zonesByState}
              onAddZone={handleOpenZoneModal}
              onEditZone={handleOpenZoneModal}
              onDeleteZone={handleDeleteZone}
            />
          )}
        </CardBody>
      </Card>

      <StateModal
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        onSubmit={handleStateSubmit}
        formData={stateFormData}
        setFormData={setStateFormData}
        isEdit={!!stateFormData._id}
      />

      <ZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        onSubmit={handleZoneSubmit}
        formData={zoneFormData}
        setFormData={setZoneFormData}
        states={states}
        isEdit={!!zoneFormData._id}
      />
    </>
  );
}
