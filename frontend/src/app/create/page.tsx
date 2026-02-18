'use client'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import FreeTrialForm from '@/components/forms/free-trial-form'
import FullBriefingForm from '@/components/forms/full-briefing-form'

export default function CreateLandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 gap-8">
        <section className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Teste Grátis</h2>
          <FreeTrialForm />
        </section>
        <section className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Briefing Completo</h2>
          <FullBriefingForm />
        </section>
      </main>
      <Footer />
    </div>
  )
}
