import { Badge } from '@/components/ui/badge';
import { ReminderStatus } from '@/types';

interface ReminderStatusBadgeProps {
  status: ReminderStatus | string;
}

export function ReminderStatusBadge({ status }: ReminderStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    [ReminderStatus.PENDING]: { label: 'Pending', variant: 'warning' },
    [ReminderStatus.SENT_1]: { label: '1st Alert', variant: 'info' },
    [ReminderStatus.SENT_2]: { label: '2nd Alert', variant: 'info' },
    [ReminderStatus.CUSTOMER_NOT_RESPONDING]: { label: 'No Response', variant: 'danger' },
    [ReminderStatus.COMPLETED]: { label: 'Done', variant: 'success' },
  };

  const config = statusConfig[status as string] || {
    label: typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
    variant: 'info' as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
