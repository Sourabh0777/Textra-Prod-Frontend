import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="text-xl font-bold text-[#15368A]">BikeService CRM</div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">{children}</main>

      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} BikeService CRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
