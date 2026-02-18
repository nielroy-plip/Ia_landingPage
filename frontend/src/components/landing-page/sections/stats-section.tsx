import { StatsSection as StatsSectionType } from '@/types/landing-page'

export default function StatsSection({ headline, stats }: StatsSectionType) {
  return (
    <section className="py-12 bg-slate-50">
      {headline && <h2 className="text-2xl font-bold text-center mb-8">{headline}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold mb-2">{stat.valor}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
