import { useEffect, useRef, useState } from 'react'
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
import EquipmentProfile from './pages/EquipmentProfile.jsx'
import TeamIndex from './pages/TeamIndex.jsx'
import TeamProfile from './pages/TeamProfile.jsx'
import TeamAlumni from './pages/TeamAlumni.jsx'

export default function App() {
  const [noticeVisible, setNoticeVisible] = useState(true)
  const showNotice = site.demoNotice.enabled && noticeVisible
  const route = useHashRoute()
  const onHome = route.page === 'home'
  // 上一次在哪个页面 —— 用来判断这次是不是「从子页面回到首页」
  const prevPage = useRef(route.page)
  // 子页面时让顶栏高亮对应的导航项（子页面没有 section 可滚动，用不到滚动侦测）
  const activeNavId = onHome
    ? undefined
    : route.page === 'facilities' || route.page === 'equipment'
      ? 'facilities'
      : route.page === 'publications'
      ? 'publications'
      : route.page === 'news' || route.page === 'newsDetail'
        ? 'news'
        : 'team'

  // 页面加载 / 切换页面后统一接管全站动效（GSAP + ScrollTrigger）
  useSiteMotion([route.page])

  /*
    关掉浏览器自带的「滚动位置恢复」。
    单页应用里它专门捣乱：从学生页点 "View all people" 回到 #/team 时，
    浏览器会把上一次访问 #/team 时的滚动位置恢复出来，页面就卡在中间、回不到顶部。
  */
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // 路由切换时的滚动：进子页面回到顶部，回首页带锚点时滚到对应 section
  useEffect(() => {
    const cameFromSubpage = prevPage.current !== 'home'
    prevPage.current = route.page

    if (route.page !== 'home') {
      /*
        进子页面必须回到顶部。这里连补三次：
          - 立刻一次
          - 下一帧一次（等新版内容渲染完）
          - 260ms 后一次（ScrollTrigger 的 refresh 是异步的，它偶尔会把
            滚动位置"恢复"回旧值）
        用 instant 而不是 auto：auto 会走 CSS 的 scroll-behavior: smooth，
        跨页面时那种慢速滚动看起来像卡住。
      */
      const jump = () => {
        if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: 'instant' })
      }
      jump()
      const raf = requestAnimationFrame(jump)
      const timer = window.setTimeout(jump, 260)
      return () => {
        cancelAnimationFrame(raf)
        window.clearTimeout(timer)
      }
    }
    if (!route.section) return
    const target = document.getElementById(route.section)
    if (!target) return
    /*
      从子页面回到首页：直接落位（instant）。
      本来就在首页点导航：保持浏览器自己的平滑滚动（auto = 跟随 CSS 的 smooth），
      那种小小的滑动是想要的。
    */
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
      {route.page === 'equipment' ? <EquipmentProfile slug={route.slug} /> : null}
      {route.page === 'team' ? <TeamIndex /> : null}
      {route.page === 'teamProfile' ? <TeamProfile slug={route.slug} /> : null}
      {route.page === 'teamAlumni' ? <TeamAlumni /> : null}

      <SiteFooter />
      <BackToTop />
    </div>
  )
}
