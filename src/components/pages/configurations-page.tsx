'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { StatesZonesManager } from '@/components/config/StatesZonesManager';
import { CarBrandsModelsManager } from '@/components/config/CarBrandsModelsManager';

export function ConfigurationsPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return (
      <>
        <Header title="Project Configurations" subtitle="Manage project settings and data" />
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
      <Header title="Project Configurations" subtitle="Manage project settings and data" />

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <StatesZonesManager />
        <CarBrandsModelsManager />
      </div>
    </>
  );
}
