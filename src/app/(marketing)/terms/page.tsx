import { constructMetadata } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = constructMetadata({
  title: 'Terms and Conditions',
  description: 'Review our terms and conditions for using BikeService CRM.',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-neutral-900 text-center">Terms and Conditions</CardTitle>
          <p className="text-center text-neutral-500 text-sm">Last updated: February 7, 2026</p>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-neutral-600 leading-relaxed">
              By accessing or using Textra, you agree to be bound by these Terms and Conditions. If you do not agree to
              all of these terms, do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">2. Description of Service</h2>
            <p className="text-neutral-600 leading-relaxed">
              Textra provides a management platform for bike service business owners to oversee their customers, service
              bookings, and business analytics. We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">3. User Responsibilities</h2>
            <p className="text-neutral-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account information and for all activities
              that occur under your account. You agree to provide accurate and complete information during the
              registration process.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Limitation of Liability</h2>
            <p className="text-neutral-600 leading-relaxed">
              BikeService CRM shall not be liable for any direct, indirect, incidental, special, consequential, or
              exemplary damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Governing Law</h2>
            <p className="text-neutral-600 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India, without regard to its
              conflict of law provisions.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
