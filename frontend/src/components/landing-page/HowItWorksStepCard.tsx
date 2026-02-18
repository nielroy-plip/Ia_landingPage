import { Step } from '@/types/landing-page'

interface HowItWorksStepCardProps extends Step {}

export default function HowItWorksStepCard({ icon, numero, titulo, descricao }: HowItWorksStepCardProps) {
  return (
    <div className="p-10 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-center gap-6 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 text-3xl font-bold mb-2 group-hover:bg-indigo-200 transition-colors duration-200">
        {icon ? icon : numero}
      </div>
      <h3 className="font-bold text-xl text-gray-900 text-center group-hover:text-indigo-700 transition-colors duration-200">{titulo}</h3>
      <p className="text-gray-600 text-center text-base">{descricao}</p>
    </div>
  )
}
