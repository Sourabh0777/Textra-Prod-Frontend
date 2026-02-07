'use client';

import { PhoneOff, CalendarX, UserX, CheckCircle2 } from 'lucide-react';

export function ProblemSolutionSection() {
  const points = [
    {
      problem: 'Manual Phone Calls',
      solution: 'Stop wasting hours on the phone. Our system automates your reminders.',
      icon: <PhoneOff className="w-8 h-8 text-red-500" />,
      color: 'red',
    },
    {
      problem: 'Costly No-Shows',
      solution: 'Drastically reduce missed appointments and lost revenue with timely WhatsApp alerts.',
      icon: <CalendarX className="w-8 h-8 text-red-500" />,
      color: 'red',
    },
    {
      problem: 'Poor Customer Communication',
      solution: 'Keep your customers happy and informed with professional, reliable notifications.',
      icon: <UserX className="w-8 h-8 text-red-500" />,
      color: 'red',
    },
  ];

  return (
    <section className="py-24 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
            Built for Businesses, <span className="text-blue-600">Expanding Features Soon.</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Tired of missed appointments and the endless back-and-forth of reminder calls? We get it. That&apos;s why we
            built a solution that works for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {point.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#15368A] transition-colors">
                    {point.problem}
                  </h3>
                  <div className="flex items-start gap-2 pt-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-600 leading-relaxed italic">{point.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
