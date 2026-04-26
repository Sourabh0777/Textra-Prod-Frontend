'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const PortalHeader = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/60 px-4">
      <div className="max-w-7xl mx-auto flex justify-between h-14 items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#15368A] rounded-lg flex items-center justify-center shadow-sm shadow-[#15368A]/20">
            <Image src="/logo/logo.png" alt="Textra" width={18} height={18} className="brightness-0 invert" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-neutral-800">Textra</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#15368A] bg-[#15368A]/8 px-2 py-0.5 rounded">
              Portal
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-8 px-3 text-xs font-semibold text-neutral-500 hover:text-[#15368A] hover:bg-[#15368A]/5 rounded-lg transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-[#15368A]" />
          Support
        </Button>
      </div>
    </nav>
  );
};
