import { Bell, Calendar, Smartphone, User, Trash2, Edit2, Send, CheckCircle2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { IReminder } from '@/types';
import { ReminderStatusBadge } from './reminder-status-badge';
import { Button } from '@/components/ui/button';

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
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {reminder.status !== 'completed' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => onResend(reminder)}
                            title="Resend Notification"
                          >
                            Resend
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => onCheckIn(reminder)}
                            title="Customer Check-in"
                            disabled={isCheckInLoading}
                          >
                            Check-in
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => onEdit(reminder)} title="Edit">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDelete(reminder._id || '')} title="Delete">
                        Del
                      </Button>
                    </div>
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

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4 p-0">
        {reminders.map((reminder: IReminder) => {
          const customer = reminder.customer_id as any;
          const vehicle = reminder.vehicle_id as any;
          const isCompleted = reminder.status === 'completed';

          return (
            <div key={reminder._id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900">{customer?.name || 'Unknown'}</span>
                    <span className="text-xs text-neutral-500">{customer?.phone_number || '-'}</span>
                  </div>
                </div>
                <ReminderStatusBadge status={reminder.status} />
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-800">
                      {vehicle?.brand} {vehicle?.vehicle_model}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{vehicle?.registration_number}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <Bell className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Notification</span>
                    </div>
                    <p className="text-sm text-neutral-900">{formatDate(reminder.scheduled_for)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-neutral-500">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Service Due</span>
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm text-neutral-900">{formatDate(reminder.due_date)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-400 bg-neutral-50 p-2 rounded-lg">
                  <span title="Last Notification Sent">
                    Sent: {reminder.last_sent_at ? formatDate(reminder.last_sent_at) : 'Never'}
                  </span>
                  <span>Retries: {reminder.retry_count}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  {!isCompleted && (
                    <>
                      <Button
                        variant="ghost"
                        className="flex-1 text-blue-600 border border-blue-100 hover:bg-blue-50 py-2.5 h-auto text-sm"
                        onClick={() => onResend(reminder)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Resend
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 text-green-600 border border-green-100 hover:bg-green-50 py-2.5 h-auto text-sm"
                        onClick={() => onCheckIn(reminder)}
                        disabled={isCheckInLoading}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Check-in
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 border border-neutral-200 py-2 h-auto text-xs"
                    onClick={() => onEdit(reminder)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1 py-2 h-auto text-xs"
                    onClick={() => onDelete(reminder._id || '')}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {reminders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-neutral-300">
            <p className="text-neutral-500">No reminders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
