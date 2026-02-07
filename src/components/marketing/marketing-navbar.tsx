'use client';

import Link from 'next/link';
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
              <div className="w-8 h-8 bg-[#15368A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-[#15368A] hidden sm:block">BikeService CRM</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <Link href="/about" className="hover:text-[#15368A] transition-colors">
              About
            </Link>
            <Link href="#features" className="hover:text-[#15368A] transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-[#15368A] transition-colors">
              How it Works
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button className="bg-[#15368A] hover:bg-[#15368A]/90 text-white rounded-xl px-6">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-neutral-600 hover:text-[#15368A] font-medium px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-[#15368A] hover:bg-[#15368A]/90 text-white rounded-xl px-6 shadow-md transition-all hover:scale-105">
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
