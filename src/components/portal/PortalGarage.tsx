'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Car, Edit2, Trash2, Fuel, Gauge } from 'lucide-react';

interface PortalGarageProps {
  vehicles: any[];
  onAdd: () => void;
  onEdit: (vehicle: any) => void;
  onDelete: (id: string) => void;
}

export const PortalGarage = ({ vehicles, onAdd, onEdit, onDelete }: PortalGarageProps) => {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-800">My Garage</h2>
          <p className="text-xs text-neutral-400">Your registered vehicles</p>
        </div>
        <Button
          onClick={onAdd}
          size="sm"
          className="bg-[#15368A] hover:bg-[#1a3f9e] text-white rounded-lg px-4 h-9 text-xs font-bold shadow-sm shadow-[#15368A]/15 transition-all hover:shadow-md"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 hover:border-[#15368A]/30 hover:shadow-md hover:shadow-[#15368A]/5 transition-all duration-300 group"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#15368A]/8 rounded-lg flex items-center justify-center group-hover:bg-[#15368A] transition-colors duration-300">
                  <Car className="w-5 h-5 text-[#15368A] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-800 leading-tight">{vehicle.brand}</h3>
                  <p className="text-xs text-neutral-400">
                    {vehicle.vehicle_model} · {vehicle.year}
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-50 text-[#15368A] border-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                {vehicle.vehicle_type || 'Vehicle'}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-neutral-50 px-3 py-2.5 rounded-lg border border-neutral-100/80">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Plate</p>
                <p className="text-xs font-bold text-[#15368A]">{vehicle.registration_number}</p>
              </div>
              <div className="bg-neutral-50 px-3 py-2.5 rounded-lg border border-neutral-100/80">
                <div className="flex items-center gap-1 mb-0.5">
                  <Fuel className="w-2.5 h-2.5 text-amber-500" />
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Fuel</p>
                </div>
                <p className="text-xs font-bold text-neutral-700">{vehicle.fuel_type || 'Petrol'}</p>
              </div>
              <div className="bg-neutral-50 px-3 py-2.5 rounded-lg border border-neutral-100/80">
                <div className="flex items-center gap-1 mb-0.5">
                  <Gauge className="w-2.5 h-2.5 text-emerald-500" />
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Daily</p>
                </div>
                <p className="text-xs font-bold text-neutral-700">{vehicle.daily_travel || '—'} km</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-1.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onEdit(vehicle)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-[#15368A] bg-[#15368A]/5 hover:bg-[#15368A]/10 rounded-md transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => onDelete(vehicle._id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-[#15368A]/15 rounded-xl bg-[#15368A]/[0.02]">
            <Car className="w-8 h-8 text-[#15368A]/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-neutral-400">No vehicles registered yet</p>
            <p className="text-xs text-neutral-300 mt-1">Tap "Add Vehicle" to register your first one.</p>
          </div>
        )}
      </div>
    </section>
  );
};
