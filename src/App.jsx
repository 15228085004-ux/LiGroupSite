import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useSite } from './data/siteContent.jsx'
import { useSiteMotion } from './hooks/useSiteMotion.js'
import { useHashRoute } from './hooks/useHashRoute.js'

import SiteHeader from './components/SiteHeader.jsx'
import Hero from './components/Hero.jsx'
import Research from './components/Research.jsx'
import Team from './components/Team.jsx'
import Facilities from './components/Facilities.jsx'
import Sponsors from './components/Sponsors.jsx'
import Join from './components/Join.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import BackToTop from './components/BackToTop.jsx'
import FacilitiesIndex from './pages/FacilitiesIndex.jsx'
import EquipmentProfile from './pages/EquipmentProfile.jsx'
import TeamIndex from './pages/TeamIndex.jsx'
import TeamProfile from './pages/TeamProfile.jsx'
import TeamAlumni from './pages/TeamAlumni.jsx'

const AdminApp = lazy(() => import('./admin/PlatformAdmin.jsx'))

function PublicApp() {
  const site = useSite()
  const [noticeVisible, setNoticeVisible] = useState(true)
  const showNotice = site.demoNotice?.enabled && noticeVisible
  const route = useHashRoute()
  const onHome = route.page === 'home'
  const prevPage = useRef(route.page)
  const activeNavId = onHome
    ? undefined
    : route.page === 'facilities' || route.page === 'equipment'
      ? 'facilities'
      : route.page === 'publications'
        ? 'publications'
        : route.page === 'news' || route.page === 'newsDetail'
          ? 'news'
          : 'team'

  useSiteMotion([route.page])

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const cameFromSubpage = prevPage.current !== 'home'
    prevPage.current = route.page

    if (route.page !== 'home') {
      const jump = () => {
        if (window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: 'instant' })
        }
      }
      jump()
      const raf = requestAnimationFrame(jump)
      const timer = window.setTimeout(jump, 260)
      return () => {
        cancelAnimationFrame(raf)
        window.clearTimeout(timer)
      }
    }
    if (!route.section) return undefined
    const target = document.getElementById(route.section)
    if (!target) return undefined
    const raf = requestAnimationFrame(() =>
      target.scrollIntoView({
        behavior: cameFromSubpage ? 'instant' : 'auto',
        block: 'start',
      }),
    )
    return () => cancelAnimationFrame(raf)
  }, [route.page, route.section])

  return (
    <div className={showNotice ? 'app app--notice' : 'app'}>
      {showNotice ? (
        <div className="demo-bar">
          <div className="container demo-bar__inner">
            <span>{site.demoNotice.text}</span>
            <button type="button" onClick={() => setNoticeVisible(false)}>
              Close ×
            </button>
          </div>
        </div>
      ) : null}

      <SiteHeader activeId={activeNavId} />

      {onHome ? (
        <main>
          <Hero />
          <Research />
          <Team />
          <Facilities />
          <Sponsors />
          <Join />
        </main>
      ) : null}

      {route.page === 'facilities' ? <FacilitiesIndex /> : null}
      {route.page === 'equipment' ? (
        <EquipmentProfile slug={route.slug} />
      ) : null}
      {route.page === 'team' ? <TeamIndex /> : null}
      {route.page === 'teamProfile' ? (
        <TeamProfile slug={route.slug} />
      ) : null}
      {route.page === 'teamAlumni' ? <TeamAlumni /> : null}

      <SiteFooter />
      <BackToTop />
    </div>
  )
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() =>
    window.location.hash.startsWith('#/admin'),
  )

  useEffect(() => {
    const onHashChange = () => {
      setIsAdmin(window.location.hash.startsWith('#/admin'))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return isAdmin ? (
    <Suspense
      fallback={
        <main className="ap-loading">
          <span>Loading editorial workspace…</span>
        </main>
      }
    >
      <AdminApp />
    </Suspense>
  ) : (
    <PublicApp />
  )
}
