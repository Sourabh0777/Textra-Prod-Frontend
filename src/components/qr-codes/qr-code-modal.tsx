import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IQRCode } from '@/types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: Partial<IQRCode>;
  errors: Record<string, string>;
  submitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function QRCodeModal({
  isOpen,
  onClose,
  isEditMode,
  formData,
  errors,
  submitting,
  onInputChange,
  onSubmit,
}: QRCodeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader title={isEditMode ? 'Update QR Code' : 'Create QR Code'} onClose={onClose} />
      <ModalBody>
        <form id="qr-code-form" onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">QR Code</label>
            <Input
              name="code"
              placeholder="Enter unique code (optional)"
              value={formData.code || ''}
              onChange={onInputChange}
              error={errors.code}
              fullWidth
            />
            <p className="text-xs text-neutral-500">The unique identifier for the QR code.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Prefilled Message</label>
            <Textarea
              name="prefilled_message"
              placeholder="Hello, I want to know more about..."
              value={formData.prefilled_message || ''}
              onChange={onInputChange}
              error={errors.prefilled_message}
              fullWidth
              rows={4}
            />
            <p className="text-xs text-neutral-500">
              The message that will be pre-filled in the user's WhatsApp when they scan the QR code.
            </p>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" form="qr-code-form" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
