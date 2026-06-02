'use client';

interface ActiveCustomerHeaderProps {
  name: string;
  phoneNumber: string;
  onClear: () => void;
}

export function ActiveCustomerHeader({ name, phoneNumber, onClear }: ActiveCustomerHeaderProps) {
  return (
    <div className="bg-white border border-slate-100 p-1.5 px-2 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 bg-blue-100 text-[#15368A] rounded-md flex items-center justify-center font-bold text-xs uppercase shrink-0">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-slate-800 text-[12px] truncate leading-tight">
            {name}
          </div>
          <div className="text-slate-500 text-[10.5px] font-medium leading-tight">
            {phoneNumber}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-[9.5px] font-bold text-[#15368A] bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md shrink-0 transition-colors"
      >
        Change Customer
      </button>
    </div>
  );
}
