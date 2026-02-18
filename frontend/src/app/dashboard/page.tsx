import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'


export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">Minhas Landings</h1>
          <p className="text-gray-600 mb-8">Veja e gerencie suas landing pages geradas com IA.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exemplo de card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500 flex flex-col gap-2">
              <h2 className="font-semibold text-lg mb-1 text-indigo-700">Landing de Teste</h2>
              <p className="text-gray-500 mb-1">Projeto: SaaS IA</p>
              <a href="/dashboard/teste-ia" className="inline-block mt-2 px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">Ver Preview</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
