'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, ShieldCheck, Gift } from 'lucide-react';

interface PortalSidebarProps {
  customer: any;
  onEditProfile: () => void;
}

export const PortalSidebar = ({ customer, onEditProfile }: PortalSidebarProps) => {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <div className="h-20 bg-[#15368A]/10"></div>
        <CardBody className="px-6 pb-6 -mt-10 text-center">
          <div className="w-20 h-20 bg-white p-1 rounded-2xl shadow-md mx-auto mb-4 border border-neutral-100 flex items-center justify-center">
             <User className="w-10 h-10 text-neutral-200" />
          </div>
          <h3 className="text-xl font-bold text-neutral-800">{customer.name}</h3>
          
          <div className="mt-6 text-left space-y-3">
             <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-400" />
                <div>
                   <p className="text-[9px] font-bold text-neutral-400 uppercase">Mobile</p>
                   <p className="text-sm font-bold text-neutral-700">{customer.phone_number}</p>
                </div>
             </div>
             <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-400" />
                <div className="overflow-hidden">
                   <p className="text-[9px] font-bold text-neutral-400 uppercase">Email Address</p>
                   <p className="text-sm font-bold text-neutral-700 truncate">{customer.email || '—'}</p>
                </div>
             </div>
          </div>

          <Button onClick={onEditProfile} className="w-full mt-6 h-12 bg-[#15368A] text-white rounded-xl font-bold text-sm">
             Update Account
          </Button>

          <div className="mt-6 p-4 rounded-xl bg-blue-50/50 flex gap-3 text-left">
             <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
             <p className="text-[10px] font-medium text-blue-800/70 leading-relaxed">
               Your portal is secure and only accessible via this private link.
             </p>
          </div>
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-6 space-y-4">
        <div className="flex justify-between items-start">
           <Badge className="bg-white/20 border-none text-[8px] font-black uppercase py-0.5">Premium</Badge>
           <Gift className="w-5 h-5 opacity-40" />
        </div>
        <div>
           <h3 className="text-lg font-bold leading-tight">Member Rewards</h3>
           <p className="text-indigo-100 text-xs mt-1 leading-relaxed opacity-80">
             Exclusive maintenance deals for your vehicles are coming soon.
           </p>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
           <div className="h-full bg-white/40 w-1/3 rounded-full animate-pulse"></div>
        </div>
      </Card>
    </div>
  );
};
