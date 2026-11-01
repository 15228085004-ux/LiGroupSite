import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { groupApi } from '../lib/groupApi.js'
import {
  createDefaultSiteContent,
  normalizeSiteContent,
} from './contentModel.js'

const SiteContentContext = createContext(null)

export function SiteContentProvider({ children, value }) {
  const [content, setContent] = useState(() =>
    value ? normalizeSiteContent(value) : createDefaultSiteContent(),
  )
  const [loaded, setLoaded] = useState(Boolean(value))

  useEffect(() => {
    if (value) {
      setContent(normalizeSiteContent(value))
      setLoaded(true)
      return undefined
    }

    let cancelled = false
    groupApi
      .getPublishedContent()
      .then((published) => {
        if (!cancelled) {
          setContent(normalizeSiteContent(published))
          setLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })

    const refreshOnReturn = () => {
      if (window.location.hash.startsWith('#/admin')) return
      groupApi
        .getPublishedContent()
        .then((published) => {
          if (!cancelled) {
            setContent(normalizeSiteContent(published))
            setLoaded(true)
          }
        })
        .catch(() => {
          // Keep the last successfully loaded document.
        })
    }
    window.addEventListener('hashchange', refreshOnReturn)

    return () => {
      cancelled = true
      window.removeEventListener('hashchange', refreshOnReturn)
    }
  }, [value])

  const contextValue = useMemo(
    () => ({ content, loaded }),
    [content, loaded],
  )

  return (
    <SiteContentContext.Provider value={contextValue}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContentContext)
  if (!context) {
    throw new Error('useSite must be used inside SiteContentProvider')
  }
  return context.content
}

export function useSiteLoading() {
  const context = useContext(SiteContentContext)
  return context?.loaded ?? false
}

export { normalizeSiteContent, createDefaultSiteContent }
