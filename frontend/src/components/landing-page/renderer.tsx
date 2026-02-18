'use client'
import { LandingPageStructure } from '@/types/landing-page'
import HeroSection from './sections/hero-section'
import BenefitsSection from './sections/benefits-section'
import HowItWorksSection from './sections/howitworks-section'
import TestimonialsSection from './sections/testimonials-section'
import StatsSection from './sections/stats-section'
import FaqSection from './sections/faq-section'
import CtaFinalSection from './sections/cta-final-section'

type Props = {
  data: LandingPageStructure
}

export default function LandingPageRenderer({ data }: Props) {
  return (
    <div>
      <HeroSection {...data.hero} />
      <BenefitsSection {...data.benefits} />
      {data.how_it_works && <HowItWorksSection {...data.how_it_works} />}
      {data.testimonials && <TestimonialsSection {...data.testimonials} />}
      {data.stats && <StatsSection {...data.stats} />}
      {data.faq && <FaqSection {...data.faq} />}
      {data.cta_final && <CtaFinalSection {...data.cta_final} />}
    </div>
  )
}
