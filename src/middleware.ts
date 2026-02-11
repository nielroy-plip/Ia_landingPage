/**
 * Next.js Middleware - Autenticação e Proteção de Rotas
 * 
 * Este middleware executa ANTES de cada requisição na aplicação.
 * 
 * Responsabilidades:
 * 1. Atualizar tokens de autenticação (refresh tokens)
 * 2. Proteger rotas que requerem autenticação
 * 3. Redirecionar usuários não autenticados para /login
 * 4. Redirecionar usuários autenticados que tentam acessar /login para /dashboard
 * 
 * O middleware roda no Edge Runtime da Vercel, garantindo baixa latência.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Criar cliente Supabase para o middleware
  // Não podemos usar o createClient de /lib/supabase/server.ts aqui
  // porque o middleware tem seu próprio contexto de cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Setar cookie na requisição (para próximas chamadas no mesmo ciclo)
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Setar cookie na resposta (para enviar ao browser)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // IMPORTANTE: Isto atualiza o token automaticamente se expirou
  // O Supabase faz refresh do token em background
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pegar a URL atual
  const { pathname } = request.nextUrl

  // Rotas protegidas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/create']
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Rotas de autenticação (login, signup)
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // LÓGICA 1: Se está tentando acessar rota protegida SEM estar autenticado
  if (isProtectedRoute && !user) {
    // Redireciona para login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    // Adiciona parâmetro para redirecionar de volta depois do login
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // LÓGICA 2: Se está autenticado tentando acessar página de login/signup
  if (isAuthRoute && user) {
    // Redireciona para dashboard
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // LÓGICA 3: Caso contrário, permite acesso normalmente
  return response
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes que não precisam de auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
