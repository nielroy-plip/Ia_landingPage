import { BenefitsSection as BenefitsSectionType } from '@/types/landing-page'

export default function BenefitsSection({ headline, items }: BenefitsSectionType) {
  return (
    <section className="py-12">
      {headline && <h2 className="text-2xl font-bold text-center mb-8">{headline}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((benefit, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow">
            {benefit.icon && <div className="text-3xl mb-2">{benefit.icon}</div>}
            <h3 className="font-semibold text-lg mb-1">{benefit.titulo}</h3>
            <p className="text-muted-foreground">{benefit.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  )
}