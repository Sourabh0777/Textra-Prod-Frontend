/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useBusinessProfile } from '@/lib/hooks/use-business-profile';
import { BusinessProfileForm } from '@/components/business/business-profile-form';
import { useCurrentUser } from '@/lib/hooks/useFetchUserData';
import { MessageSquare, ShieldCheck, Calendar } from 'lucide-react';

const BusinessPage = () => {
  const {
    formData,
    businessTypes,
    states,
    zones,
    loading,
    saving,
    wabaSaving,
    error,
    errors,
    handleChange,
    handleSave,
    handleWabaSave,
  } = useBusinessProfile();
  const { user } = useCurrentUser();

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

      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        {/* Message Usage & Limits Stats card */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-emerald-900">Message Usage & Limits</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Monthly Limit</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">
                {(user?.business_id as any)?.monthly_message_limit?.toLocaleString() || '0'}
              </p>
            </div>

            <div className="space-y-1 sm:border-l sm:pl-6 border-neutral-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Messages Sent</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">
                {(user?.business_id as any)?.current_month_message_count?.toLocaleString() || '0'}
              </p>
            </div>

            <div className="space-y-1 sm:border-l sm:pl-6 border-neutral-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Last Reset Date</span>
              </div>
              <p className="text-xl font-bold text-neutral-900">
                {(user?.business_id as any)?.last_limit_reset_date
                  ? new Date((user?.business_id as any).last_limit_reset_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <BusinessProfileForm
          formData={formData}
          errors={errors}
          businessTypes={businessTypes}
          states={states}
          zones={zones}
          saving={saving}
          wabaSaving={wabaSaving}
          onInputChange={handleChange}
          onSave={handleSave}
          onWabaSave={handleWabaSave}
        />
      </div>
    </>
  );
};

export default BusinessPage;
