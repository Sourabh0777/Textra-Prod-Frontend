/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useRemindersPage } from '@/lib/hooks/use-reminders-page';

// Sub-components
import { ReminderTabs } from '@/components/reminders/reminder-tabs';
import { ReminderModal } from '@/components/reminders/reminder-modal';
import { CheckInDialog } from '@/components/reminders/check-in-dialog';

export default function RemindersPage() {
  const {
    reminders,
    services,
    loading,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    errors,
    isCheckInOpen,
    setIsCheckInOpen,
    selectedReminder,
    isMarkingVisited,
    isSubmitting,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
    handleCheckInClick,
    handleMarkVisited,
    handleResend,
  } = useRemindersPage();

  if (loading) {
    return (
      <>
        <Header title="Reminders" subtitle="Manage service reminders" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader className="animate-spin text-blue-500" />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Reminders" subtitle="Manage service reminders" />
        <div className="p-4 md:p-8">
          <Card>
            <CardBody>
              <p className="text-red-500 text-center py-8">Error loading reminders. Please try again later.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Reminders" subtitle="Manage service reminders" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900">All Reminders</h2>
          <Button onClick={() => handleOpenModal()}>+ Add Reminder</Button>
        </div>

        <ReminderTabs
          reminders={reminders}
          onResend={handleResend}
          onCheckIn={handleCheckInClick}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isCheckInLoading={isMarkingVisited}
        />
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        errors={errors}
        services={services}
        loading={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <CheckInDialog
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onConfirm={handleMarkVisited}
        reminder={selectedReminder}
        loading={isMarkingVisited}
      />
    </>
  );
}
