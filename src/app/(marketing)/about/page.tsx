import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold text-neutral-900 text-center">About BikeService CRM</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-neutral max-w-none text-center">
        <p className="text-xl text-neutral-600 leading-relaxed mb-8">
          Empowering bike service businesses with modern tools to manage and grow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-[#15368A] mb-2">Our Mission</h3>
            <p className="text-neutral-600">
              To provide the best-in-class CRM experience specifically tailored for the two-wheeler service industry,
              helping small and medium-sized businesses thrive in a digital world.
            </p>
          </div>
          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-[#15368A] mb-2">Our Vision</h3>
            <p className="text-neutral-600">
              To become the global standard for automotive service management, bridging the gap between service
              providers and vehicle owners through technology.
            </p>
          </div>
        </div>

        <div className="mt-12 text-neutral-600">
          <p>Founded with passion for bikes and commitment to business excellence.</p>
        </div>
      </CardContent>
    </Card>
  );
}
