"use client"
import Button from '@/components/ui/button'

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="py-28 md:py-40 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 leading-tight tracking-tight">
              Crie landing pages de alta conversão com IA
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto md:mx-0">
              Gere páginas profissionais, persuasivas e prontas para converter em segundos. Deixe a inteligência artificial criar o texto perfeito para seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <Button href="/register" variant="primary" size="lg" className="shadow-lg hover:scale-[1.04] focus:ring-2 focus:ring-indigo-300 transition-all duration-200">
                Comece grátis
              </Button>
              <Button href="/login" variant="secondary" size="lg" className="hover:scale-[1.04] focus:ring-2 focus:ring-indigo-200 transition-all duration-200">
                Entrar
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
              alt="Landing Page Creation"
              className="w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 bg-white/70 transition-transform duration-300 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
            Por que usar o LandingPro?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div className="p-8 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-start gap-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
              <div className="text-4xl mb-2 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">⚡</div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">Rápido</h3>
              <p className="text-gray-600 text-base">Gere páginas em segundos, sem precisar de design ou código.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-start gap-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
              <div className="text-4xl mb-2 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">🎨</div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">Personalizável</h3>
              <p className="text-gray-600 text-base">Adapte cada detalhe ao seu negócio e público.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-start gap-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
              <div className="text-4xl mb-2 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">🤖</div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">IA Avançada</h3>
              <p className="text-gray-600 text-base">Textos persuasivos e otimizados automaticamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <div className="p-10 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-center gap-6 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 text-3xl font-bold mb-2 group-hover:bg-indigo-200 transition-colors duration-200">
                1
              </div>
              <h3 className="font-bold text-xl text-gray-900 text-center group-hover:text-indigo-700 transition-colors duration-200">
                Preencha o briefing
              </h3>
              <p className="text-gray-600 text-center text-base">Conte para a IA sobre seu produto, público e objetivos.</p>
            </div>
            <div className="p-10 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-center gap-6 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 text-3xl font-bold mb-2 group-hover:bg-indigo-200 transition-colors duration-200">
                2
              </div>
              <h3 className="font-bold text-xl text-gray-900 text-center group-hover:text-indigo-700 transition-colors duration-200">
                IA gera sua página
              </h3>
              <p className="text-gray-600 text-center text-base">Receba uma página pronta para converter, com textos e layout profissionais.</p>
            </div>
            <div className="p-10 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-center gap-6 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 text-3xl font-bold mb-2 group-hover:bg-indigo-200 transition-colors duration-200">
                3
              </div>
              <h3 className="font-bold text-xl text-gray-900 text-center group-hover:text-indigo-700 transition-colors duration-200">
                Publique e converta
              </h3>
              <p className="text-gray-600 text-center text-base">Personalize, publique e acompanhe seus resultados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-indigo-200 via-white to-blue-100">
        <div className="max-w-7xl mx-auto px-8 flex justify-center">
          <div className="text-center p-12 rounded-3xl shadow-2xl bg-white/90 border border-slate-200 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-700 tracking-tight">
              Comece agora grátis
            </h2>
            <p className="text-xl text-gray-700 mb-10">
              Teste o LandingPro e gere sua primeira página em segundos. Sem cartão de crédito.
            </p>
            <Button href="/register" variant="primary" size="lg" className="shadow-lg hover:scale-[1.04] focus:ring-2 focus:ring-indigo-300 transition-all duration-200">
              Criar minha conta
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}