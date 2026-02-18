import { TestimonialsSection as TestimonialsSectionType } from '@/types/landing-page'

export default function TestimonialsSection({ headline, items }: TestimonialsSectionType) {
  return (
    <section className="py-12">
      {headline && <h2 className="text-2xl font-bold text-center mb-8">{headline}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((testimonial, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
            {testimonial.avatar && (
              <img src={testimonial.avatar} alt={testimonial.nome} className="w-16 h-16 rounded-full mb-2" />
            )}
            <div className="font-semibold mb-1">{testimonial.nome}</div>
            {testimonial.cargo && <div className="text-xs text-muted-foreground">{testimonial.cargo}</div>}
            {testimonial.empresa && <div className="text-xs text-muted-foreground">{testimonial.empresa}</div>}
            <p className="italic text-center my-2">"{testimonial.depoimento}"</p>
            {testimonial.rating && (
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
