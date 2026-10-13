import { useEffect, useState } from 'react'
import { site } from '../data/site.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import UniversityLogo from './UniversityLogo.jsx'
import SiteSearch from './SiteSearch.jsx'
import { IconClose, IconMenu, IconSearch } from './icons.jsx'

const NAV_IDS = site.nav.map((item) => item.id)

export default function SiteHeader({ activeId }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const sectionActive = useActiveSection(NAV_IDS)
  const active = activeId ?? sectionActive

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeAll = () => {
    setMenuOpen(false)
    setSearchOpen(false)
  }

  return (
    <>
      <header className={`site-header ${menuOpen ? 'is-open' : ''}`}>
        <div className="site-header__inner">
          <div className="site-header__brand">
            <a className="site-header__brand-link" href="#home">
              <UniversityLogo />
            </a>
          </div>

          <div className="site-header__content">
            <div className="site-header__row1">
              <p className="site-header__group">{site.group.name}</p>

              <p className="site-header__dept">
                {site.university.department}
                <span>{site.university.college}</span>
              </p>

              <div className="site-header__actions">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <IconSearch />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((value) => !value)}
                >
                  {menuOpen ? <IconClose /> : <IconMenu />}
                </button>
              </div>
            </div>

            <nav className="site-nav" aria-label="Main navigation">
              {site.nav.map((item) => (
                <a
                  key={item.id}
                  className={`site-nav__link ${active === item.id ? 'is-active' : ''}`}
                  href={`#${item.id}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {menuOpen ? (
          <div className="menu-panel">
            <div className="container menu-panel__inner">
              <div className="menu-panel__col">
                <p className="menu-panel__title">Navigate</p>
                <ul className="menu-panel__list">
                  {site.nav.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} onClick={closeAll}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="menu-panel__col">
                <p className="menu-panel__title">Get in touch</p>
                <ul className="menu-panel__list">
                  <li>
                    <a href={`mailto:${site.contact.email}`} onClick={closeAll}>
                      {site.contact.email}
                    </a>
                  </li>
                  <li>
                    <a href="#join" onClick={closeAll}>
                      Open positions
                    </a>
                  </li>
                  <li>
                    <a href="#publications" onClick={closeAll}>
                      Publications
                    </a>
                  </li>
                </ul>
              </div>

              <div className="menu-panel__col">
                <p className="menu-panel__title">Where to find us</p>
                <ul className="menu-panel__list menu-panel__list--plain">
                  <li>{site.contact.office}</li>
                  <li>{site.contact.address}</li>
                  <li>{site.university.name}</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {searchOpen ? <SiteSearch onClose={() => setSearchOpen(false)} /> : null}
    </>
  )
}
