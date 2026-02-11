/**
 * Supabase Client - Para uso em Client Components (Browser)
 * 
 * Este arquivo cria um cliente Supabase otimizado para o ambiente do navegador.
 * Use este cliente em componentes React marcados com 'use client'.
 * 
 * Exemplo de uso:
 * 
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export default function MyComponent() {
 *   const supabase = createClient()
 *   // Use supabase.auth.signIn(), supabase.from('table').select(), etc.
 * }
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Cria um cliente Supabase que funciona no browser
  // Gerencia cookies automaticamente para manter sessão
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}