import { HowItWorksSection as HowItWorksSectionType } from '@/types/landing-page'
import HowItWorksStepCard from '../HowItWorksStepCard'

export default function HowItWorksSection({ headline, steps }: HowItWorksSectionType) {
  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-50">
      {headline && <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">{headline}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <HowItWorksStepCard key={i} {...step} />
        ))}
      </div>
    </section>
  )
}
