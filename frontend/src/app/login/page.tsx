"use client"
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function mapLoginError(message: string) {
  const normalized = message.toLowerCase()

  if (normalized.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.'
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Email ou senha inválidos.'
  }

  return message
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleResendConfirmation(email: string) {
    setResending(true)
    setInfo(null)

    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (resendError) {
      setError(resendError.message)
    } else {
      setInfo('E-mail de confirmação reenviado. Verifique sua caixa de entrada e spam.')
    }

    setResending(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true)
    setError(null)
    setInfo(null)

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(mapLoginError(error.message));
      if (error.message.toLowerCase().includes('email not confirmed')) {
        await handleResendConfirmation(email)
      }
      setLoading(false)
    } else {
      setLoading(false)
      router.push('/dashboard');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Entrar</h2>
        <Input label="Email" type="email" name="email" required />
        <Input label="Senha" type="password" name="password" required />
        <Button variant="primary" type="submit" className="w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {info && <div className="text-green-700 text-center text-sm">{info}</div>}
        {resending && <div className="text-sm text-gray-500 text-center">Reenviando confirmação...</div>}
        <div className="text-center text-sm text-gray-500 mt-2">
          Não tem conta? <a href="/register" className="underline">Criar Conta</a>
        </div>
      </form>
    </main>
  )
}
