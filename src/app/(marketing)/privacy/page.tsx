import { constructMetadata } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = constructMetadata({
  title: 'Privacy Policy',
  description: 'Read our privacy policy to understand how we collect, use, and protect your information.',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-neutral-900 text-center">Privacy Policy</CardTitle>
          <p className="text-center text-neutral-500 text-sm">Last updated: February 7, 2026</p>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">1. Data Collection</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              To provide our automated WhatsApp reminder service, we collect different types of information from our
              clients (repair shop owners) and their customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h3 className="font-bold text-neutral-800 mb-2">Business Information</h3>
                <ul className="text-sm text-neutral-600 list-disc ml-4 space-y-1">
                  <li>Business Name & Owner Name</li>
                  <li>Business Email & Phone Number</li>
                  <li>Physical Address, City, State, and Zone</li>
                  <li>WhatsApp Business API (WABA) IDs & Access Tokens</li>
                </ul>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h3 className="font-bold text-neutral-800 mb-2">Customer & Vehicle Data</h3>
                <ul className="text-sm text-neutral-600 list-disc ml-4 space-y-1">
                  <li>Customer Name, Phone Number, and Email</li>
                  <li>Vehicle Type, Brand, Model, and Year</li>
                  <li>Vehicle Registration Number</li>
                  <li>Service Dates & Maintenance Intervals</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">2. Purpose of Collection</h2>
            <p className="text-neutral-600 leading-relaxed">We use the collected data exclusively for:</p>
            <ul className="text-neutral-600 list-disc ml-6 space-y-2 mt-2">
              <li>Providing and managing the automated WhatsApp reminder service.</li>
              <li>Allowing business owners to track upcoming services and no-shows.</li>
              <li>Managing business profiles and WhatsApp API integrations.</li>
              <li>Improving our service through internal analytics and troubleshooting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">3. Data Usage and Protection</h2>
            <p className="text-neutral-600 leading-relaxed">
              We take data security seriously. Your data is stored on secure cloud servers with industry-standard
              encryption (AES-256) at rest. We implement:
            </p>
            <ul className="text-neutral-600 list-disc ml-6 space-y-2 mt-2">
              <li>
                Secure authentication and authorization via <strong>Clerk</strong>.
              </li>
              <li>Encrypted database connections and server-side environment variable masking.</li>
              <li>Regular security audits and vulnerability patches.</li>
              <li>Strict internal access controls to limit data visibility to authorized personnel only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">
              4. Data Sharing with Third Parties
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              We do not sell your personal data. We only share data with essential service providers:
            </p>
            <ul className="text-neutral-600 list-disc ml-6 space-y-2 mt-2">
              <li>
                <strong>Clerk:</strong> For secure user authentication and account management.
              </li>
              <li>
                <strong>WhatsApp/Meta:</strong> To facilitate the sending of automated messages through their official
                API.
              </li>
              <li>
                <strong>Cloud Hosting Providers:</strong> For secure database and application hosting.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">
              5. User Rights (Access & Deletion)
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              In accordance with data protection regulations like GDPR, you have the following rights:
            </p>
            <ul className="text-neutral-600 list-disc ml-6 space-y-2 mt-2">
              <li>
                <strong>Access:</strong> Request a copy of all data we store about your business or customers.
              </li>
              <li>
                <strong>Correction:</strong> Update or fix any inaccurate information in your profile.
              </li>
              <li>
                <strong>Deletion ("Right to be Forgotten"):</strong> Request that we permanently delete your account and
                all associated data.
              </li>
            </ul>
            <p className="text-neutral-600 leading-relaxed mt-4">
              To exercise these rights, please email us at <strong>sourabh.cad70@gmail.com</strong>. We will process
              your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-neutral-800 mb-3 border-b pb-2">6. Contact Us</h2>
            <p className="text-neutral-600 leading-relaxed">
              If you have any questions about this Privacy Policy or our data handling practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-primary font-medium">Textra Support</p>
              <p className="text-neutral-600">Email: sourabh.cad70@gmail.com</p>
              <p className="text-neutral-600">Website: www.textra.in</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
