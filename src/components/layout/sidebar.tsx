'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Car, Wrench, Clock, MessageSquare, ChevronRight } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

const menuItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Business Types', href: '/business-types', icon: Building2 },

  { label: 'Businesses', href: '/businesses', icon: Building2 },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Vehicles', href: '/vehicles', icon: Car },
  { label: 'Services', href: '/services', icon: Wrench },
  { label: 'Reminders', href: '/reminders', icon: Clock },
  { label: 'WhatsApp Logs', href: '/whatsapp-logs', icon: MessageSquare },
];

export function Sidebar({ onClose, isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full h-full bg-[#15368A] text-[#FFFFFF] overflow-y-auto flex flex-col border-r border-white/10">
      {/* Header */}
      <div className="p-6 bg-[#15368A]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <Wrench className="w-6 h-6 text-[#FFFFFF]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#FFFFFF]">BikeService</h1>
            <p className="text-[#D9D9D9] text-[10px] uppercase tracking-[0.2em] font-bold">Enterprise CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                relative flex items-center gap-3 p-[12px] rounded-xl transition-all duration-300 group text-white shadow-sm
              `}
            >
              <Icon className={`w-5 h-5 transition-colors duration-300 text-white`} />
              <span className="font-semibold text-sm tracking-wide  text-white">{item.label}</span>
              {isActive && (
                <ChevronRight className="ml-auto w-4 h-4 text-[#FFFFFF] animate-in fade-in slide-in-from-left-2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-white/10 bg-white/5">
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between text-[10px] text-[#D9D9D9] uppercase tracking-wider font-bold">
            <span>System Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span className="text-emerald-400">Online</span>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-[#D9D9D9]/60 font-medium">v1.2.0 • Pro Edition</p>
        </div>
      </div>
    </aside>
  );
}
