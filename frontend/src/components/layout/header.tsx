"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
//import { Button } from '../ui/button'

export default function Header() {
    const pathname = usePathname()
    const isAuthenticated = false
    
    return (
    <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight">
          IA Landing Page
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`hover:underline ${pathname === '/' ? 'font-semibold' : ''}`}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={`hover:underline ${pathname.startsWith('/dashboard') ? 'font-semibold' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                {/* <Button variant="outline" size="sm">Entrar</Button> */}
                <span className="px-3 py-1 border rounded">Entrar</span>
              </Link>
              <Link href="/signup">
                {/* <Button size="sm">Criar Conta</Button> */}
                <span className="px-3 py-1 bg-primary text-white rounded">Criar Conta</span>
              </Link>
            </>
          ) : (
            <>
              {/* <Button variant="outline" size="sm">Sair</Button> */}
              <span className="px-3 py-1 border rounded">Sair</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
