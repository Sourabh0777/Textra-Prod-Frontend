import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  Wrench,
  Clock,
  MessageSquare,
  Settings,
  MessageSquareText,
} from 'lucide-react';
export type SidebarKey = keyof typeof SIDEBAR_CONFIG;

export const SIDEBAR_CONFIG = {
  configurations: { label: 'Configurations', href: '/configurations', icon: Settings },
  dashboard: { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  'business-types': { label: 'Business Types', href: '/business-types', icon: Building2 },
  businesses: { label: 'Businesses', href: '/businesses', icon: Building2 },
  business: { label: 'Business', href: '/vehicle-service/business', icon: Building2 },
  customers: { label: 'Customers', href: '/vehicle-service/customers', icon: Users },
  vehicles: { label: 'Vehicles', href: '/vehicle-service/vehicles', icon: Car },
  services: { label: 'Services', href: '/vehicle-service/services', icon: Wrench },
  reminders: { label: 'Reminders', href: '/vehicle-service/reminders', icon: Clock },
  'whatsapp-logs': { label: 'WhatsApp Logs', href: '/vehicle-service/whatsapp-logs', icon: MessageSquare },
  templates: { label: 'Templates', href: '/vehicle-service/templates', icon: MessageSquareText },
} as const;
