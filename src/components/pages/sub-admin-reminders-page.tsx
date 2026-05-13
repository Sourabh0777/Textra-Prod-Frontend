/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader, RefreshCw } from 'lucide-react';
import { useSubAdminRemindersPage } from '@/lib/hooks/use-sub-admin-reminders-page';

// Sub-components
import { SubAdminReminderTabs } from '@/components/sub-admin/sub-admin-reminder-tabs';
import { ReminderModal } from '@/components/reminders/reminder-modal';
import { CheckInDialog } from '@/components/reminders/check-in-dialog';

export default function SubAdminRemindersPage() {
  const {
    reminders,
    filteredReminders,
    services,
    loading,
    fetchError,
    refetchReminders,
    isModalOpen,
    setIsModalOpen,
    formData,
    errors,
    isCheckInOpen,
    setIsCheckInOpen,
    selectedReminder,
    isMarkingVisited,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    handleOpenModal,
    handleChange,
    handleSubmit,
    handleDelete,
    handleCheckInClick,
    handleMarkVisited,
    handleResend,
  } = useSubAdminRemindersPage();

  const [isRefetching, setIsRefetching] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefetching(true);
    if (refetchReminders) {
      await refetchReminders();
    }
    setTimeout(() => setIsRefetching(false), 500);
  };

  if (loading) {
    return (
      <>
        <Header title="Sub-Admin Reminders" subtitle="Manage reminders across all businesses" />
        <div className="p-4 md:p-8 flex justify-center items-center min-h-[400px]">
          <Loader className="animate-spin text-blue-500" />
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Header title="Sub-Admin Reminders" subtitle="Manage reminders across all businesses" />
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
      <Header title="Sub-Admin Reminders" subtitle="Manage reminders across all businesses" />

      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-neutral-900 whitespace-nowrap">Reminders</h2>
              <span className="text-sm text-neutral-500 font-medium">({filteredReminders.length})</span>
            </div>
            <div className="w-full md:w-72">
              <Input
                placeholder="Search customer, registration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="secondary" onClick={handleRefresh} disabled={isRefetching} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => handleOpenModal()} className="flex-1 md:flex-none">
              + Add Reminder
            </Button>
          </div>
        </div>

        <SubAdminReminderTabs
          reminders={filteredReminders}
          onResend={handleResend}
          onCheckIn={handleCheckInClick}
          onDelete={handleDelete}
          isCheckInLoading={isMarkingVisited}
        />
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
