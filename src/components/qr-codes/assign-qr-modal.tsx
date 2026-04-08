import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { useFetchBusinessesWithoutQRQuery } from '@/lib/api/endpoints/qrCodeApi';
import { IQRCode } from '@/types';
import { Loader2 } from 'lucide-react';

interface AssignQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: IQRCode | null;
  onAssign: (businessId: string) => Promise<void>;
  isAssigning: boolean;
}

export function AssignQRCodeModal({ isOpen, onClose, qrCode, onAssign, isAssigning }: AssignQRCodeModalProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const { data: businesses, isLoading } = useFetchBusinessesWithoutQRQuery(undefined, {
    skip: !isOpen,
  });

  const handleSave = async () => {
    if (selectedBusinessId) {
      await onAssign(selectedBusinessId);
      setSelectedBusinessId(null);
    }
  };

  const businessOptions = (businesses || []).map((b) => ({
    _id: b._id,
    displayLabel: `${b.business_name} (${b.phone_number})`,
    phone: b.phone_number,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader title="Connect Business to QR Code" onClose={onClose} />
      <ModalBody>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm font-medium text-neutral-700">QR Code Details</p>
            <p className="text-xs text-neutral-500 mt-1">ID: {qrCode?.qr_id}</p>
            <p className="text-xs text-neutral-500">Code: {qrCode?.code}</p>
          </div>

          <div className="space-y-2">
            <SearchableDropdown
              options={businessOptions}
              label="displayLabel"
              id="_id"
              searchKey="phone"
              selectedVal={selectedBusinessId}
              handleChange={(val) => setSelectedBusinessId(val)}
              fieldLabel="Select Business"
              placeholder="Search business by phone number..."
              fullWidth
            />
            <p className="text-xs text-neutral-500">Only businesses without an assigned QR code are shown.</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isAssigning}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!selectedBusinessId || isAssigning || isLoading}
          className="min-w-[100px]"
        >
          {isAssigning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
