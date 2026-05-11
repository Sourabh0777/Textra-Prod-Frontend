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
  Bike,
  QrCode,
} from 'lucide-react';
export type SidebarKey = keyof typeof SIDEBAR_CONFIG;

export const SIDEBAR_CONFIG = {
  dashboard: { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  // admin
  configurations: { label: 'Configurations', href: '/admin/configurations', icon: Settings },
  'business-types': { label: 'Business Types', href: '/admin/business-types', icon: Building2 },
  businesses: { label: 'Businesses', href: '/admin/businesses', icon: Building2 },
  'qr-codes': { label: 'QR Code', href: '/admin/qr-codes', icon: QrCode },
  // Sub admin
  'sub-admin-customers': { label: 'Customers (SA)', href: '/sub-admin/customers', icon: Users },
  'sub-admin-vehicles': { label: 'Vehicles (SA)', href: '/sub-admin/vehicles', icon: Bike },
  // Vehicle Service
  business: { label: 'Business', href: '/vehicle-service/business', icon: Building2 },
  customers: { label: 'Customers', href: '/vehicle-service/customers', icon: Users },
  vehicles: { label: 'Vehicles', href: '/vehicle-service/vehicles', icon: Bike },
  services: { label: 'Services', href: '/vehicle-service/services', icon: Wrench },
  reminders: { label: 'Reminders', href: '/vehicle-service/reminders', icon: Clock },
  'whatsapp-logs': { label: 'WhatsApp Logs', href: '/vehicle-service/whatsapp-logs', icon: MessageSquare },
  templates: { label: 'Templates', href: '/vehicle-service/templates', icon: MessageSquareText },
  cars: { label: 'Cars', href: '/vehicle-service/cars', icon: Car },
} as const;

