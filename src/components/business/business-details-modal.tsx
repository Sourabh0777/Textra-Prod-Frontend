/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { IBusiness, IBusinessType, IState, IZone } from '@/types';

interface BusinessDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IBusiness>;
  errors: Record<string, string>;
  businessTypes: IBusinessType[];
  states?: IState[];
  zones?: IZone[];
  submitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BusinessDetailsModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  businessTypes,
  states,
  zones,
  submitting,
  onInputChange,
  onSubmit,
}: BusinessDetailsModalProps) {
  const handleCopyDeepLink = () => {
    if (formData.qr?.deep_link_url) {
      navigator.clipboard.writeText(formData.qr.deep_link_url);
      toast.success('Deep link URL copied to clipboard!');
    }
  };

  const handleDownloadQR = async () => {
    if (!formData.qr?.qr_image_url) return;

    try {
      const response = await fetch(formData.qr.qr_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${formData.business_name || 'business'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link if fetch fails
      const link = document.createElement('a');
      link.href = formData.qr.qr_image_url;
      link.download = `qr-${formData.business_name || 'business'}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Business Details' : 'Add New Business'}
      onConfirm={onSubmit}
      confirmText={isEditMode ? 'Update Details' : 'Add Business'}
      loading={submitting}
    >
      <div className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <Select
            label="Business Type *"
            name="business_type_id"
            value={
              typeof formData.business_type_id === 'object'
                ? (formData.business_type_id as any)?._id
                : (formData.business_type_id as any) || ''
            }
            onChange={onInputChange}
            options={businessTypes.map((type: IBusinessType) => ({
              value: type._id || '',
              label: type.name,
            }))}
            error={errors.business_type_id}
            fullWidth
          />
          <Input
            label="Business Name *"
            name="business_name"
            value={formData.business_name || ''}
            onChange={onInputChange}
            error={errors.business_name}
            fullWidth
          />
          <Input
            label="Owner Name *"
            name="owner_name"
            value={formData.owner_name || ''}
            onChange={onInputChange}
            error={errors.owner_name}
            fullWidth
          />
          <Input
            label="Email (Optional)"
            name="email"
            value={formData.email || ''}
            onChange={onInputChange}
            error={errors.email}
            fullWidth
          />
          <Input
            label="City *"
            name="city"
            value={formData.city || ''}
            onChange={onInputChange}
            error={errors.city}
            fullWidth
          />
          <Select
            label="State *"
            name="state_id"
            value={
              typeof formData.state_id === 'object' ? (formData.state_id as any)?._id : (formData.state_id as any) || ''
            }
            onChange={onInputChange}
            options={
              states?.map((s) => ({
                value: s._id || '',
                label: s.name,
              })) || []
            }
            error={errors.state_id}
            fullWidth
          />
          <Select
            label="Zone *"
            name="zone_id"
            value={
              typeof formData.zone_id === 'object' ? (formData.zone_id as any)?._id : (formData.zone_id as any) || ''
            }
            onChange={onInputChange}
            options={
              zones?.map((z) => ({
                value: z._id || '',
                label: z.name,
              })) || []
            }
            error={errors.zone_id}
            fullWidth
          />
          <Input
            label="Address *"
            name="address"
            value={formData.address || ''}
            onChange={onInputChange}
            error={errors.address}
            fullWidth
          />
          <Input
            label="Phone Number *"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onInputChange}
            error={errors.phone_number}
            fullWidth
          />

          {isEditMode && formData.qr && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">QR Code Details</h3>
              <div className="space-y-4">
                {formData.qr.qr_image_url && (
                  <div className="flex flex-col items-center gap-3 mb-4 p-4 bg-white border border-neutral-200 rounded-lg shadow-sm">
                    <img src={formData.qr.qr_image_url} alt="Business QR Code" className="w-48 h-48 object-contain" />
                    <Button type="button" variant="secondary" size="sm" onClick={handleDownloadQR} className="gap-2">
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <Input label="QR Code" value={formData.qr.code || ''} disabled fullWidth />
                  <Input label="Prefilled Message" value={formData.qr.prefilled_message || ''} disabled fullWidth />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-end gap-2">
                      <div className="flex-grow">
                        <Input label="Deep Link URL" value={formData.qr.deep_link_url || ''} disabled fullWidth />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCopyDeepLink}
                        className="h-[42px] px-3"
                        title="Copy Deep Link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
