export interface HeroSection {
    headline: string
    subheadline: string
    cta_primary: {
        texto: string
        url?: string
    }
    cta_secondary?: {
        texto: string
        url?: string
    }
    image_url?: string
}

export interface Benefit {
    icon?: string
    titulo: string
    descricao: string
}

export interface BenefitsSection {
    headline?: string
    items: Benefit[]
}

export interface Step {
    numero: number
    titulo: string
    descricao: string
    icon?: string
}

export interface HowItWorksSection {
    headline?: string
    steps: Step[]
}

export interface Testimonial {
    nome: string
    cargo?: string
    empresa?: string
    avatar?: string
    depoimento: string
    rating?: number
}

export interface TestimonialsSection {
    headline?: string
    items: Testimonial[]
}

export interface StatsSection {
    headline?: string
    stats: Array<{
        valor: string
        label: string
    }>
}

export interface FaqItem {
    pergunta: string
    reposta: string
}

export interface FaqSection {
    headline?: string
    items: FaqItem[]
}

export interface CtaFinalSection {
    headline: string
    descricao?: string
    cta: {
        texto: string
        url?: string
    }
}

export interface LandingPageStructure {
    // Metadados
    meta: {
        titulo?: string
        descricao?: string
    }

    hero: HeroSection
    benefits: BenefitsSection

    how_it_works?: HowItWorksSection
    testimonials?: TestimonialsSection
    stats?: StatsSection
    faq?: FaqSection
    cta_final?: CtaFinalSection
}

export type SectionType =
| 'hero'
| 'benefits'
| 'how_it_works'
| 'testimonials'
| 'stats'
| 'faq'
| 'cta_final'

export type SectionByType<T extends SectionType> =
    T extends 'hero' ? HeroSection :
    T extends 'benefits' ? BenefitsSection :
    T extends 'how_it_works' ? HowItWorksSection :
    T extends 'testimonials' ? TestimonialsSection :
    T extends 'stats' ? StatsSection :
    T extends 'faq' ? FaqSection :
    T extends 'cta_final' ? CtaFinalSection :
    never