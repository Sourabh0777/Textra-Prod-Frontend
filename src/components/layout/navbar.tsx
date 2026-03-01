'use client';

import { Bell, Search, Settings } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function Navbar({ onMenuClick, isMobile }: NavbarProps) {
  const router = useRouter();
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-xl border-b border-neutral-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Mobile Menu Button and Logo */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 mr-2 text-neutral-500 hover:text-[#15368A] hover:bg-neutral-100 rounded-xl transition-all duration-300 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          {isMobile && (
            <Link href="/" className="flex lg:hidden items-center gap-2">
              <Image src="/logo/logo.png" alt="Textra" width={28} height={28} className="rounded-lg" />
              <span className="text-xl font-bold text-[#15368A]">Textra</span>
            </Link>
          )}
        </div>

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
          <button
            onClick={() => router.push('/select-business-type')}
            className="p-2 text-neutral-500 hover:text-[#15368A] hover:bg-neutral-100 rounded-xl transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="h-8 w-px bg-neutral-200 mx-2 hidden md:block" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
