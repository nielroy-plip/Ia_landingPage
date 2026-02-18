
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import LandingForm from '@/components/forms/LandingForm'

export default function NewLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">Nova Landing Page</h1>
          <LandingForm />
        </main>
      </div>
    </div>
  )
}
