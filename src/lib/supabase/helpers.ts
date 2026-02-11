/**
 * Supabase Helpers - Funções utilitárias para trabalhar com Supabase
 * 
 * Este arquivo contém helpers para facilitar operações comuns
 * e garantir type-safety em todo o projeto.
 */

import { createClient as createBrowserClient } from './client'
import { createClient as createServerClient } from './server'
import { Database } from '@/types/database'

// ============================================================================
// TYPED CLIENTS
// ============================================================================

/**
 * Cria um cliente Supabase tipado para uso no browser
 * 
 * Uso em Client Components:
 * 
 * 'use client'
 * import { getSupabaseBrowserClient } from '@/lib/supabase/helpers'
 * 
 * const supabase = getSupabaseBrowserClient()
 * const { data } = await supabase.from('landing_pages').select()
 * // 'data' já vem tipado automaticamente!
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient()
}

/**
 * Cria um cliente Supabase tipado para uso no servidor
 * 
 * Uso em Server Components ou API Routes:
 * 
 * import { getSupabaseServerClient } from '@/lib/supabase/helpers'
 * 
 * const supabase = getSupabaseServerClient()
 * const { data } = await supabase.from('landing_pages').select()
 */
export function getSupabaseServerClient() {
  return createServerClient()
}

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Pega o usuário autenticado atual (server-side)
 * Retorna null se não estiver autenticado
 * 
 * Uso:
 * const user = await getCurrentUser()
 * if (!user) return redirect('/login')
 */
export async function getCurrentUser() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Verifica se o usuário está autenticado (server-side)
 * 
 * Uso:
 * const isAuth = await isAuthenticated()
 * if (!isAuth) return redirect('/login')
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Pega o ID do usuário atual ou lança erro se não autenticado
 * 
 * Uso em API Routes:
 * const userId = await requireAuth()
 * // Se chegar aqui, garantidamente tem userId
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user.id
}

// ============================================================================
// ERROR HELPERS
// ============================================================================

/**
 * Verifica se um erro do Supabase é de "não encontrado"
 */
export function isNotFoundError(error: any): boolean {
  return error?.code === 'PGRST116' || error?.message?.includes('not found')
}

/**
 * Verifica se um erro do Supabase é de autenticação
 */
export function isAuthError(error: any): boolean {
  return (
    error?.message?.includes('JWT') ||
    error?.message?.includes('auth') ||
    error?.status === 401
  )
}

/**
 * Formata erro do Supabase para mensagem amigável
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return 'Ocorreu um erro inesperado'
}
