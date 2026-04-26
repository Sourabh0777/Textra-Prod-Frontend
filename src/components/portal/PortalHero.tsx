'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface PortalHeroProps {
  customerName: string;
  businessName: string;
  nextService: any;
}

export const PortalHero = ({ customerName, businessName, nextService }: PortalHeroProps) => {
  return (
    <section className="bg-[#15368A] rounded-2xl p-6 md:p-10 text-white shadow-lg overflow-hidden relative">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Badge className="bg-white/10 text-white border-white/20 px-3 py-0.5 text-[10px] uppercase font-bold tracking-widest">
            Identity Verified
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Hello, <span className="text-blue-200">{customerName.split(' ')[0]}</span>
          </h1>
          <p className="text-blue-50/80 text-sm md:text-base max-w-md">
            Welcome to your digital service portal at <span className="text-white font-semibold">{businessName || 'our center'}</span>. 
            All your vehicle records are synced and up to date.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-200 uppercase tracking-widest bg-black/10 w-fit px-3 py-2 rounded-lg">
             <Zap className="w-3 h-3" />
             Live Data Sync Active
          </div>
        </div>

        {nextService && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-100">Next Service</h3>
              <Calendar className="w-4 h-4 text-blue-200" />
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-lg p-2 text-center min-w-[50px]">
                <p className="text-[10px] font-bold uppercase opacity-60">{format(new Date(nextService.scheduled_for), 'MMM')}</p>
                <p className="text-xl font-bold">{format(new Date(nextService.scheduled_for), 'dd')}</p>
              </div>
              <div>
                <p className="text-lg font-bold">{format(new Date(nextService.scheduled_for), 'hh:mm a')}</p>
                <div className="flex items-center gap-1 text-[10px] text-blue-200 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {businessName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
