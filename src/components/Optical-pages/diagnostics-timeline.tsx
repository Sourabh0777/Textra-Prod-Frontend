'use client';

import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { Trash2 } from 'lucide-react';

interface DiagnosticsTimelineProps {
  isPrescriptionsLoading: boolean;
  prescriptions: any[] | undefined;
  setPreviewModalImage: (url: string | null) => void;
  handleDeletePrescription: (id: string) => void;
}

export function DiagnosticsTimeline({
  isPrescriptionsLoading,
  prescriptions,
  setPreviewModalImage,
  handleDeletePrescription,
}: DiagnosticsTimelineProps) {
  return (
    <Card className="p-2 border border-slate-100 shadow-sm rounded-lg bg-white space-y-1.5">
      <div className="flex items-center justify-between border-b border-slate-50 pb-1">
        <span className="font-extrabold text-[9px] text-slate-400 uppercase tracking-wider">Diagnostic History</span>
        <span className="text-[9.5px] font-bold text-[#15368A] bg-blue-50 px-1 rounded-sm">
          {prescriptions?.length || 0} Logs
        </span>
      </div>

      <div className="space-y-1 max-h-[38vh] overflow-y-auto divide-y divide-slate-50">
        {isPrescriptionsLoading ? (
          <div className="py-6 flex items-center justify-center">
            <Loader />
          </div>
        ) : prescriptions && prescriptions.length > 0 ? (
          prescriptions.map((pres) => {
            const starsCount = pres.price_category === '3 star' ? 3 : pres.price_category === '2 star' ? 2 : 1;
            const specLabel =
              pres.spectacle_type === 'single'
                ? 'Single'
                : pres.spectacle_type === 'kt'
                  ? 'Bifocal'
                  : pres.spectacle_type === 'progressive'
                    ? 'Progressive'
                    : 'Contact';

            return (
              <div
                key={pres._id}
                className="py-1 flex items-center justify-between gap-2 hover:bg-slate-50 rounded transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0" onClick={() => setPreviewModalImage(pres.image_url)}>
                  {/* Thumbnail */}
                  <div className="w-7 h-9 bg-white border border-slate-200 rounded overflow-hidden shadow-xxs cursor-pointer relative flex items-center justify-center shrink-0">
                    <img src={pres.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>

                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-1 flex-wrap leading-none">
                      <span className="text-[9.5px] font-extrabold text-[#15368A] bg-blue-50 px-1 rounded-sm leading-none py-0.5">
                        {specLabel}
                      </span>
                      <span className="text-amber-500 leading-none text-[9.5px] tracking-tighter shrink-0 select-none">
                        {Array.from({ length: starsCount }).map((_, i) => '★')}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[8.5px] leading-tight mt-0.5">
                      {new Date(pres.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePrescription(pres._id)}
                  className="p-1 text-slate-300 hover:text-rose-500 rounded shrink-0 transition-colors"
                  title="Delete Log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-slate-400 text-[10.5px] font-medium border border-dashed border-slate-100 rounded-md bg-slate-50/50">
            No prescription history. Log the first above!
          </div>
        )}
      </div>
    </Card>
  );
}
