'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { SIDEBAR_CONFIG, SidebarKey } from '@/config/sidebarConfig';

interface SidebarNavigationProps {
  menus: SidebarKey[];
  onClose?: () => void;
}

export function SidebarNavigation({ menus, onClose }: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {menus &&
        menus.map((key) => {
          const item = SIDEBAR_CONFIG[key];
          if (!item) return null;
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="relative flex items-center gap-3 p-[12px] rounded-xl transition-all duration-300 group text-white shadow-sm"
            >
              <Icon className="w-5 h-5 transition-colors duration-300 text-white" />
              <span className="font-semibold text-sm tracking-wide text-white">{item.label}</span>
              {isActive && (
                <ChevronRight className="ml-auto w-4 h-4 text-[#FFFFFF] animate-in fade-in slide-in-from-left-2" />
              )}
            </Link>
          );
        })}
    </nav>
  );
}
