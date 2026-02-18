import { Benefit } from '@/types/landing-page'

interface FeatureCardProps extends Benefit {}

export default function FeatureCard({ icon, titulo, descricao }: FeatureCardProps) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-600 flex flex-col items-start gap-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl group">
      {icon && <div className="text-4xl mb-2 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">{icon}</div>}
      <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">{titulo}</h3>
      <p className="text-gray-600 text-base">{descricao}</p>
    </div>
  )
}
