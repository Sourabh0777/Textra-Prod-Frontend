'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useCurrentUser } from '@/lib/hooks/useFetchUserData';
import { UserRole } from '@/types';
import { SidebarKey } from '@/config/sidebarConfig';
import { env } from '@/env';
import { SidebarHeader } from './sidebar/sidebar-header';
import { SidebarNavigation } from './sidebar/sidebar-navigation';
import { SidebarStatus } from './sidebar/sidebar-status';

interface SidebarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export function Sidebar({ onClose, isOpen }: SidebarProps) {
  const { getToken } = useAuth();
  const [menus, setMenus] = useState<SidebarKey[]>([]);
  const { user } = useCurrentUser();

  const onLogin = async () => {};

  useEffect(() => {
    const isAdmin = user?.role === UserRole.ADMIN;
    const business = user?.business_id;
    const isBusinessActive = business?.is_active === true;
    const isWabaSetup = !!business?.waba_id && !!business?.phone_number_id;

    const fetchSideBar = async () => {
      if (!isAdmin && !isBusinessActive && !isWabaSetup) {
        setMenus(['business']);
        return;
      }
      if (!isAdmin && !isBusinessActive) return;

      // If not admin and business setup is incomplete, show only "Business"

      try {
        const url = `${env.NEXT_PUBLIC_API_URL}/core/business-types/side-bar`;
        const token = await getToken();

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && data.data?.menus) {
          setMenus(data.data.menus);
        }
      } catch (err) {
        console.error('Sidebar error:', err);
      }
    };

    fetchSideBar();
  }, [getToken, user]);

  return (
    <aside className="w-full h-full bg-[#15368A] text-[#FFFFFF] overflow-y-auto flex flex-col border-r border-white/10">
      <SidebarHeader />
      <SidebarNavigation menus={menus} onClose={onClose} />
      <SidebarStatus isLoggingIn={false} onLogin={onLogin} />
    </aside>
  );
}
