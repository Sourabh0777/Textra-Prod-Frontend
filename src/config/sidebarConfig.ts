import { LayoutDashboard, Building2, Users, Car, Wrench, Clock, MessageSquare } from 'lucide-react';
export type SidebarKey = keyof typeof SIDEBAR_CONFIG;

export const SIDEBAR_CONFIG = {
  dashboard: { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  'business-types': { label: 'Business Types', href: '/business-types', icon: Building2 },
  businesses: { label: 'Businesses', href: '/businesses', icon: Building2 },
  business: { label: 'Business', href: '/business', icon: Building2 },
  customers: { label: 'Customers', href: '/customers', icon: Users },
  vehicles: { label: 'Vehicles', href: '/vehicles', icon: Car },
  services: { label: 'Services', href: '/services', icon: Wrench },
  reminders: { label: 'Reminders', href: '/reminders', icon: Clock },
  'whatsapp-logs': { label: 'WhatsApp Logs', href: '/whatsapp-logs', icon: MessageSquare },
} as const;
