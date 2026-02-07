import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-neutral-900 text-center">Privacy Policy</CardTitle>
          <p className="text-center text-neutral-500 text-sm">Last updated: February 7, 2026</p>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">1. Information We Collect</h2>
            <p className="text-neutral-600 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, use our service, or
              communicate with us. This may include your name, email address, business details, and customer
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">2. How We Use Your Information</h2>
            <p className="text-neutral-600 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to process transactions,
              and to send you technical notices and support messages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">3. Data Sharing and Disclosure</h2>
            <p className="text-neutral-600 leading-relaxed">
              We do not share your personal information with third parties except as described in this policy or with
              your consent. We may share information with service providers who perform services on our behalf.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">4. Data Security</h2>
            <p className="text-neutral-600 leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and
              unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">5. Contact Us</h2>
            <p className="text-neutral-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@bikeservicecrm.com.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
