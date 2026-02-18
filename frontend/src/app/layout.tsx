'use client'

import './globals.css'
import Navbar from '@/components/layout/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen font-sans bg-gradient-to-br from-[#f8fafc] via-white to-[#e0e7ff] text-gray-900 relative overflow-x-hidden">
        {/* Glow decorativo */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-[60vw] h-[40vw] bg-indigo-300/30 blur-3xl rounded-full" />
          <div className="absolute right-[-10%] bottom-[-10%] w-[40vw] h-[30vw] bg-blue-200/30 blur-2xl rounded-full" />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col w-full">
            {children}
          </main>
        </div>
        <style jsx global>{`
          html { font-family: 'Inter', 'Poppins', 'Roboto', Arial, sans-serif; }
        `}</style>
      </body>
    </html>
  )
}