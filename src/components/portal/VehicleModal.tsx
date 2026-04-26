'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const vehicleSchema = z.object({
  vehicle_type: z.enum(['BIKE', 'SCOOTER', 'CAR']),
  brand: z.string().min(1, 'Brand is required'),
  vehicle_model: z.string().min(1, 'Model is required'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  registration_number: z.string().min(5, 'Invalid plate number'),
  year: z.number().min(1900).max(new Date().getFullYear()),
  daily_travel: z.number().min(1).max(1000),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VehicleFormValues) => void;
  initialData?: any;
  isLoading?: boolean;
}

export const VehicleModal = ({ isOpen, onClose, onSave, initialData, isLoading }: VehicleModalProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || { vehicle_type: 'BIKE', year: new Date().getFullYear(), daily_travel: 30 }
  });

  React.useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const vehicleType = watch('vehicle_type');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Update Vehicle' : 'Add New Vehicle'}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {['BIKE', 'SCOOTER', 'CAR'].map(type => (
                <button 
                  key={type} 
                  type="button" 
                  onClick={() => setValue('vehicle_type', type as any)}
                  className={`h-10 rounded-lg text-xs font-bold transition-all border ${vehicleType === type ? 'border-[#15368A] bg-[#15368A]/5 text-[#15368A]' : 'border-neutral-100 text-neutral-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Brand</Label>
            <Input {...register('brand')} className="h-10 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Model</Label>
            <Input {...register('vehicle_model')} className="h-10 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Plate No</Label>
            <Input {...register('registration_number')} className="h-10 text-sm uppercase" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Year</Label>
            <Input type="number" {...register('year', { valueAsNumber: true })} className="h-10 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Fuel</Label>
            <Input {...register('fuel_type')} className="h-10 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">KM/Day</Label>
            <Input type="number" {...register('daily_travel', { valueAsNumber: true })} className="h-10 text-sm" />
          </div>
        </div>
        <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
          <Button type="button" variant="secondary" className="flex-1 h-12 rounded-xl text-sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1 h-12 bg-[#15368A] text-white rounded-xl font-bold text-sm" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Data'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
