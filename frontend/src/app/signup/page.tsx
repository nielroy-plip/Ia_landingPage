"use client"
// Necessário para usar useRouter e hooks do Next.js
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

export default function SignupPage() {
  const router = useRouter();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push('/dashboard');
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Criar Conta</h2>
        <Input label="Nome completo" type="text" required />
        <Input label="Email" type="email" required />
        <Input label="Senha" type="password" required minLength={6} />
        <Button type="submit" className="w-full">Criar Conta</Button>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Já tem conta? <a href="/login" className="underline">Entrar</a>
        </div>
      </form>
    </main>
  )
}
