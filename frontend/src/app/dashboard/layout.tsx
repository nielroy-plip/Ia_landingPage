'use client'
import { useState } from 'react'
import { PanelLeft } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarCollapsed((previous) => !previous)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-4 pt-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <PanelLeft size={16} />
            Menu
          </button>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
