'use client';

import { useState } from 'react';
import { 
  useFetchOpticalCustomersQuery, 
  useCreateOpticalCustomerMutation, 
  useFetchPrescriptionsQuery, 
  useCreatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useDeleteOpticalCustomerMutation
} from '@/lib/api/endpoints/opticals/opticalApi';
import { toast } from 'sonner';

export function useOpticalDashboard() {
  // RTK Query hooks
  const { data: customers, isLoading: isCustomersLoading } = useFetchOpticalCustomersQuery();
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateOpticalCustomerMutation();
  const [createPrescription, { isLoading: isSavingPrescription }] = useCreatePrescriptionMutation();
  const [deletePrescription] = useDeletePrescriptionMutation();
  const [deleteCustomer] = useDeleteOpticalCustomerMutation();

  // Search, selections & modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // New customer form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // New prescription form state
  const [spectacleType, setSpectacleType] = useState<'single' | 'kt' | 'progressive' | 'contact'>('single');
  const [priceCategory, setPriceCategory] = useState<'1 star' | '2 star' | '3 star'>('1 star');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Fetch prescriptions for active customer if selected
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useFetchPrescriptionsQuery(activeCustomerId || '', {
    skip: !activeCustomerId
  });

  const activeCustomer = customers?.find((c: any) => c._id === activeCustomerId);

  // Handle live search matching
  const filteredCustomers = customers?.filter((c: any) => {
    const term = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(term) || (c.phone_number && c.phone_number.includes(term));
  });

  // Handle registration of new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      toast.error('Please enter customer name.');
      return;
    }
    if (!newCustPhone.trim()) {
      toast.error('Please enter phone number.');
      return;
    }

    try {
      const result = await createCustomer({
        name: newCustName.trim(),
        phone_number: newCustPhone.trim()
      }).unwrap();
      
      toast.success('Customer registered successfully!');
      setNewCustName('');
      setNewCustPhone('');
      
      // Auto-select the newly created customer
      if (result?._id) {
        setActiveCustomerId(result._id);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to register customer.');
    }
  };

  // Convert uploaded image to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Image size must be less than 50MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new prescription pad
  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomerId) {
      toast.error('Please select a customer first.');
      return;
    }
    if (!imageBase64) {
      toast.error('Please capture/upload the prescription pad photo.');
      return;
    }

    try {
      await createPrescription({
        customer_id: activeCustomerId,
        spectacle_type: spectacleType,
        price_category: priceCategory,
        image_base64: imageBase64
      }).unwrap();

      toast.success('Prescription pad logged successfully!');
      // Reset form states
      setImagePreview(null);
      setImageBase64(null);
      setSpectacleType('single');
      setPriceCategory('1 star');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to record prescription.');
    }
  };

  // Delete a customer
  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"? This will soft delete all their records.`)) {
      return;
    }
    try {
      await deleteCustomer(id).unwrap();
      toast.success('Customer profile deleted.');
      if (activeCustomerId === id) {
        setActiveCustomerId(null);
      }
    } catch (err: any) {
      toast.error('Failed to delete customer.');
    }
  };

  // Delete a logged prescription
  const handleDeletePrescription = async (presId: string) => {
    if (!confirm('Are you sure you want to delete this prescription log?')) {
      return;
    }
    try {
      await deletePrescription(presId).unwrap();
      toast.success('Prescription log deleted.');
    } catch (err: any) {
      toast.error('Failed to delete prescription log.');
    }
  };

  return {
    customers,
    isCustomersLoading,
    activeCustomerId,
    setActiveCustomerId,
    previewModalImage,
    setPreviewModalImage,
    searchQuery,
    setSearchQuery,
    newCustName,
    setNewCustName,
    newCustPhone,
    setNewCustPhone,
    spectacleType,
    setSpectacleType,
    priceCategory,
    setPriceCategory,
    imagePreview,
    setImagePreview,
    imageBase64,
    setImageBase64,
    prescriptions,
    isPrescriptionsLoading,
    activeCustomer,
    filteredCustomers,
    isCreatingCustomer,
    isSavingPrescription,
    handleAddCustomer,
    handleFileChange,
    handleSavePrescription,
    handleDeleteCustomer,
    handleDeletePrescription,
  };
}
