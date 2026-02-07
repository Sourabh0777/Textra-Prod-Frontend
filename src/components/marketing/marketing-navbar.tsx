'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

export function MarketingNavbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/logo.png"
                alt="Textra Logo"
                width={150}
                height={10}
                className="rounded-lg object-contain"
              />
              {/* <span className="text-xl font-bold text-[#15368A] hidden sm:block">Textra</span> */}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary-dark text-white rounded-xl px-6">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-neutral-600 hover:text-primary font-medium px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-primary hover:bg-primary-dark text-white rounded-xl px-6 shadow-md transition-all hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
