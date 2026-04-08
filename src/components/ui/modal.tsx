'use client';

import type React from 'react';

import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: (e: React.FormEvent) => void;
  confirmText?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ModalHeader({
  title,
  onClose,
  className = '',
}: {
  title: string;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`px-4 md:px-6 py-4 border-b border-neutral-200 flex justify-between items-center sticky top-0 bg-white z-10 ${className}`}
    >
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      {onClose && (
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl transition-colors">
          ×
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 md:px-6 py-4 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`px-4 md:px-6 py-4 border-t border-neutral-200 flex justify-end gap-2 sticky bottom-0 bg-white z-10 ${className}`}
    >
      {children}
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Save',
  loading = false,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}>
        {title && <ModalHeader title={title} onClose={onClose} />}
        {title || onConfirm ? <ModalBody>{children}</ModalBody> : children}
        {onConfirm && (
          <ModalFooter>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={onConfirm} loading={loading} disabled={loading}>
              {confirmText}
            </Button>
          </ModalFooter>
        )}
      </div>
    </div>
  );
}
