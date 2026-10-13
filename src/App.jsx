import { useEffect, useState } from 'react'
import { site } from './data/site.js'
import { useSiteMotion } from './hooks/useSiteMotion.js'
import { useHashRoute } from './hooks/useHashRoute.js'

import DemoBar from './components/DemoBar.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import Hero from './components/Hero.jsx'
import Research from './components/Research.jsx'
import Team from './components/Team.jsx'
import Facilities from './components/Facilities.jsx'
import Sponsors from './components/Sponsors.jsx'
import Join from './components/Join.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import BackToTop from './components/BackToTop.jsx'
import NewsIndex from './pages/NewsIndex.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import PublicationsIndex from './pages/PublicationsIndex.jsx'
import FacilitiesIndex from './pages/FacilitiesIndex.jsx'
import TeamIndex from './pages/TeamIndex.jsx'
import TeamProfile from './pages/TeamProfile.jsx'
import TeamAlumni from './pages/TeamAlumni.jsx'

export default function App() {
  const [noticeVisible, setNoticeVisible] = useState(true)
  const showNotice = site.demoNotice.enabled && noticeVisible
  const route = useHashRoute()
  const onHome = route.page === 'home'
  // 子页面时让顶栏高亮对应的导航项（子页面没有 section 可滚动，用不到滚动侦测）
  const activeNavId = onHome
    ? undefined
    : route.page === 'facilities'
      ? 'facilities'
      : route.page === 'publications'
      ? 'publications'
      : route.page === 'news' || route.page === 'newsDetail'
        ? 'news'
        : 'team'

  // 页面加载 / 切换页面后统一接管全站动效（GSAP + ScrollTrigger）
  useSiteMotion([route.page])

  // 路由切换时的滚动：进子页面回到顶部，回首页带锚点时滚到对应 section
  useEffect(() => {
    if (route.page !== 'home') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    if (!route.section) return
    const target = document.getElementById(route.section)
    if (!target) return
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }))
  }, [route.page, route.section])

  return (
    <div className={showNotice ? 'app app--notice' : 'app'}>
      {showNotice ? <DemoBar onClose={() => setNoticeVisible(false)} /> : null}

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

      {route.page === 'news' ? <NewsIndex /> : null}
      {route.page === 'newsDetail' ? <NewsDetail slug={route.slug} /> : null}
      {route.page === 'publications' ? <PublicationsIndex /> : null}
      {route.page === 'facilities' ? <FacilitiesIndex /> : null}
      {route.page === 'team' ? <TeamIndex /> : null}
      {route.page === 'teamProfile' ? <TeamProfile slug={route.slug} /> : null}
      {route.page === 'teamAlumni' ? <TeamAlumni /> : null}

      <SiteFooter />
      <BackToTop />
    </div>
  )
}
