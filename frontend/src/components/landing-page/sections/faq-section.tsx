import { FaqSection as FaqSectionType } from '@/types/landing-page'

export default function FaqSection({ headline, items }: FaqSectionType) {
  return (
    <section className="py-12">
      {headline && <h2 className="text-2xl font-bold text-center mb-8">{headline}</h2>}
      <div className="max-w-2xl mx-auto">
        {items.map((faq, i) => (
          <details key={i} className="mb-4 border rounded">
            <summary className="cursor-pointer px-4 py-2 font-semibold bg-slate-100">{faq.pergunta}</summary>
            <div className="px-4 py-2 text-muted-foreground">{faq.reposta}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
