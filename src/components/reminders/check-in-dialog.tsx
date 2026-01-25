import { Modal } from '@/components/ui/modal';
import { IReminder } from '@/types';

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reminder: IReminder | null;
  loading?: boolean;
}

export function CheckInDialog({ isOpen, onClose, onConfirm, reminder, loading }: CheckInDialogProps) {
  if (!reminder) return null;

  const vehicle = reminder.vehicle_id as any;
  const customer = reminder.customer_id as any;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Shop Visit"
      onConfirm={onConfirm}
      confirmText="Confirm Check-in"
      loading={loading}
    >
      <div className="space-y-4">
        <p className="text-neutral-600">
          Are you sure you want to mark the shop visit for{' '}
          <span className="font-bold text-neutral-900">{customer?.name || 'this customer'}</span>'s{' '}
          <span className="font-semibold text-neutral-800">
            {vehicle?.brand} {vehicle?.vehicle_model}
          </span>
          ?
        </p>
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-1">What happens next?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              This reminder will be marked as <strong>completed</strong>.
            </li>
            <li>A new service record will be created for today.</li>
            <li>
              A new <strong>pending</strong> reminder will be scheduled for the next service.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
