/**
 * Supabase Client - Para uso em Server Components e API Routes
 * 
 * Este arquivo cria um cliente Supabase otimizado para o ambiente do servidor.
 * Use este cliente em:
 * - Server Components (componentes sem 'use client')
 * - API Routes (/app/api/*)
 * - Server Actions
 * 
 * Exemplo de uso em Server Component:
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function MyPage() {
 *   const supabase = createClient()
 *   const { data } = await supabase.from('landing_pages').select()
 *   return <div>{data}</div>
 * }
 * 
 * Exemplo de uso em API Route:
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function GET() {
 *   const supabase = createClient()
 *   const { data } = await supabase.from('landing_pages').select()
 *   return Response.json(data)
 * }
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Método para LER cookies
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Método para ESCREVER cookies
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Erro pode ocorrer se tentar set em Server Component
            // (Server Components são read-only)
            // Middlewares e Route Handlers podem usar set
          }
        },
        // Método para REMOVER cookies
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Mesmo comportamento do set
          }
        },
      },
    }
  )
}