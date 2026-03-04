'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LayoutDashboard, PlusSquare, X } from 'lucide-react'

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname()

  const baseLink = 'group flex items-center gap-3 rounded-lg px-3 py-2 transition'
  const showText = !collapsed

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      href: '/dashboard/new',
      label: 'Nova Landing Page',
      icon: PlusSquare,
      active: pathname === '/dashboard/new',
    },
  ]

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onCloseMobile}
      />

      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen border-r bg-white shadow-lg transition-all duration-300
          md:sticky md:top-0 md:h-screen md:shadow-none
          ${collapsed ? 'md:w-20' : 'md:w-72'}
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0'}
        `}
      >
        <div className="h-20 px-4 border-b flex items-center justify-between">
          {showText ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">LandingPro</p>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">LP</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:inline-flex rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden inline-flex rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
              aria-label="Fechar menu"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="p-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`${baseLink} ${
                      item.active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className={item.active ? 'text-indigo-700' : 'text-slate-500 group-hover:text-slate-700'} />
                    {showText && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}