import { useState } from 'react';
import type { IReminder } from '@/types';
import { ReminderTable } from './reminder-table';
import { Card, CardBody } from '@/components/ui/card';

interface ReminderTabsProps {
  reminders: IReminder[];
  onResend: (reminder: IReminder) => void;
  onCheckIn: (reminder: IReminder) => void;
  onEdit: (reminder: IReminder) => void;
  onDelete: (id: string) => void;
  isCheckInLoading?: boolean;
}

export function ReminderTabs({
  reminders,
  onResend,
  onCheckIn,
  onEdit,
  onDelete,
  isCheckInLoading,
}: ReminderTabsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const upcomingReminders = reminders.filter((r) => r.status !== 'completed');
  const completedReminders = reminders.filter((r) => r.status === 'completed');

  const filteredReminders = activeTab === 'upcoming' ? upcomingReminders : completedReminders;

  return (
    <>
      <div className="flex border-b border-neutral-200 mb-6 bg-white rounded-t-xl overflow-hidden">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Upcoming
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-600'
            }`}
          >
            {upcomingReminders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'completed'
              ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Completed
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'completed' ? 'bg-green-600 text-white' : 'bg-neutral-200 text-neutral-600'
            }`}
          >
            {completedReminders.length}
          </span>
        </button>
      </div>

      <Card className="!px-0 !py-0">
        <CardBody className="!px-0 !py-0">
          <ReminderTable
            reminders={filteredReminders}
            onResend={onResend}
            onCheckIn={onCheckIn}
            onEdit={onEdit}
            onDelete={onDelete}
            isCheckInLoading={isCheckInLoading}
          />
        </CardBody>
      </Card>
    </>
  );
}
