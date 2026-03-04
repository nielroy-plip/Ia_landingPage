"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  createLandingPage,
  deleteLandingPage,
  listLandingPages,
  type LandingPageRecord,
  updateLandingPage,
} from '@/lib/backend/api'
import { createClient } from '@/lib/supabase/client'

type StatusFilter = 'all' | 'draft' | 'published'
type SortMode = 'recent' | 'oldest' | 'az'

export default function DashboardPage() {
  const [pages, setPages] = useState<LandingPageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadPages() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user?.id) {
          setPages([])
          return
        }

        setUserId(user.id)
        setUserEmail(user.email ?? null)
        setUserName((user.user_metadata?.full_name as string | undefined) ?? null)

        const data = await listLandingPages(user.id)
        setPages(data)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar landing pages')
      } finally {
        setLoading(false)
      }
    }

    void loadPages()
  }, [])

  const filteredPages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    let result = pages.filter((page) => {
      const matchStatus = statusFilter === 'all' ? true : page.status === statusFilter
      const matchSearch = normalizedSearch.length === 0
        ? true
        : page.title.toLowerCase().includes(normalizedSearch)

      return matchStatus && matchSearch
    })

    result = [...result].sort((left, right) => {
      if (sortMode === 'az') {
        return left.title.localeCompare(right.title, 'pt-BR')
      }

      const leftTime = new Date(left.created_at).getTime()
      const rightTime = new Date(right.created_at).getTime()
      return sortMode === 'oldest' ? leftTime - rightTime : rightTime - leftTime
    })

    return result
  }, [pages, search, statusFilter, sortMode])

  const stats = useMemo(() => {
    const total = pages.length
    const draft = pages.filter((item) => item.status === 'draft').length
    const published = pages.filter((item) => item.status === 'published').length
    return { total, draft, published }
  }, [pages])

  async function refreshPages() {
    if (!userId) return
    const data = await listLandingPages(userId)
    setPages(data)
  }

  async function handleDuplicate(page: LandingPageRecord) {
    if (!userId) return
    setActionLoadingId(page.id)
    setError(null)

    try {
      await createLandingPage({
        user_id: userId,
        user_email: userEmail,
        user_full_name: userName,
        title: `${page.title} (Cópia)`,
        briefing: page.briefing,
        content: page.content,
        status: 'draft',
      })
      await refreshPages()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Falha ao duplicar landing')
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleToggleStatus(page: LandingPageRecord) {
    setActionLoadingId(page.id)
    setError(null)

    try {
      const nextStatus = page.status === 'published' ? 'draft' : 'published'
      await updateLandingPage(page.id, { status: nextStatus })
      await refreshPages()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Falha ao atualizar status')
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDelete(page: LandingPageRecord) {
    const confirmed = window.confirm(`Deseja excluir a landing \"${page.title}\"?`)
    if (!confirmed) return

    setActionLoadingId(page.id)
    setError(null)

    try {
      await deleteLandingPage(page.id)
      await refreshPages()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Falha ao excluir landing')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700">Minhas Landings</h1>
          <p className="text-gray-600 mt-1">Veja, filtre e gerencie as versões geradas com IA.</p>
        </div>
        <Link href="/dashboard/new" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 transition">
          + Nova Landing
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Rascunhos</p>
          <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Publicadas</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.published}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título..."
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="all">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
        <select
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value as SortMode)}
          className="rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="recent">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      {loading && <p className="text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!loading && filteredPages.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500 flex flex-col gap-2">
            <h2 className="font-semibold text-lg mb-1 text-indigo-700">Nenhuma landing criada ainda</h2>
            <p className="text-gray-500 mb-1">Crie sua primeira landing em Nova Landing Page.</p>
          </div>
        )}

        {filteredPages.map((page) => (
          <div key={page.id} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-lg text-indigo-700 line-clamp-2">{page.title}</h2>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${page.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {page.status}
              </span>
            </div>

            <p className="text-xs text-slate-500">Criada em {new Date(page.created_at).toLocaleString('pt-BR')}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link href={`/dashboard/${page.id}`} className="inline-block px-3 py-2 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                Ver Preview
              </Link>
              <button
                type="button"
                onClick={() => handleToggleStatus(page)}
                disabled={actionLoadingId === page.id}
                className="px-3 py-2 rounded border border-slate-300 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                {page.status === 'published' ? 'Voltar para rascunho' : 'Publicar'}
              </button>
              <button
                type="button"
                onClick={() => handleDuplicate(page)}
                disabled={actionLoadingId === page.id}
                className="px-3 py-2 rounded border border-slate-300 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Duplicar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(page)}
                disabled={actionLoadingId === page.id}
                className="px-3 py-2 rounded border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
