import { constructMetadata } from '@/lib/seo';
import { ContactForm } from '@/components/marketing/contact-form';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Contact Us',
  description: 'Connect with Logicra Technologies. We are here to help you with your business communication needs.',
});

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Contact Us</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Have questions about Textra? Our team is here to help you revolutionize your business communication.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Business Details</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-[#15368A]">
                  <Building2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Legal Business Name</h4>
                  <p className="text-neutral-600">Logicra Technologies</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-[#15368A]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Address</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Kanjahawala Road, House no -339
                    <br />
                    Pooth Kalan, Delhi 110086
                    <br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-[#15368A]">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Phone</h4>
                  <p className="text-neutral-600">+91 9315675543</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-[#15368A]">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Email</h4>
                  <p className="text-neutral-600">sourabh.cad70@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
