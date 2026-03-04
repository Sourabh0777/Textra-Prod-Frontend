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
  business: { label: 'Business', href: '/bike-service/business', icon: Building2 },
  customers: { label: 'Customers', href: '/bike-service/customers', icon: Users },
  vehicles: { label: 'Vehicles', href: '/bike-service/vehicles', icon: Car },
  services: { label: 'Services', href: '/bike-service/services', icon: Wrench },
  reminders: { label: 'Reminders', href: '/bike-service/reminders', icon: Clock },
  'whatsapp-logs': { label: 'WhatsApp Logs', href: '/bike-service/whatsapp-logs', icon: MessageSquare },
  templates: { label: 'Templates', href: '/bike-service/templates', icon: MessageSquareText },
} as const;
