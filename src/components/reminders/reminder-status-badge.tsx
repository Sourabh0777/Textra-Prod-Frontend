import { Badge } from '@/components/ui/badge';

interface ReminderStatusBadgeProps {
  status: string;
}

export function ReminderStatusBadge({ status }: ReminderStatusBadgeProps) {
  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    sent: 'success',
    failed: 'danger',
    completed: 'success',
  };

  return <Badge variant={statusVariant[status] || 'info'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}
