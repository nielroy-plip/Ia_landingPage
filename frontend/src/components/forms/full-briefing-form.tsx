'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateLanding } from '@/lib/backend/api'

export default function FullBriefingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const form = new FormData(event.currentTarget)
      const briefing = {
        produto: String(form.get('produto') || ''),
        publico: String(form.get('publico') || ''),
        beneficio_principal: String(form.get('beneficio_principal') || ''),
        descricao_detalhada: String(form.get('descricao_detalhada') || ''),
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const result = await generateLanding({
        briefing,
        title: briefing.produto || 'Landing de briefing completo',
        save: Boolean(user?.id),
        user_id: user?.id,
        user_email: user?.email,
        user_full_name: (user?.user_metadata?.full_name as string | undefined) ?? null,
      })

      setPreview(result.generated)

      if (result.saved?.id) {
        router.push(`/dashboard/${result.saved.id}`)
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao gerar landing page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <label className="block">
          <span className="block mb-1 font-medium">Nome do Produto</span>
          <input type="text" name="produto" className="border rounded px-3 py-2 w-full" required minLength={3} />
        </label>
        <label className="block">
          <span className="block mb-1 font-medium">Público-Alvo</span>
          <input type="text" name="publico" className="border rounded px-3 py-2 w-full" required minLength={5} />
        </label>
        <label className="block">
          <span className="block mb-1 font-medium">Benefício Principal</span>
          <input type="text" name="beneficio_principal" className="border rounded px-3 py-2 w-full" required minLength={10} />
        </label>
        <label className="block">
          <span className="block mb-1 font-medium">Descrição Detalhada</span>
          <textarea name="descricao_detalhada" className="border rounded px-3 py-2 w-full" rows={3} />
        </label>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Landing Page'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {preview && (
        <div className="mt-4 rounded border border-slate-200 bg-white p-3">
          <p className="font-semibold mb-2">Preview JSON</p>
          <pre className="text-xs overflow-auto">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
