import { useMemo, useState } from 'react'
import { site } from '../data/site.js'
import { usePublications } from '../hooks/useSiteData.js'
import SmartLink from '../components/SmartLink.jsx'

export default function PublicationsIndex() {
  const publications = site.publications
  const all = usePublications()

  const years = useMemo(() => {
    const unique = [...new Set(all.map((item) => item.year))]
    return ['All', ...unique.sort((a, b) => Number(b) - Number(a))]
  }, [all])

  const [filter, setFilter] = useState('All')

  const visible =
    filter === 'All'
      ? all
      : all.filter((item) => item.year === filter)

  return (
    <main className="page">
      <div className="container">
        <header className="page__head">
          <p className="eyebrow">{publications.eyebrow}</p>
          <h1 className="page__title">{publications.pageTitle}</h1>
          <p className="page__lead">{publications.pageLead}</p>
        </header>

        <div className="pub-toolbar">
          <div className="pub-tabs" role="tablist" aria-label="Filter publications by year">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={filter === year}
                className={`pub-tab ${filter === year ? 'is-active' : ''}`}
                onClick={() => setFilter(year)}
              >
                {year}
              </button>
            ))}
          </div>

          {publications.scholarUrl ? (
            <SmartLink className="btn btn--outline btn--sm" href={publications.scholarUrl}>
              Google Scholar
            </SmartLink>
          ) : null}
        </div>

        <div className="pub-list">
          {visible.map((item) => (
            <article
              className={`pub ${item.highlight ? 'pub--highlight' : ''}`}
              key={item.title}
              data-reveal
            >
              <div className="pub__year">{item.year}</div>

              <div>
                <h2 className="pub__title">{item.title}</h2>
                <p className="pub__authors">{item.authors}</p>
                <p className="pub__venue">{item.venue}</p>
              </div>

              <div className="pub__links">
                {item.links.map((link) => (
                  <SmartLink className="pub__link" href={link.href} key={link.label}>
                    {link.label}
                  </SmartLink>
                ))}
              </div>
            </article>
          ))}

          {visible.length === 0 ? (
            <p className="pub-empty">No publications listed for this year yet.</p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
