import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-[#15368A] tracking-tight">
          Welcome to <span className="text-blue-600">BikeService CRM</span>
        </h1>
        <p className="text-xl text-neutral-600 leading-relaxed">
          The ultimate platform for managing your bike service business. Streamline operations, track customers, and
          grow your business with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-[#15368A] hover:bg-[#15368A]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Go to Dashboard
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-neutral-50 transition-all"
          >
            Learn More
          </Button>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Customer Management</h3>
          <p className="text-neutral-600">Keep track of your customers and their vehicle history in one place.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Service Tracking</h3>
          <p className="text-neutral-600">Manage service orders, schedules, and reminders efficiently.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Business Analytics</h3>
          <p className="text-neutral-600">Get insights into your business performance with detailed reports.</p>
        </div>
      </div>
    </div>
  );
}
