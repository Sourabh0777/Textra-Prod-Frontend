'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-5 pb-16 md:pt-5 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Whatsapp remminder Solution
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight leading-[1.1]">
              Reduce No-Shows and Boost Repeat Business with{' '}
              <span className="text-blue-600">Automated WhatsApp Reminders.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The effortless way for businesses to keep customers informed and their schedules full. Spend less time on
              the phone and more time on growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-7 text-lg rounded-2xl shadow-xl shadow-blue-200/50 transition-all hover:scale-105 active:scale-95 group"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="px-8 py-7 text-lg rounded-2xl text-neutral-600 hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all"
              >
                See How It Works
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-neutral-500 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p>Trusted by 50+ local shops</p>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 animate-float">
              {/* Stylized Mobile UI */}
              <div className="w-[280px] md:w-[320px] bg-white rounded-[3rem] p-4 shadow-2xl border-[8px] border-neutral-900 mx-auto">
                <div className="bg-whatsapp-dark rounded-2xl p-4 text-white space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs">WhatsApp Business</span>
                  </div>
                  <div className="bg-white text-neutral-800 rounded-xl p-3 shadow-sm text-xs leading-relaxed">
                    <p className="font-bold text-whatsapp-dark mb-1">Appointment Reminder</p>
                    Hi John! This is a reminder for your upcoming appointment tomorrow at 10 AM. Would you like to
                    confirm?
                  </div>
                  <div className="flex justify-end gap-2 text-[10px]">
                    <span className="bg-white/20 px-2 py-1 rounded">Reply</span>
                    <span className="bg-white/20 px-2 py-1 rounded font-bold">YES</span>
                  </div>
                </div>
                <div className="pt-8 pb-4 space-y-4">
                  <div className="h-4 w-3/4 bg-neutral-100 rounded-lg mx-auto" />
                  <div className="h-4 w-1/2 bg-neutral-100 rounded-lg mx-auto" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-100/50 rounded-full -z-10 animate-pulse" />
              <div
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100/50 rounded-full -z-10 animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
