/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useBusinessProfile } from '@/lib/hooks/use-business-profile';
import { BusinessProfileForm } from '@/components/business/business-profile-form';

const BusinessPage = () => {
  const { formData, businessTypes, states, zones, loading, saving, error, errors, handleChange, handleSave } =
    useBusinessProfile();

  /** Loading state */
  if (loading) {
    return (
      <>
        <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />
        <div className="p-4 md:p-8 max-w-4xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  /** Error state */
  if (error) {
    return (
      <>
        <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading business details. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Business Profile" subtitle="Manage your business information & WhatsApp setup" />

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <BusinessProfileForm
          formData={formData}
          errors={errors}
          businessTypes={businessTypes}
          states={states}
          zones={zones}
          saving={saving}
          onInputChange={handleChange}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default BusinessPage;
