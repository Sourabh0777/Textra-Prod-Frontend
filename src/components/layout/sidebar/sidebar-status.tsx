'use client';

import { useCurrentUser } from '@/lib/hooks/useFetchUserData';
import { UserRole } from '@/types';

interface SidebarStatusProps {
  isLoggingIn: boolean;
  onLogin: () => void;
}

export function SidebarStatus({ isLoggingIn, onLogin }: SidebarStatusProps) {
  const { user } = useCurrentUser();

  const isAdmin = user?.role === UserRole.ADMIN;
  // Use business_id.is_active to determine if the business is active (online)
  const isOnline = isAdmin || user?.business_id?.is_active === true;

  return (
    <div className="mt-auto p-4 border-t border-white/10 bg-white/5">
      <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
        <div className="flex items-center justify-between text-[10px] text-[#D9D9D9] uppercase tracking-wider font-bold">
          <span>System Status</span>
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                <span className="text-emerald-400">Online</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.4)]" />
                <span className="text-red-400">Offline</span>
              </>
            )}
          </div>
        </div>
        <p className="mt-1 text-[11px] text-[#D9D9D9]/60 font-medium">v1.2.0 • Pro Edition</p>
      </div>

      {!isAdmin && (
        <button
          onClick={onLogin}
          disabled={user?.business_id?.is_active || isLoggingIn}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all duration-300 border border-white/20 disabled:opacity-50"
        >
          <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-[10px]">f</div>
          {user?.business_id?.is_active ? 'Connected' : isLoggingIn ? 'Connecting...' : 'Connect to Business'}
        </button>
      )}
    </div>
  );
}
