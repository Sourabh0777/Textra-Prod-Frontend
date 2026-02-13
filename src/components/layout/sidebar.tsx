'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { handleFacebookLogin } from './facebook-sdk';
import { useAppSelector } from '@/lib/hooks';
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  const isAdmin = user?.role === UserRole.ADMIN;

  const onLogin = async () => {
    setIsLoggingIn(true);
    try {
      await handleFacebookLogin();
      toast.success('Successfully connected to Facebook!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Facebook connection failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const fetchSideBar = async () => {
      try {
        const url = `${env.NEXT_PUBLIC_API_URL}/core/business-types/side-bar`;
        const token = await getToken();

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('🚀 ~ fetchSideBar ~ data:', data);
        if (data.success && data.data?.menus) {
          setMenus(data.data.menus);
        }
      } catch (err) {
        console.error('Sidebar error:', err);
      }
    };

    fetchSideBar();
  }, [getToken]);

  return (
    <aside className="w-full h-full bg-[#15368A] text-[#FFFFFF] overflow-y-auto flex flex-col border-r border-white/10">
      <SidebarHeader />
      <SidebarNavigation menus={menus} onClose={onClose} />
      <SidebarStatus isAdmin={isAdmin} isLoggingIn={isLoggingIn} onLogin={onLogin} />
    </aside>
  );
}
