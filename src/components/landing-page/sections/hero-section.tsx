import { HeroSection as HeroSectionType } from '@/types/landing-page'

export default function HeroSection(props: HeroSectionType) {
  return (
    <section className="py-16 text-center bg-gradient-to-b from-white to-slate-50">
      <h1 className="text-4xl font-bold mb-4">{props.headline}</h1>
      <p className="text-lg text-muted-foreground mb-6">{props.subheadline}</p>
      <div className="flex justify-center gap-4">
        <a href={props.cta_primary.url || '#'} className="btn btn-primary">
          {props.cta_primary.texto}
        </a>
        {props.cta_secondary && (
          <a href={props.cta_secondary.url || '#'} className="btn btn-secondary">
            {props.cta_secondary.texto}
          </a>
        )}
      </div>
    </section>
  )
}