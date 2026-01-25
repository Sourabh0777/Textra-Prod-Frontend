'use client';

import type React from 'react';

import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: (e: React.FormEvent) => void;
  confirmText?: string;
  loading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Save',
  loading = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 md:px-6 py-4 border-b border-neutral-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-400 hover:text-neutral-600 text-xl disabled:opacity-50"
          >
            ×
          </button>
        </div>
        <div className="px-4 md:px-6 py-4">{children}</div>
        <div className="px-4 md:px-6 py-4 border-t border-neutral-200 flex justify-end gap-2 sticky bottom-0 bg-white z-10">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm} loading={loading} disabled={loading}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
