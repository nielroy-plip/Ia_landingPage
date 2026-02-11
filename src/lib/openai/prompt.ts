import { Briefing } from '@/types/briefing'

export function generateLandingPagePrompt(briefing: Briefing) {
  return `
Você é um copywriter especialista em conversão.
Com base no briefing abaixo, gere uma landing page em formato JSON seguindo exatamente o schema fornecido.

Briefing:
${JSON.stringify(briefing, null, 2)}

Regras:
- O output deve ser um JSON válido, SEM comentários, SEM explicações.
- Siga o schema:
{
  "meta": { "titulo": "...", "descricao": "..." },
  "hero": { ... },
  "benefits": { ... },
  "how_it_works": { ... },
  "testimonials": { ... },
  "stats": { ... },
  "faq": { ... },
  "cta_final": { ... }
}
- Preencha apenas as seções relevantes para o briefing.
- Use linguagem persuasiva e clara.
- NÃO inclua nenhum texto fora do JSON.
`
}