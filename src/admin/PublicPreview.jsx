import SiteHeader from '../components/SiteHeader.jsx'
import Hero from '../components/Hero.jsx'
import Research from '../components/Research.jsx'
import Team from '../components/Team.jsx'
import Facilities from '../components/Facilities.jsx'
import Sponsors from '../components/Sponsors.jsx'
import Join from '../components/Join.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { SiteContentProvider } from '../data/siteContent.jsx'

export default function PublicPreview({ content }) {
  const handlePreviewNavigation = (event) => {
    const link = event.target.closest('a[href^="#"]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || href.startsWith('#/')) {
      event.preventDefault()
      return
    }

    const target = event.currentTarget.querySelector(href)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <SiteContentProvider value={content}>
      <div className="app ap-public-preview" onClickCapture={handlePreviewNavigation}>
        <SiteHeader />
        <main>
          <Hero />
          <Research />
          <Team />
          <Facilities />
          <Sponsors />
          <Join />
        </main>
        <SiteFooter />
      </div>
    </SiteContentProvider>
  )
}
