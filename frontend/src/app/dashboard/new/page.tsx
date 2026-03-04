import LandingForm from '@/components/forms/LandingForm'

export default function NewLandingPage() {
  return (
    <div className="p-8 space-y-2">
      <h1 className="text-3xl font-extrabold text-indigo-700">Nova Landing Page</h1>
      <p className="text-slate-600">Preencha o briefing, acompanhe o preview e gere versões com IA.</p>
      <LandingForm />
    </div>
  )
}
