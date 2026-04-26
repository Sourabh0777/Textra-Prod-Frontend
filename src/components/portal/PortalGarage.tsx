'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Car, Edit2, Trash2 } from 'lucide-react';

interface PortalGarageProps {
  vehicles: any[];
  onAdd: () => void;
  onEdit: (vehicle: any) => void;
  onDelete: (id: string) => void;
}

export const PortalGarage = ({ vehicles, onAdd, onEdit, onDelete }: PortalGarageProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Your Garage</h2>
          <p className="text-xs text-neutral-500">Manage your private fleet</p>
        </div>
        <Button onClick={onAdd} size="sm" className="bg-[#15368A] text-white rounded-lg px-4 font-bold">
          <Plus className="w-4 h-4 mr-1" /> Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle, idx) => (
          <div key={idx} className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm space-y-4 hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(vehicle)} className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => onDelete(vehicle._id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-800">{vehicle.brand}</h3>
              <p className="text-sm font-medium text-neutral-400">{vehicle.vehicle_model} <span className="text-[10px] opacity-70">({vehicle.year})</span></p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Plate</p>
                <p className="text-xs font-bold text-[#15368A]">{vehicle.registration_number}</p>
              </div>
              <div className="bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Daily Use</p>
                <p className="text-xs font-bold text-neutral-800">{vehicle.daily_travel} Km</p>
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full py-10 text-center border-2 border-dashed border-neutral-100 rounded-xl">
            <p className="text-sm text-neutral-400 font-medium tracking-tight">Your garage is currently empty.</p>
          </div>
        )}
      </div>
    </section>
  );
};
