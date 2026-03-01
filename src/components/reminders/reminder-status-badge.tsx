import { Badge } from '@/components/ui/badge';
import { ReminderStatus } from '@/types';

interface ReminderStatusBadgeProps {
  status: ReminderStatus | string;
}

export function ReminderStatusBadge({ status }: ReminderStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    [ReminderStatus.PENDING]: { label: 'Pending', variant: 'warning' },
    [ReminderStatus.BEFORE_7_DAYS]: { label: '7 Days Before', variant: 'info' },
    [ReminderStatus.BEFORE_2_DAYS]: { label: '2 Days Before', variant: 'info' },
    [ReminderStatus.ON_DUE_DATE]: { label: 'On Due Date', variant: 'warning' },
    [ReminderStatus.AFTER_3_DAYS]: { label: '3 Days After', variant: 'info' },
    [ReminderStatus.AFTER_10_DAYS]: { label: '10 Days After', variant: 'warning' },
    [ReminderStatus.AFTER_30_DAYS]: { label: '30 Days After', variant: 'danger' },
    [ReminderStatus.LOST_SERVICE_CYCLE]: { label: 'Lost Service Cycle', variant: 'danger' },
    [ReminderStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
  };

  const config = statusConfig[status as string] || {
    label: typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
    variant: 'info' as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
