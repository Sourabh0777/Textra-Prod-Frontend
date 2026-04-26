'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Zap, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface PortalHeroProps {
  customerName: string;
  businessName: string;
  nextService: any;
}

export const PortalHero = ({ customerName, businessName, nextService }: PortalHeroProps) => {
  return (
    <section className="bg-gradient-to-br from-[#15368A] via-[#1a3f9e] to-[#0e2460] rounded-2xl p-6 md:p-10 text-white shadow-lg shadow-[#15368A]/15 overflow-hidden relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Verified & Active
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug">
            Welcome back, <span className="text-blue-300">{customerName.split(' ')[0]}</span>
          </h1>
          <p className="text-blue-100/70 text-sm max-w-sm leading-relaxed">
            Your digital service portal at{' '}
            <span className="text-white font-semibold">{businessName || 'our center'}</span>.
            All vehicle records synced and secured.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-blue-200/60 mt-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Live sync active · Last updated just now
          </div>
        </div>

        {/* Next Service Card */}
        <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-200/80">Upcoming Service</h3>
            <Calendar className="w-4 h-4 text-blue-300/60" />
          </div>
          {nextService ? (
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center min-w-[54px] border border-white/5">
                <p className="text-[9px] font-bold uppercase text-blue-200/60">{format(new Date(nextService.scheduled_for), 'MMM')}</p>
                <p className="text-2xl font-bold leading-tight">{format(new Date(nextService.scheduled_for), 'dd')}</p>
              </div>
              <div>
                <p className="text-lg font-bold">{format(new Date(nextService.scheduled_for), 'hh:mm a')}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-blue-200/50 mt-1">
                  <MapPin className="w-3 h-3" />
                  {businessName}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/70 mx-auto" />
              <p className="text-sm font-semibold text-blue-100/70">All caught up!</p>
              <p className="text-[10px] text-blue-200/40">No pending reminders right now.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
