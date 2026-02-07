import { constructMetadata } from '@/lib/seo';
import { HeroSection } from '@/components/home/hero-section';
import { ProblemSolutionSection } from '@/components/home/problem-solution-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { FutureVisionSection } from '@/components/home/future-vision-section';

export const metadata = constructMetadata({
  title: 'Precision Management for Bike Service Centers',
  description:
    'Elevate your service center with Textra. The all-in-one platform for effortless job management, customer relations, and business growth.',
});

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FutureVisionSection />
    </div>
  );
}
