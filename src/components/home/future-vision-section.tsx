'use client';

import { Stethoscope, Scissors, Sparkles, Car, Utensils, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function FutureVisionSection() {
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('Dental Clinic');
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    { name: 'Dental & Medical Clinics', icon: <Stethoscope className="w-5 h-5" /> },
    { name: 'Salons & Spas', icon: <Scissors className="w-5 h-5" /> },
    { name: 'Garages & Auto Shops', icon: <Car className="w-5 h-5" /> },
    { name: 'And many more!', icon: <Sparkles className="w-5 h-5 text-yellow-500" /> },
  ];

  // const onformSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Form submitted!'); // Placeholder for form submission logic
  //   console.log(e);
  // };

  // In your form component (where the "Join Waitlist" button is)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/waitlist/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Success! Check your email.');
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Powering More <br />
              <span className="text-blue-300">Businesses Soon.</span>
            </h2>
            <p className="text-lg text-blue-100/80 leading-relaxed max-w-xl">
              We&apos;re focused on providing the best automated reminder platform for a wide range of appointment-based
              businesses. Textra helps you save time and grow faster.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    {industry.icon}
                  </div>
                  <span className="font-medium text-sm text-blue-50">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-neutral-900 shadow-2xl space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Stay Updated</h3>
              <p className="text-neutral-500">Join our waitlist to be notified when we expand to your industry!</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Your Industry</label>
                <select value={industry}
      onChange={(e) => setIndustry(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                  <option>Dental Clinic</option>
                  <option>Salon / Spa</option>
                  <option>Medical Services</option>
                  <option>Other</option>
                </select>
              </div>
              <Button type="submit"
    disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-6 font-bold shadow-lg shadow-blue-900/10 transition-all hover:scale-[1.02]">
                {isLoading ? 'Submitting...' : 'Join the Waitlist'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
