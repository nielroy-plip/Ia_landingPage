'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { generateLanding } from '@/lib/backend/api'

const objetivos = [
  { value: 'leads', label: 'Leads' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'venda', label: 'Venda' },
]
const tons = [
  { value: 'profissional', label: 'Profissional' },
  { value: 'casual', label: 'Casual' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'urgente', label: 'Urgente' },
]

const DRAFT_KEY = 'landingpro:new-landing-draft'

type FormState = {
  projeto: string
  tipo_negocio: string
  publico: string
  objetivo: string
  tom_voz: string
  cidade: string
}

const initialForm: FormState = {
  projeto: '',
  tipo_negocio: '',
  publico: '',
  objetivo: objetivos[0].value,
  tom_voz: tons[0].value,
  cidade: '',
}

export default function LandingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as FormState
      setForm({ ...initialForm, ...parsed })
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    setSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
  }, [form])

  const previewHints = useMemo(
    () => ({
      headline:
        form.projeto.trim().length > 0
          ? `${form.projeto} para ${form.publico || 'seu público ideal'}`
          : 'Sua headline aparecerá aqui',
      subheadline:
        form.tipo_negocio.trim().length > 0
          ? `Copy otimizada para ${form.tipo_negocio} com tom ${form.tom_voz}`
          : 'Descreva seu negócio para melhorar a copy',
      cta: form.objetivo === 'leads' ? 'Quero receber proposta' : form.objetivo === 'whatsapp' ? 'Falar no WhatsApp' : 'Comprar agora',
    }),
    [form],
  )

  function validateCurrentForm() {
    const errors: Partial<Record<keyof FormState, string>> = {}

    if (form.projeto.trim().length < 3) errors.projeto = 'Informe ao menos 3 caracteres.'
    if (form.tipo_negocio.trim().length < 3) errors.tipo_negocio = 'Explique melhor o tipo de negócio.'
    if (form.publico.trim().length < 3) errors.publico = 'Defina o público-alvo com mais detalhe.'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors((previous) => ({ ...previous, [key]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!validateCurrentForm()) {
      return
    }

    setLoading(true)

    try {
      const briefing = { ...form }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const result = await generateLanding({
        briefing,
        title: briefing.projeto || 'Landing Page Gerada por IA',
        save: Boolean(user?.id),
        user_id: user?.id,
        user_email: user?.email,
        user_full_name: (user?.user_metadata?.full_name as string | undefined) ?? null,
      })

      setPreview(result.generated)

      if (result.saved?.id) {
        localStorage.removeItem(DRAFT_KEY)
        router.push(`/dashboard/${result.saved.id}`)
        return
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível gerar a landing page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Projeto</h2>
          <p className="text-sm text-slate-500 mt-1">Informações base para gerar a estrutura da página.</p>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nome do Projeto *</span>
              <input
                name="projeto"
                value={form.projeto}
                onChange={(event) => setField('projeto', event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Ex.: LandingPro"
              />
              {fieldErrors.projeto && <span className="text-xs text-red-600">{fieldErrors.projeto}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tipo de Negócio *</span>
              <input
                name="tipo_negocio"
                value={form.tipo_negocio}
                onChange={(event) => setField('tipo_negocio', event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Ex.: SaaS B2B"
              />
              {fieldErrors.tipo_negocio && <span className="text-xs text-red-600">{fieldErrors.tipo_negocio}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Público-alvo *</span>
              <input
                name="publico"
                value={form.publico}
                onChange={(event) => setField('publico', event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Ex.: Donos de negócio local"
              />
              {fieldErrors.publico && <span className="text-xs text-red-600">{fieldErrors.publico}</span>}
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tom e Objetivo</h2>
          <p className="text-sm text-slate-500 mt-1">Defina intenção e linguagem da copy.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Objetivo</span>
              <select
                name="objetivo"
                value={form.objetivo}
                onChange={(event) => setField('objetivo', event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              >
                {objetivos.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tom de Voz</span>
              <select
                name="tom_voz"
                value={form.tom_voz}
                onChange={(event) => setField('tom_voz', event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              >
                {tons.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block mt-4">
            <span className="text-sm font-medium text-slate-700">Cidade (opcional)</span>
            <input
              name="cidade"
              value={form.cidade}
              onChange={(event) => setField('cidade', event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Ex.: São Paulo"
            />
          </label>

          {savedAt && (
            <p className="mt-4 text-xs text-slate-500">Rascunho salvo automaticamente às {savedAt}.</p>
          )}
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="sticky bottom-3 z-20 rounded-xl border border-indigo-200 bg-white/95 backdrop-blur p-3 shadow-lg">
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Gerando sua landing...' : 'Gerar Landing'}
          </Button>
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Preview em tempo real</h3>
          <p className="text-sm text-slate-500 mt-1">Atualiza conforme você preenche o briefing.</p>

          <div className="mt-5 rounded-lg border border-slate-200 p-4 bg-slate-50">
            <p className="text-xl font-bold text-slate-900">{previewHints.headline}</p>
            <p className="text-sm text-slate-600 mt-2">{previewHints.subheadline}</p>
            <button type="button" className="mt-4 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">
              {previewHints.cta}
            </button>
          </div>
        </div>

        {preview && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Resultado da IA</h3>
            <pre className="mt-3 text-xs overflow-auto max-h-[360px] bg-slate-50 rounded p-3 border border-slate-200">
              {JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        )}
      </aside>
    </div>
  )
}
