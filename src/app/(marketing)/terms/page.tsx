import { constructMetadata } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = constructMetadata({
  title: 'Terms of Service',
  description: 'Review our terms of service for using Textra.',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-neutral-900 text-center">Terms of Service</CardTitle>
          <p className="text-center text-neutral-500 text-sm">Last updated: February 7, 2026</p>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">1. Acceptance of Terms</h2>
            <p className="text-neutral-600 leading-relaxed">
              By accessing or using Textra ("we," "our," or "the Service"), you agree to be bound by these Terms of
              Service. If you are using the Service on behalf of a business, you represent that you have the authority
              to bind that business to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">2. Description of Service</h2>
            <p className="text-neutral-600 leading-relaxed">
              Textra provides an automated WhatsApp reminder and CRM platform designed for repair shops and similar
              businesses. Our service facilitates the management of customer records, vehicle service schedules, and the
              delivery of automated notifications via the WhatsApp Business API.
            </p>
          </section>

          <section className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <h2 className="text-xl font-semibold text-amber-900 mb-3 border-b border-amber-200 pb-2">
              3. CRITICAL: Client Responsibility for Opt-In
            </h2>
            <p className="text-amber-800 leading-relaxed font-medium">
              As a client of Textra, you are solely responsible for obtaining and documenting explicit consent (opt-in)
              from your customers before using our Service to send them any WhatsApp messages.
            </p>
            <ul className="text-amber-800 list-disc ml-6 space-y-2 mt-3 text-sm">
              <li>
                You must ensure that your customers have agreed to receive service reminders and marketing messages via
                WhatsApp.
              </li>
              <li>You must maintain records of such consent and provide them to us or WhatsApp/Meta upon request.</li>
              <li>
                Failure to obtain proper consent may result in the immediate termination of your account and potential
                legal liability.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">4. Acceptable Use</h2>
            <p className="text-neutral-600 leading-relaxed">
              The Service should be used for legitimate business purposes, including:
            </p>
            <ul className="text-neutral-600 list-disc ml-6 space-y-2 mt-2">
              <li>Sending automated service reminders to customers.</li>
              <li>Managing customer and vehicle service history.</li>
              <li>Communicating transactional updates regarding bookings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-800 mb-3 border-b border-red-100 pb-2">
              5. Prohibited Use & Spam
            </h2>
            <p className="text-neutral-600 leading-relaxed">You explicitly agree NOT to use the Service for:</p>
            <ul className="text-neutral-600 list-disc ml-6 space-y-2 mt-2">
              <li>Sending unsolicited promotional messages (Spam).</li>
              <li>
                Sending any content that violates the <strong>WhatsApp Commerce Policy</strong> or{' '}
                <strong>Business Policy</strong>.
              </li>
              <li>Harassing, threatening, or defrauding any individual.</li>
              <li>Sending adult content, illegal substances advertisements, or prohibited financial services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">6. Limitation of Liability</h2>
            <p className="text-neutral-600 leading-relaxed">
              Textra acts as a technical facilitator for messaging. We are not responsible for the content of the
              messages sent by our clients, nor are we liable for any account bans or restrictions imposed by
              WhatsApp/Meta due to your misuse of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">7. Governing Law</h2>
            <p className="text-neutral-600 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any
              disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Delhi,
              India.
            </p>
          </section>

          <section>
            <div className="mt-8 p-6 bg-neutral-50 rounded-lg text-center">
              <p className="text-neutral-500 text-sm italic">
                By using Textra, you acknowledge that you have read, understood, and agree to be bound by these Terms of
                Service.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
