/**
 * Database Types - TypeScript Types para o Schema do Supabase
 * 
 * Este arquivo contém todos os tipos TypeScript que representam
 * as tabelas e estruturas do banco de dados.
 * 
 * IMPORTANTE: Em um projeto real, você geraria estes tipos automaticamente
 * usando o Supabase CLI:
 * 
 * npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
 * 
 * Mas para o MVP, vamos criar manualmente para você entender a estrutura.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type LandingPageStatus = 'draft' | 'published'

// ============================================================================
// TABELA: profiles
// ============================================================================

export interface Profile {
  id: string // uuid
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string // timestamp
  updated_at: string // timestamp
}

export interface ProfileInsert {
  id: string
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdate {
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
  updated_at?: string
}

// ============================================================================
// TABELA: landing_pages
// ============================================================================

/**
 * Estrutura do JSON armazenado no campo 'briefing'
 * Dados do formulário preenchido pelo usuário
 */
export interface Briefing {
  // Mini-form (usuários anônimos)
  produto?: string
  publico?: string
  beneficio?: string

  // Form completo (usuários autenticados)
  descricao_detalhada?: string
  tom_voz?: 'profissional' | 'casual' | 'inspirador' | 'urgente'
  objetivo?: string
  objecoes?: string[]
  cta_desejado?: string
  referencia_url?: string
}

/**
 * Estrutura do JSON armazenado no campo 'content'
 * Landing page gerada pela IA
 */
export interface LandingPageContent {
  hero: {
    headline: string
    subheadline: string
    cta: string
  }
  benefits: Array<{
    icon?: string
    title: string
    description: string
  }>
  testimonials?: Array<{
    name: string
    role?: string
    company?: string
    avatar?: string
    quote: string
    rating?: number
  }>
  faq?: Array<{
    question: string
    answer: string
  }>
  cta_final?: {
    headline: string
    description: string
    button: string
  }
  // Campos adicionais podem ser adicionados pela IA
  [key: string]: any
}

/**
 * Tipo da tabela landing_pages (SELECT)
 */
export interface LandingPage {
  id: string // uuid
  user_id: string // uuid
  title: string
  briefing: Briefing | null
  content: LandingPageContent
  status: LandingPageStatus
  slug: string | null
  created_at: string // timestamp
  updated_at: string // timestamp
}

/**
 * Tipo para INSERT em landing_pages
 */
export interface LandingPageInsert {
  id?: string
  user_id: string
  title: string
  briefing?: Briefing | null
  content: LandingPageContent
  status?: LandingPageStatus
  slug?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Tipo para UPDATE em landing_pages
 */
export interface LandingPageUpdate {
  title?: string
  briefing?: Briefing | null
  content?: LandingPageContent
  status?: LandingPageStatus
  slug?: string | null
  updated_at?: string
}

// ============================================================================
// TABELA: anonymous_previews
// ============================================================================

/**
 * Tipo da tabela anonymous_previews (SELECT)
 */
export interface AnonymousPreview {
  id: string // uuid
  ip_address: string | null // inet
  content: LandingPageContent
  briefing: Briefing | null
  expires_at: string // timestamp
  created_at: string // timestamp
}

/**
 * Tipo para INSERT em anonymous_previews
 */
export interface AnonymousPreviewInsert {
  id?: string
  ip_address?: string | null
  content: LandingPageContent
  briefing?: Briefing | null
  expires_at?: string
  created_at?: string
}

// ============================================================================
// DATABASE TYPE (para uso com Supabase Client)
// ============================================================================

/**
 * Tipo completo do database para uso com o cliente Supabase
 * 
 * Uso:
 * import { Database } from '@/types/database'
 * const supabase = createClient<Database>()
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      landing_pages: {
        Row: LandingPage
        Insert: LandingPageInsert
        Update: LandingPageUpdate
      }
      anonymous_previews: {
        Row: AnonymousPreview
        Insert: AnonymousPreviewInsert
        Update: Partial<AnonymousPreview>
      }
    }
    Views: {
      // Views do banco (se houver)
    }
    Functions: {
      // Functions do banco (se houver)
    }
    Enums: {
      // Enums do banco (se houver)
    }
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Helper type para pegar o tipo de uma tabela
 * Uso: TableRow<'landing_pages'>
 */
export type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

/**
 * Helper type para pegar o tipo de INSERT de uma tabela
 * Uso: TableInsert<'landing_pages'>
 */
export type TableInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

/**
 * Helper type para pegar o tipo de UPDATE de uma tabela
 * Uso: TableUpdate<'landing_pages'>
 */
export type TableUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
