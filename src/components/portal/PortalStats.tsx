'use client';

import React from 'react';
import { Car, CheckCircle2, Bell, TrendingUp } from 'lucide-react';

interface PortalStatsProps {
  vehicleCount: number;
  serviceCount: number;
  reminderCount: number;
}

export const PortalStats = ({ vehicleCount, serviceCount, reminderCount }: PortalStatsProps) => {
  const stats = [
    { label: 'Vehicles', value: vehicleCount, icon: Car, color: 'blue' },
    { label: 'Services', value: serviceCount, icon: CheckCircle2, color: 'green' },
    { label: 'Upcoming', value: reminderCount, icon: Bell, color: 'purple' },
    { label: 'Portal', value: 'Live', icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex items-center justify-between">
          <div className="space-y-1">
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
             <p className="text-xl font-bold text-neutral-800">{stat.value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-neutral-50 text-neutral-400 group-hover:text-blue-600 transition-colors`}>
             <stat.icon className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
};
