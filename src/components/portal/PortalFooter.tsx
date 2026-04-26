'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const PortalFooter = ({ businessName }: { businessName: string }) => {
  return (
    <footer className="bg-white border-t border-neutral-100 py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/logo/logo.png" alt="Logo" width={16} height={16} className="opacity-30 grayscale" />
          <p className="text-[10px] font-semibold text-neutral-400">
            Powered by <span className="font-bold text-neutral-500">Textra</span> · {businessName || 'Service Portal'}
          </p>
        </div>
        <div className="flex items-center gap-5 text-[10px] font-semibold text-neutral-400">
          <Link href="#" className="hover:text-[#15368A] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[#15368A] transition-colors">Terms</Link>
          <Link href="#" className="hover:text-[#15368A] transition-colors">Support</Link>
        </div>
      </div>
    </footer>
  );
};
