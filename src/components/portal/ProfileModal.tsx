'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileFormValues) => void;
  initialData?: any;
  isLoading?: boolean;
}

export const ProfileModal = ({ isOpen, onClose, onSave, initialData, isLoading }: ProfileModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || { name: '', email: '' }
  });

  React.useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <form onSubmit={handleSubmit(onSave)} className="space-y-6 p-1">
        <div className="space-y-4">
           <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Full Name</Label>
              <Input {...register('name')} className="h-12 rounded-xl text-sm" />
              {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.name.message}</p>}
           </div>
           <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest ml-1">Email Address</Label>
              <Input {...register('email')} className="h-12 rounded-xl text-sm" />
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email.message}</p>}
           </div>

           <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex gap-3">
              <AlertCircle className="w-4 h-4 text-[#15368A] shrink-0" />
              <p className="text-[10px] font-medium text-neutral-500 leading-relaxed">
                Registered mobile <span className="font-bold">{initialData?.phone_number}</span> is locked for security. 
                Contact support for changes.
              </p>
           </div>
        </div>

        <div className="flex gap-3 pt-4">
           <Button type="button" variant="secondary" className="flex-1 h-12 rounded-xl text-sm" onClick={onClose}>Back</Button>
           <Button type="submit" className="flex-1 h-12 bg-[#15368A] text-white rounded-xl font-bold text-sm" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm Changes'}
           </Button>
        </div>
      </form>
    </Modal>
  );
};
