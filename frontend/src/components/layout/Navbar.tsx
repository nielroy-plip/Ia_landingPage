"use client"
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto flex h-20 items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-indigo-700 hover:text-indigo-900 transition-colors duration-200">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#6366F1"/><path d="M10 22L16 10L22 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          LandingPro
        </Link>
        {/* Ações */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all duration-200">Entrar</Link>
          <Link href="/register" className="px-5 py-2 rounded-xl font-semibold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition-all duration-200">Criar Conta</Link>
        </div>
      </div>
    </nav>
  )
}