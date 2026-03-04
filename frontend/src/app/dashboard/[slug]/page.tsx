'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import LandingPageRenderer from '@/components/landing-page/renderer'
import {
  createLandingPageVersion,
  getLandingPage,
  listLandingPageVersions,
  restoreLandingPageVersion,
  type LandingPageRecord,
  type LandingPageVersionRecord,
} from '@/lib/backend/api'
import { LandingPageStructure } from '@/types/landing-page'

export default function LandingSlugPage() {
  const params = useParams<{ slug: string }>()
  const [page, setPage] = useState<LandingPageRecord | null>(null)
  const [versions, setVersions] = useState<LandingPageVersionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function loadPageAndVersions() {
      try {
        const [pageData, versionsData] = await Promise.all([
          getLandingPage(params.slug),
          listLandingPageVersions(params.slug),
        ])
        setPage(pageData)
        setVersions(versionsData)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar landing page')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      void loadPageAndVersions()
    }
  }, [params.slug])

  const content = (page?.content ?? null) as LandingPageStructure | null

  async function refreshVersionsAndPage() {
    if (!params.slug) return
    const [pageData, versionsData] = await Promise.all([
      getLandingPage(params.slug),
      listLandingPageVersions(params.slug),
    ])
    setPage(pageData)
    setVersions(versionsData)
  }

  async function handleCreateSnapshot() {
    if (!params.slug) return
    setActionLoading(true)
    setError(null)
    setInfo(null)

    try {
      await createLandingPageVersion(params.slug, 'Snapshot manual pelo dashboard')
      await refreshVersionsAndPage()
      setInfo('Snapshot criado com sucesso.')
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Falha ao criar snapshot')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRestoreVersion(version: LandingPageVersionRecord) {
    if (!params.slug) return
    const confirmed = window.confirm(`Deseja restaurar a versão v${version.version_number}?`)
    if (!confirmed) return

    setActionLoading(true)
    setError(null)
    setInfo(null)

    try {
      await restoreLandingPageVersion(params.slug, version.id)
      await refreshVersionsAndPage()
      setInfo(`Versão v${version.version_number} restaurada com sucesso.`)
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Falha ao restaurar versão')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-6 items-start">
      {loading && <p className="text-gray-500">Carregando landing...</p>}

      {!loading && (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-indigo-700">{page?.title ?? 'Preview da Landing'}</h1>
              <p className="text-sm text-slate-500">Status atual: {page?.status ?? 'indefinido'}</p>
            </div>

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            {info && <p className="text-sm text-emerald-700 mb-3">{info}</p>}

            {!error && content && <LandingPageRenderer data={content} />}
            {!error && !content && (
              <p className="text-sm text-gray-500">Landing sem conteúdo válido para renderização.</p>
            )}
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Versões</h2>
              <button
                type="button"
                onClick={handleCreateSnapshot}
                disabled={actionLoading}
                className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                + Snapshot
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-1">Restaure versões anteriores a qualquer momento.</p>

            <div className="mt-4 space-y-3 max-h-[560px] overflow-auto pr-1">
              {versions.length === 0 && (
                <p className="text-sm text-slate-500">Nenhuma versão registrada ainda.</p>
              )}

              {versions.map((version) => (
                <div key={version.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">v{version.version_number}</p>
                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(version)}
                      disabled={actionLoading}
                      className="px-2 py-1 rounded border border-slate-300 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      Restaurar
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{new Date(version.created_at).toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{version.reason || 'Sem descrição'}</p>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
