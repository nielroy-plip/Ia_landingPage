import { z } from 'zod';

export const TomVozSchema = z.enum([
    'profissional',
    'casual',
    'inspirador',
    'urgente',
])

export const ObjetivoSchema = z.enum([
    'venda',
    'captacao_leads',
    'cadastro',
    'download',
    'agendamento',
])

export const MiniBriefingSchema = z.object({
    produto: z
    .string()
    .min(3, 'Nome do produto deve ter no mínimo 3 caracteres')
    .max(100, 'Nome do produto deve ter no máximo 100 caracteres'),

    publico: z
    .string()
    .min(5, 'Descreva seu público-alco com mais detalhes')
    .max(200, 'Descrição do público muito longa'),

    beneficio: z
    .string()
    .min(10, 'Descreva o benefício com mais detalhes')
    .max(300, 'Descrição do benefício muito longa'),
})

export type MiniBriefing = z.infer<typeof MiniBriefingSchema>

export const BriefingCompletoSchema = z.object({
    produto: z
    .string()
    .min(3, 'Nome do produto deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),

    publico: z
    .string()
    .min(5, 'Descreva seu público-alvo')
    .max(300, 'Descrição muito longa'),

  descricao_detalhada: z
    .string()
    .max(1000, 'Descrição muito longa')
    .optional(),
  
  problema_resolve: z
    .string()
    .max(500, 'Descrição muito longa')
    .optional(),
  
  diferenciais: z
    .array(z.string().max(200))
    .max(5, 'Máximo 5 diferenciais')
    .optional(),
  
  tom_voz: TomVozSchema.optional(),
  
  objetivo: ObjetivoSchema.optional(),
  
  cta_texto: z
    .string()
    .max(50, 'Texto do CTA muito longo')
    .optional(),
  
  cta_acao: z
    .string()
    .max(200, 'Descrição muito longa')
    .optional(),
  
  objecoes: z
    .array(z.string().max(300))
    .max(10, 'Máximo 10 objeções')
    .optional(),
  
  tem_depoimentos: z.boolean().optional(),
  
  tem_numeros: z.boolean().optional(),
  
  numeros: z
    .array(
      z.object({
        label: z.string().max(100),
        valor: z.string().max(50),
      })
    )
    .max(4, 'Máximo 4 números')
    .optional(),
  
  incluir_faq: z.boolean().optional(),
  
  perguntas_faq: z
    .array(z.string().max(300))
    .max(10, 'Máximo 10 perguntas')
    .optional(),
  
  referencia_url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
})

export type BriefingCompletoInput = z.infer<typeof BriefingCompletoSchema>

export const BriefingSchema = z.union([
    MiniBriefingSchema,
    BriefingCompletoSchema,
])

export type BriefingInput = z.infer<typeof BriefingSchema>

export function validateMiniBriefing(data: unknown) {
    return MiniBriefingSchema.safeParse(data)
}

export function validateBriefingCompleto(data: unknown) {
    return BriefingCompletoSchema.safeParse(data)
}

export function formatValidationErrors(error: z.ZodError): Record<string, string> {
    const formatted: Record<string, string> = {}

    error.errors.forEach((err) => {
        const path = err.path.join('.')
        formatted[path] = err.message
    })

    return formatted
}