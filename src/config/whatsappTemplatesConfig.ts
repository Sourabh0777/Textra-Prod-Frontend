import { TemplateType } from '@/types';

export interface TemplateTypeConfig {
  type: TemplateType;
  label: string;
  enabled: boolean;
}

export const WHATSAPP_TEMPLATE_CONFIG: TemplateTypeConfig[] = [
  { type: 'SERVICE_REMINDER', label: 'Service Reminder', enabled: true },
  { type: 'SERVICE_COMPLETED', label: 'Service Completed', enabled: false },
  { type: 'FEEDBACK_REQUEST', label: 'Feedback Request', enabled: false },
  { type: 'CUSTOM_MESSAGE', label: 'Custom Message', enabled: false },
];
