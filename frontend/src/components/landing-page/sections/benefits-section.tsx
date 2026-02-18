import { BenefitsSection as BenefitsSectionType } from '@/types/landing-page'
import FeatureCard from '../FeatureCard'

export default function BenefitsSection({ headline, items }: BenefitsSectionType) {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      {headline && <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">{headline}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {items.map((benefit, i) => (
          <FeatureCard key={i} {...benefit} />
        ))}
      </div>
    </section>
  )
}
