import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Page not found</h2>

        <p className="text-neutral-600 mb-6">The page you’re looking for doesn’t exist or has been moved.</p>

        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
