'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StateTable } from '@/components/config/StateTable';
import { ZoneTable } from '@/components/config/ZoneTable';
import { StateModal } from '@/components/config/StateModal';
import { ZoneModal } from '@/components/config/ZoneModal';
import { useConfigurationsPage } from '@/lib/hooks/use-configurations-page';
import { Plus } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

type TabType = 'states' | 'zones';

export function ConfigurationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('states');
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
  } = useConfigurationsPage();

  return (
    <>
      <Header title="Project Configurations" subtitle="Manage states and zones for business categorization" />

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'states'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('states')}
          >
            States
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'zones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('zones')}
          >
            Zones
          </button>
        </div>

        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                {activeTab === 'states' ? 'Manage States' : 'Manage Zones'}
              </h2>
              <Button onClick={() => (activeTab === 'states' ? handleOpenStateModal() : handleOpenZoneModal())}>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab === 'states' ? 'State' : 'Zone'}
              </Button>
            </div>

            {activeTab === 'states' ? (
              loadingStates ? (
                <div className="flex justify-center py-12">
                  <Loader />
                </div>
              ) : (
                <StateTable states={states} onEdit={handleOpenStateModal} onDelete={handleDeleteState} />
              )
            ) : loadingZones ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : (
              <ZoneTable zones={zones} onEdit={handleOpenZoneModal} onDelete={handleDeleteZone} />
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
