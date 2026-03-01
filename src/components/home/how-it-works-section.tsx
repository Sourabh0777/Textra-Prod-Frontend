'use client';

import { Link2, Users, Coffee } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      title: 'Connect Your Account',
      description:
        'Securely link your WhatsApp Business Account to our platform with a few simple clicks. Our guided process makes it easy.',
      icon: <Link2 className="w-6 h-6 text-white" />,
      color: 'bg-blue-600',
    },
    {
      title: 'Add Customers & Service Dates',
      description:
        'Easily upload your customer list and their next service dates. Our platform keeps everything organized for you.',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-indigo-600',
    },
    {
      title: 'Relax and Let Us Handle the Reminders',
      description:
        "Our system automatically sends personalized, professional service reminders via WhatsApp at the perfect time. You don't have to lift a finger.",
      icon: <Coffee className="w-6 h-6 text-white" />,
      color: 'bg-primary',
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">Get Set Up in Minutes</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;ve streamlined the process so you can focus on what matters most—running your business.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[2.75rem] left-[10%] right-[10%] h-0.5 bg-neutral-100 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-6">
                <div
                  className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 ring-8 ring-white`}
                >
                  {step.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-500 leading-relaxed max-w-xs mx-auto text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
