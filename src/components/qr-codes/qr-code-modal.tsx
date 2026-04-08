import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IQRCode } from '@/types';
import { Copy, Download, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

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

          {isEditMode && (
            <div className="pt-4 border-t border-neutral-100 space-y-6">
              {formData.qr_image_url && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-700">QR Code Preview</label>
                  <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <img
                      src={formData.qr_image_url}
                      alt="QR Code"
                      className="w-48 h-48 rounded-lg bg-white p-2 border border-neutral-100 shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = formData.qr_image_url || '';
                        link.download = `qr-code-${formData.code || formData.qr_id}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Image
                    </Button>
                  </div>
                </div>
              )}

              {formData.deep_link_url && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Deep Link URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-neutral-400" />
                      </div>
                      <Input value={formData.deep_link_url} readOnly className="pl-10 pr-10" fullWidth />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(formData.deep_link_url || '');
                        toast.success('URL copied to clipboard');
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Use this direct link to open the WhatsApp chat with the prefilled message.
                  </p>
                </div>
              )}
            </div>
          )}
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
