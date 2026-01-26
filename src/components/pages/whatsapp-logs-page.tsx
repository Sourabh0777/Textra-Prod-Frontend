/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useWhatsAppLogsPage } from '@/lib/hooks/use-whatsapp-logs-page';
import { WhatsAppLogTable } from '@/components/whatsapp-logs/whatsapp-log-table';

export default function WhatsAppLogsPage() {
  const { logs, loading, fetchError, statusVariant, formatDate } = useWhatsAppLogsPage();

  if (loading) {
    return (
      <>
        <Header title="WhatsApp Logs" subtitle="View message delivery logs" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="WhatsApp Logs" subtitle="View message delivery logs" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500">Error loading logs. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="WhatsApp Logs" subtitle="View message delivery logs" />

      <div className="p-4 md:p-8">
        <Card>
          <CardBody className="!p-0">
            <WhatsAppLogTable logs={logs} statusVariant={statusVariant} onFormatDate={formatDate} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
