import { HeroSection as HeroSectionType } from '@/types/landing-page'
import Button from '@/components/ui/button'

export default function HeroSection(props: HeroSectionType) {
  return (
    <section className="w-full py-28 md:py-40 bg-gradient-to-b from-white to-slate-50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Texto */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 leading-tight tracking-tight">
            {props.headline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto md:mx-0">
            {props.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
            <Button href={props.cta_primary.url || '#'} variant="primary" size="lg" className="shadow-lg hover:scale-[1.04] focus:ring-2 focus:ring-indigo-300 transition-all duration-200">
              {props.cta_primary.texto}
            </Button>
            {props.cta_secondary && (
              <Button href={props.cta_secondary.url || '#'} variant="secondary" size="lg" className="hover:scale-[1.04] focus:ring-2 focus:ring-indigo-200 transition-all duration-200">
                {props.cta_secondary.texto}
              </Button>
            )}
          </div>
        </div>
        {/* Imagem opcional */}
        {props.image_url && (
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src={props.image_url}
              alt="Hero image"
              className="w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 bg-white/70 transition-transform duration-300 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  )
}
