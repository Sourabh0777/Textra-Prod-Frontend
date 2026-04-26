'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Download, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface PortalTimelineProps {
  services: any[];
  businessName: string;
}

export const PortalTimeline = ({ services, businessName }: PortalTimelineProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-neutral-800">Service Highlights</h2>
      <div className="relative pl-8 space-y-8">
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-neutral-100 rounded-full" />
        
        {services.map((service, idx) => (
          <div key={idx} className="relative bg-white border border-neutral-100 p-5 rounded-xl shadow-sm hover:border-blue-100 transition-all">
            <div className="absolute -left-8 top-3 w-7 h-7 bg-white border-2 border-neutral-100 rounded-full flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge className="bg-blue-50 text-[#15368A] border-none px-2 py-0.5 font-bold uppercase text-[9px] mb-2">{service.status || 'RECORDED'}</Badge>
                <h3 className="text-base font-bold text-neutral-800">{service.notes || 'General Service'}</h3>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-neutral-400 uppercase mb-0.5">Date</p>
                <p className="text-sm font-bold text-neutral-800">{format(new Date(service.last_service_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-300" />
                <span className="text-xs font-medium text-neutral-500">{businessName}</span>
              </div>
              <Button variant="ghost" className="h-8 px-3 text-[10px] font-bold text-[#15368A] hover:bg-blue-50 rounded-lg"><Download className="w-3 h-3 mr-1.5" /> PDF Report</Button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-neutral-100 rounded-xl bg-white">
            <p className="text-sm font-bold text-neutral-400">No service history found.</p>
          </div>
        )}
      </div>
    </section>
  );
};
