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
    const business = user?.business_id;
    const fetchSideBar = async () => {
      try {
        const url = `${env.NEXT_PUBLIC_API_URL}/core/business-types/side-bar`;
        const token = await getToken();
        console.log(token);
        console.log(url);
        console.log('User:', user);
        console.log('Business ID:', user?.business_id);

        // {
        //   "object": "token",
        //   "jwt": "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zOFB3N0FHMlNSM2R5TFg1VzcwVnc0blNJcWMiLCJvaWF0IjoxNzc5MDc5NTYzLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3NzkwNzk2MjMsImZ2YSI6WzAsLTFdLCJpYXQiOjE3NzkwNzk1NjMsImlzcyI6Imh0dHBzOi8vZW1pbmVudC1mb3gtODEuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNzc5MDc5NTUzLCJzaWQiOiJzZXNzXzNEc25CT1A0RVZic1RBZmFYRDhTU1lpVWh1QiIsInN0cyI6ImFjdGl2ZSIsInN1YiI6InVzZXJfM0RyTGRvOFhQeTZhSmoyc0c2RVJETktFMFk5IiwidiI6Mn0.Er_4MdXr0PHCsQMNH13kyM3_bUWMcqWUV4Ad0E8Vv4LDpe4FXludcN7pS0cs9SjNT4mV0s8e7CSm8ec0BkHGUYv1WU2J69Wu_0oWwUA7nZin4V-QOkJJae2ys07qqPfQz044gLZaejNyBXlLRq5eKkKE4UyFgYhNv-XSGlCoeuXpAvUowflJXu9SI8Wne-5mEOyRKo6UVzNcAvuw-0epfGHIYyMIWScW3HVzd9e5G-8j0wUTIUvrw2SJLxis5WHV5jA-X1qLI06dgKf8pO1VnzWWx7pRftQ-U5yQ4_tdWzSqNgxxwEFrgrjOC2_yQaRnbLL6qSJY-yP372qv9KdYQw"
        // }
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
        console.log('Error response body:', await res.text());
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
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
