'use client'
import Button from '@/components/ui/button'

type Props = {
  data: {
    headline: string
    subheadline: string
    beneficios: string[]
    cta: string
  }
}

export default function LandingPreview({ data }: Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-8 mt-8">
      <h1 className="text-3xl font-bold mb-2">{data.headline}</h1>
      <h2 className="text-lg text-muted-foreground mb-4">{data.subheadline}</h2>
      <ul className="mb-6 list-disc list-inside">
        {data.beneficios.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <Button variant="primary" size="lg">{data.cta}</Button>
    </div>
  )
}
