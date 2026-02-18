/**
 * Types - Briefing (Formulário de Input do Usuário)
 * 
 * Define os tipos para os dados que o usuário preenche
 * nos formulários (mini-form e form completo).
 */

/**
 * Tom de voz da copy
 */

export type TomVoz = 'profissional' | 'casual' | 'inspirador' | 'urgente'

/**
 * Objetivo da landing page
 */

export type Objetivo =
| 'venda'
| 'captacao_leads'
| 'cadastro'
| 'download'
| 'agendamento'

// ============================================================================
// MINI BRIEFING (Teste Grátis - Usuários Anônimos)
// ============================================================================

/**
 * Briefing simplificado para teste grátis
 * Apenas 3-4 campos essenciais
 */

export interface MiniBriefing {
    produto: string
    publico: string
    beneficio: string
}

// ============================================================================
// BRIEFING COMPLETO (Usuários Cadastrados)
// ============================================================================

/**
 * Briefing completo com todos os detalhes
 * Usado por usuários autenticados que querem mais controle
 */

export interface BriefingCompleto {
    podruto: string
    publico: string
    beneficio_principal: string

    decricao_detalhada?: string
    problema_resolve?: string
    diferenciais?: string[]

    tom_voz?: TomVoz
    objetivo?: Objetivo

    cta_texto?: string
    cta_acao?: string

    objecos?: string[]

    tem_depoimentos?: boolean
    tem_numeros?: boolean
    numeros?: {
        label: string
        valor: string
    }[]

    incluir_faq?: boolean
    perguntas_faq?: string[]
    referencia_url?: string
}

export type Briefing = MiniBriefing | BriefingCompleto

export function isMiniBriefing(briefing: Briefing): briefing is MiniBriefing {
    return (
        'produto' in briefing &&
        'publico' in briefing &&
        'beneficio' in briefing &&
        !('descricao_detalhada' in briefing)
    )
}

export function isBriefingCompleto(
    briefing: Briefing
): briefing is BriefingCompleto {
    return !isMiniBriefing(briefing)
}