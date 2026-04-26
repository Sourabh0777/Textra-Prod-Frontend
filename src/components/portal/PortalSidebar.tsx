'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, ShieldCheck, Gift, ChevronRight } from 'lucide-react';

interface PortalSidebarProps {
  customer: any;
  onEditProfile: () => void;
}

export const PortalSidebar = ({ customer, onEditProfile }: PortalSidebarProps) => {
  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      {/* Profile Card */}
      <Card className="border border-neutral-200/60 shadow-sm rounded-xl bg-white overflow-hidden">
        <CardBody className="pt-10 px-5 pb-5 -mt-8 text-center">
          <div className="w-16 h-16 bg-white p-0.5 rounded-xl shadow-md mx-auto mb-3 border border-neutral-100">
            <div className="w-full h-full bg-[#15368A]/5 rounded-[10px] flex items-center justify-center">
              <User className="w-7 h-7 text-[#15368A]/60" />
            </div>
          </div>
          <h3 className="text-base font-bold text-neutral-800">{customer.name}</h3>
          <p className="text-[10px] font-semibold text-[#15368A]/60 mt-0.5">Verified Member</p>

          <div className="mt-5 text-left space-y-2">
            <div className="p-3 rounded-lg bg-neutral-50/80 border border-neutral-100/80 flex items-center gap-3 group hover:bg-[#15368A]/[0.03] hover:border-[#15368A]/10 transition-colors cursor-default">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 text-[#15368A]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Mobile</p>
                <p className="text-xs font-bold text-neutral-700 truncate">{customer.phone_number}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50/80 border border-neutral-100/80 flex items-center gap-3 group hover:bg-[#15368A]/[0.03] hover:border-[#15368A]/10 transition-colors cursor-default">
              <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Email</p>
                <p className="text-xs font-bold text-neutral-700 truncate">{customer.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={onEditProfile}
            className="w-full mt-5 h-10 bg-[#15368A] hover:bg-[#1a3f9e] text-white rounded-lg text-xs font-bold shadow-sm shadow-[#15368A]/15 transition-all hover:shadow-md group"
          >
            Update Account
            <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          <div className="mt-4 p-3 rounded-lg bg-emerald-50/60 border border-emerald-100/60 flex gap-2.5 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-emerald-700/70 leading-relaxed">
              Portal encrypted & accessible only via your private link.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Offers Card */}
      <Card className="border-none shadow-sm rounded-xl bg-gradient-to-br from-[#15368A] to-[#0e2460] text-white overflow-hidden">
        <CardBody className="p-5 space-y-3 relative">
          <div
            className="absolute top-0 right-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '12px 12px',
              width: '100%',
              height: '100%',
            }}
          />
          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-bold uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded text-blue-100">
                Coming Soon
              </span>
              <Gift className="w-5 h-5 text-amber-300/50" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-snug">Loyalty Rewards</h3>
              <p className="text-blue-200/50 text-[11px] mt-1 leading-relaxed">
                Exclusive service deals & loyalty points for your vehicles.
              </p>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400/50 w-1/3 rounded-full animate-pulse" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
