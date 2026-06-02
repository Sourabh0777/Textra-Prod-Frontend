'use client';

import { ArrowLeft } from 'lucide-react';

interface OpticalHeaderProps {
  hasActiveCustomer: boolean;
  onBack: () => void;
}

export function OpticalHeader({ hasActiveCustomer, onBack }: OpticalHeaderProps) {
  return (
    <div className="bg-[#15368A] text-white py-2 px-3 shadow-sm flex items-center justify-between select-none">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black tracking-tight">👓 Optical Diagnostics</span>
      </div>
      {hasActiveCustomer && (
        <button
          type="button"
          onClick={onBack}
          className="text-[9.5px] font-bold bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </button>
      )}
    </div>
  );
}
