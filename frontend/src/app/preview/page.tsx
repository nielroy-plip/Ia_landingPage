import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import LandingPageRenderer from '@/components/landing-page/renderer'

// Exemplo de dados para preview
const landingPageData = {
  meta: {
    titulo: 'Landing Page Preview',
    descricao: 'Preview da landing page gerada pela IA',
  },
  hero: {
    headline: 'Seu produto incrível',
    subheadline: 'Descrição persuasiva gerada pela IA.',
    cta_primary: { texto: 'Comprar agora', url: '/checkout' },
    cta_secondary: { texto: 'Saiba mais', url: '/info' },
  },
  benefits: {
    headline: 'Por que escolher?',
    items: [
      { titulo: 'Automático', descricao: 'Geração instantânea.' },
      { titulo: 'Personalizado', descricao: 'Briefing adaptado.' },
      { titulo: 'Conversão máxima', descricao: 'Textos otimizados.' },
    ],
  },
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-slate-50">
        <LandingPageRenderer data={landingPageData} />
      </main>
      <Footer />
    </div>
  )
}
