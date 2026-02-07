'use client';

import Link from 'next/link';
import Image from 'next/image';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo/logo.png" alt="Textra Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold text-primary">Textra</span>
            </Link>
            <p className="text-neutral-500 max-w-sm leading-relaxed">
              Automated WhatsApp reminders for businesses. Reduce no-shows and boost repeat business with ease.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-500 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-500 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-500 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-neutral-400 text-sm">&copy; {currentYear} Textra. All rights reserved.</p>
          <p className="text-neutral-400 text-[10px] max-w-md leading-tight italic">
            Disclaimer: Textra is an independent service provider and is not an official partner of, or endorsed by,
            WhatsApp or Meta.
          </p>
        </div>
      </div>
    </footer>
  );
}
