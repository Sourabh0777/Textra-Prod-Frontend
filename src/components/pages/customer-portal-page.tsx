'use client';

import React, { useState } from 'react';
import { useCustomerPortal } from '@/lib/hooks/use-customer-portal';
import {
  useUpdatePortalProfileMutation,
  useAddPortalVehicleMutation,
  useUpdatePortalVehicleMutation,
  useDeletePortalVehicleMutation,
} from '@/lib/api/endpoints/portalCustomerApi';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Modular Components
import { PortalHeader } from '@/components/portal/PortalHeader';
import { PortalHero } from '@/components/portal/PortalHero';
import { PortalStats } from '@/components/portal/PortalStats';
import { PortalGarage } from '@/components/portal/PortalGarage';
import { PortalTimeline } from '@/components/portal/PortalTimeline';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalFooter } from '@/components/portal/PortalFooter';
import { VehicleModal } from '@/components/portal/VehicleModal';
import { ProfileModal } from '@/components/portal/ProfileModal';

export default function CustomerPortalPage() {
  const { customerDetails, loading, error, uid, refetch } = useCustomerPortal();

  // Mutations
  const [updatePortalProfile, { isLoading: isUpdatingProfile }] = useUpdatePortalProfileMutation();
  const [addVehicle, { isLoading: isAddingVehicle }] = useAddPortalVehicleMutation();
  const [updateVehicle, { isLoading: isUpdatingVehicle }] = useUpdatePortalVehicleMutation();
  const [deleteVehicle, { isLoading: isDeletingVehicle }] = useDeletePortalVehicleMutation();

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const onUpdateProfile = async (data: any) => {
    try {
      await updatePortalProfile({ uid, data }).unwrap();
      toast.success('Profile updated');
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const onSaveVehicle = async (data: any) => {
    try {
      if (editingVehicle?._id) {
        await updateVehicle({ uid, vehicleId: editingVehicle._id, data }).unwrap();
        toast.success('Vehicle updated');
      } else {
        await addVehicle({ uid, data }).unwrap();
        toast.success('Vehicle added');
      }
      setIsVehicleModalOpen(false);
      refetch();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const onDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Remove this vehicle?')) return;
    try {
      await deleteVehicle({ uid, vehicleId }).unwrap();
      toast.success('Vehicle removed');
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Delete failed');
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Portal...</p>
      </div>
    );

  if (error || !customerDetails)
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-neutral-50 text-center">
        <div className="max-w-xs space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Invalid Portal Link</h2>
          <p className="text-sm text-neutral-400">Please contact support or check your link again.</p>
        </div>
      </div>
    );

  const { customer, vehicles, services, reminders } = customerDetails;
  const nextService = reminders?.filter((r: any) => r.status === 'pending')[0];
  const businessName = (customer.business_id as any)?.business_name;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-800">
      <PortalHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
        <PortalHero customerName={customer.name} businessName={businessName} nextService={nextService} />

        <PortalStats vehicleCount={vehicles.length} serviceCount={services.length} reminderCount={reminders.length} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-12">
            <PortalGarage
              vehicles={vehicles}
              onAdd={() => {
                setEditingVehicle(null);
                setIsVehicleModalOpen(true);
              }}
              onEdit={(v) => {
                setEditingVehicle(v);
                setIsVehicleModalOpen(true);
              }}
              onDelete={onDeleteVehicle}
            />
            <PortalTimeline services={services} businessName={businessName} />
          </div>

          <div className="lg:col-span-4">
            <PortalSidebar customer={customer} onEditProfile={() => setIsEditModalOpen(true)} />
          </div>
        </div>
      </main>

      <PortalFooter businessName={businessName} />

      {/* Modals */}
      <ProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdateProfile}
        initialData={customer}
        isLoading={isUpdatingProfile}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={onSaveVehicle}
        initialData={editingVehicle}
        isLoading={isAddingVehicle || isUpdatingVehicle}
      />
    </div>
  );
}
