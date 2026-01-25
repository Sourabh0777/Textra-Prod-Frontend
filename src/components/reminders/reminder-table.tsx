import { Bell, Calendar } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { IReminder } from '@/types';
import { ReminderStatusBadge } from './reminder-status-badge';
import { ReminderActions } from './reminder-actions';

interface ReminderTableProps {
  reminders: IReminder[];
  onResend: (reminder: IReminder) => void;
  onCheckIn: (reminder: IReminder) => void;
  onEdit: (reminder: IReminder) => void;
  onDelete: (id: string) => void;
  isCheckInLoading?: boolean;
}

export function ReminderTable({
  reminders,
  onResend,
  onCheckIn,
  onEdit,
  onDelete,
  isCheckInLoading,
}: ReminderTableProps) {
  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>Vehicle</TableHeaderCell>
            <TableHeaderCell className="hidden md:table-cell">Notification</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell">Due Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="hidden lg:table-cell">Activity</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reminders.map((reminder: IReminder) => {
            const customer = reminder.customer_id as any;
            const vehicle = reminder.vehicle_id as any;
            return (
              <TableRow key={reminder._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900">{customer?.name || 'Unknown'}</span>
                    <span className="text-xs text-neutral-500">{customer?.phone_number || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-800">
                      {vehicle?.brand} {vehicle?.vehicle_model}
                    </span>
                    <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-1 rounded w-fit">
                      {vehicle?.registration_number}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  <div className="flex items-center gap-2" title="Scheduled Notification Date">
                    <Bell className="w-3.5 h-3.5 text-blue-500" />
                    <span>{formatDate(reminder.scheduled_for)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm">
                  <div className="flex items-center gap-2 text-neutral-500" title="Next Service Due Date">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(reminder.due_date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ReminderStatusBadge status={reminder.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm">
                  <div className="flex flex-col text-xs">
                    <span title="Last Notification Sent">
                      Sent: {reminder.last_sent_at ? formatDate(reminder.last_sent_at) : 'Never'}
                    </span>
                    <span className="text-neutral-400">Retries: {reminder.retry_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ReminderActions
                    reminder={reminder}
                    onResend={onResend}
                    onCheckIn={onCheckIn}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isCheckInDisabled={isCheckInLoading}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          {reminders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                No reminders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
