'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Download, MapPin, Wrench } from 'lucide-react';
import { format } from 'date-fns';

interface PortalTimelineProps {
  services: any[];
  businessName: string;
}

export const PortalTimeline = ({ services, businessName }: PortalTimelineProps) => {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-neutral-800">Service History</h2>
        <p className="text-xs text-neutral-400">Complete maintenance timeline</p>
      </div>

      <div className="relative pl-8 space-y-6">
        {/* Timeline line */}
        <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#15368A]/20 via-[#15368A]/10 to-transparent rounded-full" />

        {services.map((service, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline dot */}
            <div className={`absolute -left-8 top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              idx === 0
                ? 'bg-[#15368A] border-[#15368A] shadow-sm shadow-[#15368A]/30'
                : 'bg-white border-neutral-200 group-hover:border-[#15368A]/40'
            }`}>
              <Clock className={`w-3 h-3 ${idx === 0 ? 'text-white' : 'text-neutral-400 group-hover:text-[#15368A]'} transition-colors`} />
            </div>

            {/* Card */}
            <div className="bg-white border border-neutral-200/60 p-5 rounded-xl hover:border-[#15368A]/20 hover:shadow-md hover:shadow-[#15368A]/5 transition-all duration-300">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="space-y-1.5">
                  <Badge className={`border-none px-2 py-0.5 font-bold uppercase text-[9px] tracking-wider ${
                    (service.status || '').toLowerCase() === 'completed'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-blue-50 text-[#15368A]'
                  }`}>
                    {service.status || 'Recorded'}
                  </Badge>
                  <h3 className="text-sm font-bold text-neutral-800">{service.notes || 'General Service'}</h3>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-bold text-neutral-700">{format(new Date(service.last_service_date), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin className="w-3 h-3 text-[#15368A]/50" />
                  <span className="text-xs font-medium">{businessName}</span>
                </div>
                <Button
                  variant="ghost"
                  className="h-7 px-2.5 text-[10px] font-bold text-[#15368A] hover:bg-[#15368A]/5 rounded-md transition-colors"
                >
                  <Download className="w-3 h-3 mr-1" /> Report
                </Button>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-[#15368A]/10 rounded-xl bg-[#15368A]/[0.02]">
            <Wrench className="w-8 h-8 text-[#15368A]/20 mx-auto mb-3" />
            <p className="text-sm font-semibold text-neutral-400">No service records yet</p>
            <p className="text-xs text-neutral-300 mt-1">Records will appear here after your first service.</p>
          </div>
        )}
      </div>
    </section>
  );
};
