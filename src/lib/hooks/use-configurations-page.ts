import { useState } from 'react';
import {
  useFetchStatesQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useFetchZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} from '@/lib/api/endpoints/configApi';
import { IState, IZone } from '@/types';
import { toastPromise } from '@/lib/toast-utils';
import { useUser } from '@clerk/nextjs';

export function useConfigurationsPage() {
  const { user: clerkUser, isLoaded } = useUser();

  // State for State Management
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<IState | null>(null);
  const [stateFormData, setStateFormData] = useState<Partial<IState>>({ name: '', is_active: true });

  // State for Zone Management
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<IZone | null>(null);
  const [zoneFormData, setZoneFormData] = useState<Partial<IZone>>({ name: '', is_active: true });

  const { data: states = [], isLoading: loadingStates } = useFetchStatesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });
  const { data: zones = [], isLoading: loadingZones } = useFetchZonesQuery(undefined, {
    skip: !isLoaded || !clerkUser,
  });

  const [createState] = useCreateStateMutation();
  const [updateState] = useUpdateStateMutation();
  const [deleteState] = useDeleteStateMutation();

  const [createZone] = useCreateZoneMutation();
  const [updateZone] = useUpdateZoneMutation();
  const [deleteZone] = useDeleteZoneMutation();

  // State Handlers
  const handleOpenStateModal = (state?: IState) => {
    if (state) {
      setEditingState(state);
      setStateFormData(state);
    } else {
      setEditingState(null);
      setStateFormData({ name: '', is_active: true });
    }
    setIsStateModalOpen(true);
  };

  const handleStateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingState?._id) {
        await toastPromise(updateState({ id: editingState._id, data: stateFormData }).unwrap(), {
          loading: 'Updating state...',
          success: 'State updated successfully',
          error: 'Failed to update state',
        });
      } else {
        await toastPromise(createState(stateFormData).unwrap(), {
          loading: 'Creating state...',
          success: 'State created successfully',
          error: 'Failed to create state',
        });
      }
      setIsStateModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteState = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        await toastPromise(deleteState(id).unwrap(), {
          loading: 'Deleting state...',
          success: 'State deleted successfully',
          error: 'Failed to delete state',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Zone Handlers
  const handleOpenZoneModal = (zone?: IZone) => {
    if (zone) {
      setEditingZone(zone);
      setZoneFormData({
        ...zone,
        state_id: typeof zone.state_id === 'object' ? zone.state_id._id : zone.state_id,
      });
    } else {
      setEditingZone(null);
      setZoneFormData({ name: '', state_id: '', is_active: true });
    }
    setIsZoneModalOpen(true);
  };

  const handleZoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingZone?._id) {
        await toastPromise(updateZone({ id: editingZone._id, data: zoneFormData }).unwrap(), {
          loading: 'Updating zone...',
          success: 'Zone updated successfully',
          error: 'Failed to update zone',
        });
      } else {
        await toastPromise(createZone(zoneFormData).unwrap(), {
          loading: 'Creating zone...',
          success: 'Zone created successfully',
          error: 'Failed to create zone',
        });
      }
      setIsZoneModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        await toastPromise(deleteZone(id).unwrap(), {
          loading: 'Deleting zone...',
          success: 'Zone deleted successfully',
          error: 'Failed to delete zone',
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return {
    states,
    loadingStates,
    zones,
    loadingZones,
    isStateModalOpen,
    setIsStateModalOpen,
    stateFormData,
    setStateFormData,
    handleOpenStateModal,
    handleStateSubmit,
    handleDeleteState,
    isZoneModalOpen,
    setIsZoneModalOpen,
    zoneFormData,
    setZoneFormData,
    handleOpenZoneModal,
    handleZoneSubmit,
    handleDeleteZone,
  };
}
