'use client';

import { Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

interface CustomerDirectoryProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  newCustName: string;
  setNewCustName: (val: string) => void;
  newCustPhone: string;
  setNewCustPhone: (val: string) => void;
  nameError?: string | null;
  phoneError?: string | null;
  isCreatingCustomer: boolean;
  handleAddCustomer: (e: React.FormEvent) => void;
  isCustomersLoading: boolean;
  filteredCustomers: any[];
  setActiveCustomerId: (id: string) => void;
  handleDeleteCustomer: (id: string, name: string) => void;
}

export function CustomerDirectory({
  searchQuery,
  setSearchQuery,
  newCustName,
  setNewCustName,
  newCustPhone,
  setNewCustPhone,
  nameError,
  phoneError,
  isCreatingCustomer,
  handleAddCustomer,
  isCustomersLoading,
  filteredCustomers,
  setActiveCustomerId,
  handleDeleteCustomer,
}: CustomerDirectoryProps) {
  return (
    <div className="space-y-1.5 animate-in fade-in duration-200">
      {/* Search & Add Inline Box */}
      <div className="bg-white border border-slate-100 p-2 rounded-lg flex flex-col gap-1.5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or phone..."
            className="pl-8 h-7.5 text-xs rounded-md border-slate-200 focus-visible:ring-[#15368A]"
          />
        </div>

        <div className="border-t border-slate-100 pt-1.5">
          <form onSubmit={handleAddCustomer} className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <Input
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="New Customer Name"
                className={`h-7.5 text-xs rounded-md transition-all flex-1 px-2 ${
                  nameError
                    ? 'border-rose-400 bg-rose-50/10 text-rose-900 focus-visible:ring-rose-400 placeholder:text-rose-300'
                    : 'border-slate-200 focus-visible:ring-[#15368A]'
                }`}
              />
              <Input
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="Phone"
                type="tel"
                className={`h-7.5 text-xs rounded-md transition-all w-24 px-2 ${
                  phoneError
                    ? 'border-rose-400 bg-rose-50/10 text-rose-900 focus-visible:ring-rose-400 placeholder:text-rose-300'
                    : 'border-slate-200 focus-visible:ring-[#15368A]'
                }`}
              />
              <Button
                type="submit"
                disabled={isCreatingCustomer}
                className="bg-[#15368A] hover:bg-[#0f286b] h-7.5 px-2.5 rounded-md text-[10px] font-bold shrink-0"
              >
                {isCreatingCustomer ? '...' : '+ Add'}
              </Button>
            </div>

            {/* Inline Error Helper Messages */}
            {(nameError || phoneError) && (
              <div className="flex flex-col gap-0.5 px-1 pt-0.5 animate-in slide-in-from-top-1 duration-150">
                {nameError && (
                  <span className="text-[9.5px] font-extrabold text-rose-500 flex items-center gap-1">
                    ⚠️ Name: {nameError}
                  </span>
                )}
                {phoneError && (
                  <span className="text-[9.5px] font-extrabold text-rose-500 flex items-center gap-1">
                    ⚠️ Phone: {phoneError}
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* High Density Customer List */}
      <div className="bg-white border border-slate-100 rounded-lg p-1 shadow-sm max-h-[78vh] overflow-y-auto divide-y divide-slate-50">
        {isCustomersLoading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader />
          </div>
        ) : filteredCustomers && filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => (
            <div
              key={cust._id}
              onClick={() => setActiveCustomerId(cust._id)}
              className="p-2.5 rounded-md flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="min-w-0 flex items-baseline gap-1.5">
                <span className="font-extrabold text-slate-800 text-[12px] truncate">{cust.name}</span>
                <span className="text-slate-400 text-[10.5px] truncate">({cust.phone_number})</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCustomer(cust._id, cust.name);
                }}
                className="p-1 text-slate-300 hover:text-rose-500 rounded-md shrink-0 transition-colors"
                title="Delete profile"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-[11px] font-bold">
            No customers found. Register above!
          </div>
        )}
      </div>
    </div>
  );
}
