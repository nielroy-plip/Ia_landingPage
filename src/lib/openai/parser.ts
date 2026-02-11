import { z } from 'zod'
import { LandingPageStructureSchema } from '@/lib/validations/landing-page'

export function parseLandingPageFromAI(aiOutput: string) {
  let json: unknown
  try {
    json = JSON.parse(aiOutput)
  } catch {
    throw new Error('A resposta da IA não é um JSON válido.')
  }
  const result = LandingPageStructureSchema.safeParse(json)
  if (!result.success) {
    throw new Error('O JSON retornado pela IA está fora do padrão esperado.')
  }
  return result.data
}