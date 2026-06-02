'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface PrescriptionFormProps {
  spectacleType: 'single' | 'kt' | 'progressive' | 'contact';
  setSpectacleType: (type: 'single' | 'kt' | 'progressive' | 'contact') => void;
  priceCategory: '1 star' | '2 star' | '3 star';
  setPriceCategory: (cat: '1 star' | '2 star' | '3 star') => void;
  imagePreview: string | null;
  setImagePreview: (val: string | null) => void;
  setImageBase64: (val: string | null) => void;
  isSavingPrescription: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSavePrescription: (e: React.FormEvent) => void;
  setPreviewModalImage: (url: string | null) => void;
}

export function PrescriptionForm({
  spectacleType,
  setSpectacleType,
  priceCategory,
  setPriceCategory,
  imagePreview,
  setImagePreview,
  setImageBase64,
  isSavingPrescription,
  handleFileChange,
  handleSavePrescription,
  setPreviewModalImage,
}: PrescriptionFormProps) {
  return (
    <Card className="p-2 border border-slate-100 shadow-sm rounded-lg bg-white space-y-2">
      <div className="flex items-center justify-between border-b border-slate-50 pb-1">
        <span className="font-extrabold text-[9px] text-slate-400 uppercase tracking-wider">Prescription</span>
        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded-sm">Step 2 of 2</span>
      </div>

      <form onSubmit={handleSavePrescription} className="space-y-2">
        {/* Spectacle Type Buttons */}
        <div className="space-y-0.5">
          <Label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Spectacles Type</Label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: 'single', label: 'Single' },
              { key: 'kt', label: 'Bifocal' },
              { key: 'progressive', label: 'Progr.' },
              { key: 'contact', label: 'Contact' },
            ].map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setSpectacleType(type.key as any)}
                className={`py-1 px-0.5 rounded text-[10.5px] border flex items-center justify-center font-bold text-center transition-all ${
                  spectacleType === type.key
                    ? 'border-[#15368A] bg-blue-50 text-[#15368A] font-black shadow-xxs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Category Star Selection */}
        <div className="space-y-0.5">
          <Label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Price Category</Label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { key: '1 star', stars: 1, label: '< ₹1k' },
              { key: '2 star', stars: 2, label: '₹1k-2k' },
              { key: '3 star', stars: 3, label: '> ₹2k' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPriceCategory(item.key as any)}
                className={`py-1 px-1 rounded text-[10.5px] border flex items-center justify-between transition-all ${
                  priceCategory === item.key
                    ? 'border-[#15368A] bg-blue-50 text-[#15368A] font-black shadow-xxs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <span className="flex text-amber-500 shrink-0 select-none">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <span key={i} className="text-[9px]">
                      ★
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload / Camera Row */}
        <div className="space-y-0.5">
          <Label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Upload Photo</Label>
          <div className="flex gap-1.5 items-center">
            {!imagePreview ? (
              <div className="relative border border-dashed border-slate-200 hover:border-[#15368A]/40 rounded-md p-2 flex items-center justify-center bg-slate-50 flex-1 h-9.5 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Camera className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <span className="text-[10px] font-bold text-slate-600">Snap Doctors Pad</span>
              </div>
            ) : (
              <div className="relative rounded-md border border-slate-100 bg-slate-50 flex items-center justify-between p-1 flex-1 h-9.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-7.5 w-7.5 object-cover rounded border bg-white cursor-pointer"
                    onClick={() => setPreviewModalImage(imagePreview)}
                  />
                  <span className="text-[9.5px] font-bold text-emerald-600 truncate">Photo Captured</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-0.5 rounded border border-rose-100 text-[9px] font-bold transition-all shrink-0"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={isSavingPrescription || !imagePreview}
          className="w-full bg-[#15368A] hover:bg-[#0f286b] h-8 rounded-md text-[11px] font-bold shadow-xs disabled:bg-slate-100 disabled:text-slate-400 mt-1 transition-all"
        >
          {isSavingPrescription ? <span className="flex items-center justify-center gap-1">Saving...</span> : 'Save'}
        </Button>
      </form>
    </Card>
  );
}
