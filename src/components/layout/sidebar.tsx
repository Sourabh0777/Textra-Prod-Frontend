'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { useCurrentUser } from '@/lib/hooks/useFetchUserData';
import { UserRole } from '@/types';
import { SidebarKey } from '@/config/sidebarConfig';
import { env } from '@/env';
import { useFacebookOAuthMutation } from '@/lib/api/oAuthApi';
import { useFacebookAuth } from '@/lib/hooks/useFacebookAuth';

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

  const { onFacebookLogin, isLoggingIn } = useFacebookAuth();

  const onLogin = async () => {
    await onFacebookLogin();
  };

  useEffect(() => {
    const isAdmin = user?.role === UserRole.ADMIN;
    const isBusinessActive = user?.business_id?.is_active === true;

    const fetchSideBar = async () => {
      if (!isAdmin && !isBusinessActive) return;

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
      <SidebarStatus isLoggingIn={isLoggingIn} onLogin={onLogin} />
    </aside>
  );
}
