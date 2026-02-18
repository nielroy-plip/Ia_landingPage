import Button from '@/components/ui/button'

interface CTASectionProps {
  headline: string
  subheadline?: string
  cta_text: string
  cta_url: string
}

export default function CTASection({ headline, subheadline, cta_text, cta_url }: CTASectionProps) {
  return (
    <section className="w-full py-28 bg-gradient-to-br from-indigo-200 via-white to-blue-100 flex justify-center items-center">
      <div className="text-center p-12 rounded-3xl shadow-2xl bg-white/90 border border-slate-200">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-700 tracking-tight">{headline}</h2>
        {subheadline && <p className="text-xl text-gray-700 mb-10">{subheadline}</p>}
        <Button href={cta_url} variant="primary" size="lg" className="mt-2 shadow-lg hover:scale-[1.04] focus:ring-2 focus:ring-indigo-300 transition-all duration-200">
          {cta_text}
        </Button>
      </div>
    </section>
  )
}
