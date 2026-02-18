import { z } from 'zod';

export const HeroSectionSchema = z.object({
    headline: z.string().min(1, 'Headline muito curto'),
    subheadline: z.string().min(20, 'Subheadline muito curto'),
    cta_primary: z.object({
        texto: z.string().min(2),
        url: z.string().optional(),
    }),
    cat_secondary: z.object({
        texto: z.string(),
        url: z.string().optional(),
    })
    .optional(),
    image_url: z.string().url().optional(),
})

export const BenefitSchema = z.object({
  icon: z.string().optional(),
  titulo: z.string().min(3),
  descricao: z.string().min(10),
})

export const BenefitsSectionSchema = z.object({
  headline: z.string().optional(),
  items: z.array(BenefitSchema).min(3, 'Mínimo 3 benefícios').max(6),
})

export const StepSchema = z.object({
  numero: z.number().int().positive(),
  titulo: z.string().min(3),
  descricao: z.string().min(10),
  icon: z.string().optional(),
})

export const HowItWorksSectionSchema = z.object({
  headline: z.string().optional(),
  steps: z.array(StepSchema).min(3).max(5),
})

export const TestimonialSchema = z.object({
  nome: z.string().min(2),
  cargo: z.string().optional(),
  empresa: z.string().optional(),
  avatar: z.string().url().optional(),
  depoimento: z.string().min(20),
  rating: z.number().min(1).max(5).optional(),
})

export const TestimonialsSectionSchema = z.object({
  headline: z.string().optional(),
  items: z.array(TestimonialSchema).min(2).max(4),
})

export const StatsSectionSchema = z.object({
  headline: z.string().optional(),
  stats: z.array(
    z.object({
      valor: z.string(),
      label: z.string(),
    })
  ).min(2).max(4),
})

export const FaqItemSchema = z.object({
  pergunta: z.string().min(5),
  resposta: z.string().min(20),
})

export const FaqSectionSchema = z.object({
  headline: z.string().optional(),
  items: z.array(FaqItemSchema).min(4).max(8),
})

export const CtaFinalSectionSchema = z.object({
  headline: z.string().min(10),
  descricao: z.string().optional(),
  cta: z.object({
    texto: z.string().min(2),
    url: z.string().optional(),
  }),
})

export const LandingPageStructureSchema = z.object({
  meta: z.object({
    titulo: z.string().optional(),
    descricao: z.string().optional(),
  }),

    hero: HeroSectionSchema,
  benefits: BenefitsSectionSchema,

    how_it_works: HowItWorksSectionSchema.optional(),
  testimonials: TestimonialsSectionSchema.optional(),
  stats: StatsSectionSchema.optional(),
  faq: FaqSectionSchema.optional(),
  cta_final: CtaFinalSectionSchema.optional(),
})

export type LandingPageStructureOutput = z.infer<typeof LandingPageStructureSchema>

export function validateLandingPage(data: unknown) {
  return LandingPageStructureSchema.safeParse(data)
}

export function parseLandingPage(data: unknown): LandingPageStructureOutput {
  return LandingPageStructureSchema.parse(data)
}

export function formatLandingPageErrors(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.join(' > ')
    return `${path}: ${err.message}`
  })
}