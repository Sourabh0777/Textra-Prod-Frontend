'use client';

import Image from 'next/image';

export function SidebarHeader() {
  return (
    <div className="p-6 bg-[#15368A]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
          <Image src="/logo/logo.png" alt="Textra" width={28} height={28} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#FFFFFF]">Textra</h1>
          <p className="text-[#D9D9D9] text-[8px] uppercase tracking-[0.1em] font-bold">Whatsapp remminder Solution</p>
        </div>
      </div>
    </div>
  );
}
