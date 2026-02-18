'use client'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import LandingPreview from '@/components/landing/LandingPreview'
import { mockLandingData } from '@/lib/mockData'

export default function LandingSlugPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <LandingPreview data={mockLandingData} />
        </main>
      </div>
    </div>
  )
}
