'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StateTable } from '@/components/config/StateTable';
import { StateModal } from '@/components/config/StateModal';
import { ZoneModal } from '@/components/config/ZoneModal';
import { useConfigurationsPage } from '@/lib/hooks/use-configurations-page';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

export function ConfigurationsPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  const {
    states,
    loadingStates,
    zones,
    loadingZones,
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

  if (!hasHydrated) {
    return (
      <>
        <Header title="Project Configurations" subtitle="Manage states and zones for business categorization" />
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
          <Card>
            <CardBody>
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Project Configurations" subtitle="Manage states and zones for business categorization" />

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
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
      </div>

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
