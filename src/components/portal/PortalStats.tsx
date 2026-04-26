'use client';

import React from 'react';
import { Car, CheckCircle2, Bell, Shield } from 'lucide-react';

interface PortalStatsProps {
  vehicleCount: number;
  serviceCount: number;
  reminderCount: number;
}

export const PortalStats = ({ vehicleCount, serviceCount, reminderCount }: PortalStatsProps) => {
  const stats = [
    { label: 'Vehicles', value: vehicleCount, icon: Car, bgColor: 'bg-blue-50', iconColor: 'text-[#15368A]', borderColor: 'border-blue-100' },
    { label: 'Service Records', value: serviceCount, icon: CheckCircle2, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-100' },
    { label: 'Reminders', value: reminderCount, icon: Bell, bgColor: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-100' },
    { label: 'Security', value: 'Active', icon: Shield, bgColor: 'bg-violet-50', iconColor: 'text-violet-600', borderColor: 'border-violet-100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`${stat.bgColor} border ${stat.borderColor} p-4 rounded-xl flex items-center gap-3 hover:shadow-sm transition-shadow cursor-default`}
        >
          <div className={`p-2 rounded-lg bg-white/80 ${stat.iconColor} shadow-sm`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-neutral-800 leading-tight">{stat.value}</p>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
