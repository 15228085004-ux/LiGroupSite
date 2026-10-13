import { useEffect, useState } from 'react'

/**
 * 极简 hash 路由。用 hash 而不是 history API 的原因：
 * 站点要挂到学校服务器，可能在任何子目录下，hash 路由不需要服务端重写规则。
 *
 *   #home / #research / …   → 首页（并滚动到对应 section）
 *   #/news                  → 全部新闻
 *   #/news/<slug>           → 单条新闻详情
 *   #/facilities            → 实验室与设备的完整页面
 *   #/facilities/<slug>     → 单台设备的页面
 */

export const newsIndexHref = '#/news'
export const newsHref = (slug) => `#/news/${slug}`
export const publicationsHref = '#/publications'
export const facilitiesHref = '#/facilities'
export const equipmentHref = (slug) => `#/facilities/${slug}`
export const teamIndexHref = '#/team'
export const teamHref = (slug) => `#/team/${slug}`
export const teamAlumniHref = '#/team/alumni'

export function parseHash(hash) {
  const raw = String(hash || '').replace(/^#/, '')

  if (raw.startsWith('/')) {
    const parts = raw.slice(1).split('/').filter(Boolean)
    if (parts[0] === 'news') {
      return parts[1]
        ? { page: 'newsDetail', slug: decodeURIComponent(parts[1]) }
        : { page: 'news' }
    }
    if (parts[0] === 'publications') {
      return { page: 'publications' }
    }
    if (parts[0] === 'facilities') {
      return parts[1]
        ? { page: 'equipment', slug: decodeURIComponent(parts[1]) }
        : { page: 'facilities' }
    }
    if (parts[0] === 'team') {
      if (parts[1] === 'alumni') return { page: 'teamAlumni' }
      return parts[1]
        ? { page: 'teamProfile', slug: decodeURIComponent(parts[1]) }
        : { page: 'team' }
    }
    return { page: 'home', section: '' }
  }

  return { page: 'home', section: raw }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}
