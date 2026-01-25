import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/lib/providers';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bike Service CRM',
  description: 'Manage your bike service business with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} dynamic>
      <ReduxProvider>
        <html lang="en">
          <body className={`${inter.variable} antialiased`}>
            {children}
            <Toaster richColors position="top-right" />
          </body>
        </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}
