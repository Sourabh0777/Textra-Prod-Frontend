'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const PortalHeader = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100 px-4">
      <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#15368A] rounded-lg flex items-center justify-center">
            <Image src="/logo/logo.png" alt="Textra" width={18} height={18} className="brightness-0 invert" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#15368A]">
            TEXTRA <span className="text-neutral-400 font-medium text-[10px]">PORTAL</span>
          </span>
        </div>
        <Button variant="ghost" className="h-9 px-3 text-sm font-semibold text-neutral-600">
          <Settings className="w-4 h-4 mr-2" />
          Help
        </Button>
      </div>
    </nav>
  );
};
