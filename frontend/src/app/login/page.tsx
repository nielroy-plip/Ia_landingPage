"use client"
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou senha inválidos');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Entrar</h2>
        <Input label="Email" type="email" name="email" required />
        <Input label="Senha" type="password" name="password" required />
        <Button variant="primary" type="submit" className="w-full">Entrar</Button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <div className="text-center text-sm text-gray-500 mt-2">
          Não tem conta? <a href="/register" className="underline">Criar Conta</a>
        </div>
      </form>
    </main>
  )
}
