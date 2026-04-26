'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const PortalFooter = ({ businessName }: { businessName: string }) => {
  return (
    <footer className="bg-white border-t border-neutral-100 py-12 text-center space-y-6">
      <div className="flex flex-col items-center gap-2">
         <Image src="/logo/logo.png" alt="Logo" width={24} height={24} className="opacity-30 grayscale" />
         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
           Verified by Textra Automotive
         </p>
      </div>
      <div className="flex justify-center gap-6 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
         <Link href="#" className="hover:text-blue-600">Privacy</Link>
         <Link href="#" className="hover:text-blue-600">Terms</Link>
         <Link href="#" className="hover:text-blue-600">Support</Link>
      </div>
      <p className="text-[9px] text-neutral-300 font-medium">
        © 2026 {businessName || 'Service Center'}. All data encrypted.
      </p>
    </footer>
  );
};
