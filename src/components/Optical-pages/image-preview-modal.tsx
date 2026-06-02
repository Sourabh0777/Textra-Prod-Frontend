'use client';

import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  previewModalImage: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({ previewModalImage, onClose }: ImagePreviewModalProps) {
  if (!previewModalImage) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 z-[9999] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-100 max-w-sm w-full rounded-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 border-b border-slate-50 flex items-center justify-between">
          <span className="font-extrabold text-slate-800 text-[11px]">Prescription Sheet Viewer</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-2 bg-slate-100 flex items-center justify-center min-h-[250px]">
          <img
            src={previewModalImage}
            alt="Prescription Sheet"
            className="max-h-[60vh] object-contain rounded shadow bg-white"
          />
        </div>
      </div>
    </div>
  );
}
