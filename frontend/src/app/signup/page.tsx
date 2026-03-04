"use client"
// Necessário para usar useRouter e hooks do Next.js
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createProfile, syncProfileWithToken } from '@/lib/backend/api'

function mapSignUpError(message: string) {
  if (message.toLowerCase().includes('email signups are disabled')) {
    return 'Cadastro por e-mail está desativado no Supabase. Ative em Authentication > Providers > Email.'
  }

  if (message.toLowerCase().includes('user already registered')) {
    return 'Este e-mail já está cadastrado. Tente fazer login.'
  }

  return message
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true)
    setError(null)
    setSuccess(null)

    const form = e.currentTarget
    const fullName = (form.elements.namedItem('full_name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(mapSignUpError(signUpError.message))
      setLoading(false)
      return
    }

    if (data.user?.id) {
      try {
        if (data.session?.access_token) {
          await syncProfileWithToken(data.session.access_token, {
            full_name: fullName,
          })
        } else {
          await createProfile({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
          })
        }
      } catch {
        // O usuário já foi criado no Auth; falha de profile não deve bloquear cadastro.
      }
    }

    setLoading(false)

    if (!data.session) {
      setSuccess('Conta criada. Confirme seu e-mail para entrar.')
      router.push('/login')
      return
    }

    router.push('/dashboard')
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Criar Conta</h2>
        <Input label="Nome completo" name="full_name" type="text" required />
        <Input label="Email" name="email" type="email" required />
        <Input label="Senha" name="password" type="password" required minLength={6} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Criando conta...' : 'Criar Conta'}</Button>
        {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        {success && <div className="text-green-700 text-center text-sm">{success}</div>}
        <div className="text-center text-sm text-muted-foreground mt-2">
          Já tem conta? <a href="/login" className="underline">Entrar</a>
        </div>
      </form>
    </main>
  )
}
