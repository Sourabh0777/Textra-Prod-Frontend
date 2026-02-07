import { constructMetadata } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = constructMetadata({
  title: 'About Us',
  description: 'Learn more about Textra and our mission to modernize business communication.',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-neutral-900 text-center">About Textra</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none text-center">
          <p className="text-xl text-neutral-600 leading-relaxed mb-8">
            Empowering businesses with modern tools to manage communication and grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-bold text-[#15368A] mb-2">Our Mission</h3>
              <p className="text-neutral-600">
                To provide a best-in-class WhatsApp reminder platform tailored for appointment-based businesses, helping
                owners master their operations in a digital-first world.
              </p>
            </div>
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-bold text-[#15368A] mb-2">Our Vision</h3>
              <p className="text-neutral-600">
                To become the global standard for business-to-customer communication, bridging the gap through seamless
                and automated technology.
              </p>
            </div>
          </div>

          <div className="mt-12 text-neutral-600">
            <p>Founded with a commitment to business excellence through technology.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
