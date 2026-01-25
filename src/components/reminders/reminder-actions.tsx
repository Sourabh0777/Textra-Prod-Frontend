import { Button } from '@/components/ui/button';
import { IReminder } from '@/types';

interface ReminderActionsProps {
  reminder: IReminder;
  onResend: (reminder: IReminder) => void;
  onCheckIn: (reminder: IReminder) => void;
  onEdit: (reminder: IReminder) => void;
  onDelete: (id: string) => void;
  isCheckInDisabled?: boolean;
}

export function ReminderActions({
  reminder,
  onResend,
  onCheckIn,
  onEdit,
  onDelete,
  isCheckInDisabled,
}: ReminderActionsProps) {
  const isCompleted = reminder.status === 'completed';

  return (
    <div className="flex justify-end gap-2">
      {!isCompleted && (
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
            disabled={isCheckInDisabled}
          >
            Check-in
          </Button>
          <div className="border-l border-neutral-200 h-6 mx-1 self-center" />
        </>
      )}
      <Button variant="ghost" size="sm" onClick={() => onEdit(reminder)} title="Edit">
        Edit
      </Button>
      <Button variant="danger" size="sm" onClick={() => onDelete(reminder._id || '')} title="Delete">
        Del
      </Button>
    </div>
  );
}
