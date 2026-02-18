// lib/types.ts
type LandingData = {
  headline: string
  subheadline: string
  beneficios: string[]
  cta: string
}

type LandingFormInput = {
  nomeProjeto: string
  tipoNegocio: string
  publicoAlvo: string
  objetivo: string
  tomVoz: string
  cidade?: string
}

type User = {
  id: string
  name: string
  email: string
}

export type { LandingData, LandingFormInput, User }
