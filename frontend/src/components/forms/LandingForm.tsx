'use client'
import { useState } from 'react'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/Select'

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

export default function LandingForm() {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setPreview({
        headline: 'Exemplo de Headline gerada pela IA',
        subheadline: 'Subheadline persuasiva para seu negócio',
        beneficios: ['Benefício 1', 'Benefício 2', 'Benefício 3'],
        cta: 'Fale com nosso time',
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Nome do Projeto" required />
        <Input label="Tipo de Negócio" required />
        <Input label="Público-alvo" required />
        <Select label="Objetivo" options={objetivos} required />
        <Select label="Tom de Voz" options={tons} required />
        <Input label="Cidade (opcional)" />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Landing'}
        </Button>
      </form>
      {preview && (
        <div className="mt-8 p-6 bg-slate-100 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Preview</h3>
          <div className="mb-2 font-semibold">{preview.headline}</div>
          <div className="mb-2 text-muted-foreground">{preview.subheadline}</div>
          <ul className="mb-2 list-disc list-inside">
            {preview.beneficios.map((b: string, i: number) => <li key={i}>{b}</li>)}
          </ul>
          <Button variant="secondary">{preview.cta}</Button>
        </div>
      )}
    </div>
  )
}
