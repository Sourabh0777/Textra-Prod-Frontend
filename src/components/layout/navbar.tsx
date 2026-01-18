"use client";

import { User, LogOut, Bell, Search, Settings } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function Navbar({ onMenuClick, isMobile }: NavbarProps) {
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-xl border-b border-neutral-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button onClick={onMenuClick} className="p-2 mr-2 text-neutral-500 hover:text-[#15368A] hover:bg-neutral-100 rounded-xl transition-all duration-300 lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Left side - Search or Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#15368A] transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-100/50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15368A]/20 focus:bg-white focus:border-[#15368A]/30 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right side - Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-neutral-500 hover:text-[#15368A] hover:bg-neutral-100 rounded-xl transition-all duration-300 group">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white ring-1 ring-red-500/20 group-hover:scale-110 transition-transform">
                {notifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 text-neutral-500 hover:text-[#15368A] hover:bg-neutral-100 rounded-xl transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>

          <div className="h-8 w-px bg-neutral-200 mx-2 hidden md:block" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-neutral-900 leading-tight">Admin User</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Super Admin</p>
            </div>

            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#15368A]/10 border border-[#15368A]/20 text-[#15368A] hover:bg-[#15368A] hover:text-white transition-all duration-300 overflow-hidden ring-4 ring-transparent hover:ring-[#15368A]/10">
                <User className="w-5 h-5" />
              </button>

              {/* Simple dropdown indicator or hover effect */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <button className="ml-2 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
