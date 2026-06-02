'use client';

import { useState } from 'react';
import { useUpdateOpticalCustomerMutation } from '@/lib/api/endpoints/opticals/opticalApi';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';

interface ActiveCustomerHeaderProps {
  id: string;
  name: string;
  phoneNumber: string;
  onClear: () => void;
}

export function ActiveCustomerHeader({ id, name, phoneNumber, onClear }: ActiveCustomerHeaderProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phoneNumber);

  const [updateCustomer, { isLoading: isUpdating }] = useUpdateOpticalCustomerMutation();

  const handleOpenEdit = () => {
    setEditName(name);
    setEditPhone(phoneNumber);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!editPhone.trim()) {
      toast.error('Phone number cannot be empty');
      return;
    }

    try {
      await updateCustomer({
        id,
        data: {
          name: editName.trim(),
          phone_number: editPhone.trim(),
        },
      }).unwrap();
      
      toast.success('Customer details updated successfully!');
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update customer details.');
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-100 p-1.5 px-2 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in duration-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 bg-blue-100 text-[#15368A] rounded-md flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-800 text-[12px] truncate leading-tight">{name}</div>
            <div className="text-slate-500 text-[10.5px] font-medium leading-tight">{phoneNumber}</div>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={handleOpenEdit}
            className="text-[9.5px] font-bold text-[#15368A] bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
          >
            Edit Details
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-[9.5px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
          >
            Change Customer
          </button>
        </div>
      </div>

      {isEditOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 z-[9999] animate-in fade-in duration-200"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="bg-white border border-slate-100 max-w-sm w-full rounded-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 text-[13px]">Edit Customer Details</span>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#15368A] focus:bg-white text-[12px] p-2 rounded-md outline-none transition-all font-semibold text-slate-800"
                  placeholder="Customer Name"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#15368A] focus:bg-white text-[12px] p-2 rounded-md outline-none transition-all font-semibold text-slate-800"
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="text-[11px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="text-[11px] font-bold text-white bg-[#15368A] hover:bg-[#1f47ad] px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 disabled:opacity-70"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

