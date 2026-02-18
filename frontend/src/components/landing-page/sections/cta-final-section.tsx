import { CtaFinalSection as CtaFinalSectionType } from '@/types/landing-page'

export default function CtaFinalSection({ headline, descricao, cta }: CtaFinalSectionType) {
  return (
    <section className="py-16 text-center bg-gradient-to-t from-white to-slate-50">
      <h2 className="text-3xl font-bold mb-4">{headline}</h2>
      {descricao && <p className="text-lg text-gray-600 mb-6">{descricao}</p>}
      <a href={cta.url || '#'} className="btn btn-primary">
        {cta.texto}
      </a>
    </section>
  )
}
