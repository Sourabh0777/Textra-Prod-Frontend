import { constructMetadata } from '@/lib/seo';
import { HeroSection } from '@/components/home/hero-section';
import { ProblemSolutionSection } from '@/components/home/problem-solution-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { FutureVisionSection } from '@/components/home/future-vision-section';

export const metadata = constructMetadata({
  title: 'Textra | Whatsapp remminder Solution',
  description:
    'Whatsapp remminder Solution for businesses. Streamline workflow, enhance customer trust, and scale with precision.',
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
