import { constructMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Rocket, Lightbulb, ShieldCheck, Smile, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'About Us | Textra',
  description:
    'Learn more about Textra and our mission to modernize business communication through automated WhatsApp reminders.',
});

export default function AboutPage() {
  const values = [
    {
      title: 'Simplicity',
      description:
        'We believe powerful technology should be easy to use. Our platform is designed to be intuitive for everyone, regardless of technical skill.',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Reliability',
      description:
        'Your business depends on communication. We are committed to building a robust and dependable platform that you can count on, every single day.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Customer Success',
      description:
        'We succeed when you succeed. We are dedicated to providing outstanding support and building a tool that delivers real, measurable value to your business.',
      icon: <Smile className="w-6 h-6" />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Integrity',
      description:
        'We are committed to the highest standards of data privacy and security. Trust is at the core of everything we do.',
      icon: <Lock className="w-6 h-6" />,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Section 1: The Mission Statement */}
      <section className="relative pt-10 pb-20 md:pt-10 md:pb-32 overflow-hidden bg-neutral-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-primary text-sm font-semibold mb-6 animate-fade-in">
            <Target className="w-4 h-4" />
            Our Purpose
          </div>
          <h1 className="text-2xl md:text-5xl font-extrabold text-primary tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
            Connecting Businesses and Customers, <br />
            <span className="text-blue-600">One Reminder at a Time.</span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            At Textra, we believe that great customer service starts with clear communication. We saw that local service
            businesses were spending too much time on the phone and not enough time doing what they love. We built
            Textra to solve that problem, creating a simple, powerful tool that automates customer reminders through the
            convenience of WhatsApp.
          </p>
        </div>
      </section>

      {/* Section 2: The Story of Textra */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-semibold">
                <Rocket className="w-4 h-4" />
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">From an Idea to a Solution</h2>

              <div className="space-y-12">
                <div className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">The Spark (The Problem)</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Our journey began when we noticed a recurring challenge for a local motorbike mechanic: valuable
                    time was lost every day to phone calls, just to confirm appointments. Missed appointments meant lost
                    income, and the manual follow-up was inefficient.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">The Vision (The Solution)</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    We knew there had to be a better way. What if we could leverage a platform that customers already
                    use and trust every day? The answer was clear: WhatsApp. We envisioned a simple platform where a
                    business owner could easily schedule automated service reminders.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">The Creation (Building Textra)</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    With a clear vision, we got to work building Textra. Our goal was to create a platform that was
                    intuitive, reliable, and secure. After months of development and testing, Textra was born—a seamless
                    bridge between service businesses and their customers.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-primary/5 rounded-[3rem] p-8 aspect-square flex items-center justify-center">
                <div className="relative z-10 space-y-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <Lightbulb className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-primary">50+</p>
                    <p className="text-neutral-500 font-medium">Local Shops Trusted Us</p>
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-primary/10 rounded-full animate-pulse" />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-primary/5 rounded-full animate-pulse"
                  style={{ animationDelay: '1s' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Meet the Team */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">The People Behind Textra</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Putting faces to the name builds trust. We&apos;re real people dedicated to your business success.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-primary/5 space-y-6 text-center group">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-2 bg-primary rounded-full flex items-center justify-center text-white overflow-hidden shadow-inner">
                  <Users className="w-16 h-16" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-neutral-900">Sourabh</h3>
                <p className="text-primary font-semibold text-sm uppercase tracking-wider">CEO & Developer</p>
              </div>
              <p className="text-neutral-600 leading-relaxed italic">
                &quot;With a passion for building technology that empowers small businesses, I am dedicated to creating
                simple, effective tools that solve real-world problems. Textra is my commitment to your growth.&quot;
              </p>
              <div className="flex justify-center gap-4 pt-4 text-primary">
                <Sparkles className="w-5 h-5 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">What We Stand For</h2>
            <p className="text-neutral-600">The principles that guide every decision we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 bg-neutral-50 rounded-3xl space-y-6 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-neutral-100 group"
              >
                <div
                  className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {value.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900">{value.title}</h3>
                  <p className="text-neutral-500 leading-relaxed text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Let&apos;s Connect */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-8 md:p-16 text-white text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary/20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />

            <div className="space-y-4 relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Have a Question or <br className="hidden md:block" /> Want to Learn More?
              </h2>
              <p className="text-blue-100/80 text-lg max-w-2xl mx-auto">
                We&apos;d love to hear from you. Whether you&apos;re interested in using Textra for your business or
                just want to chat about our mission, feel free to reach out.
              </p>
            </div>

            <div className="relative z-10">
              <Link href="/contact">
                <Button size="lg" className="text-primary px-10 py-8 text-xl rounded-2xl font-bold shadow-xl group">
                  Get in Touch
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
