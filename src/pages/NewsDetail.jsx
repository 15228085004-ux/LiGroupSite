import { site } from '../data/site.js'
import { newsHref, newsIndexHref } from '../hooks/useHashRoute.js'
import { useNews } from '../hooks/useSiteData.js'
import { IconArrowLeft } from '../components/icons.jsx'

export default function NewsDetail({ slug }) {
  const { news } = site
  // 按时间倒序，用于上一条 / 下一条
  const all = useNews()
  const items = [...all].sort((a, b) => b.date.localeCompare(a.date))
  const index = items.findIndex((item) => item.slug === slug)
  const item = items[index]

  if (!item) {
    return (
      <main className="page">
        <div className="container container--narrow">
          <a className="page__back" href={newsIndexHref}>
            <IconArrowLeft />
            {news.backLabel}
          </a>
          <h1 className="page__title">This news item does not exist</h1>
          <p className="page__lead">
            The link may be out of date. Head back to the news index to find what you were
            looking for.
          </p>
        </div>
      </main>
    )
  }

  const newer = items[index - 1]
  const older = items[index + 1]

  return (
    <main className="page">
      <div className="container container--narrow">
        <a className="page__back" href={newsIndexHref}>
          <IconArrowLeft />
          {news.backLabel}
        </a>

        <article className="article">
          <div className="article__meta">
            <time dateTime={item.date}>{item.dateLabel}</time>
            {item.tag ? <span className="tag tag--red">{item.tag}</span> : null}
          </div>
          <h1 className="article__title">{item.title}</h1>
          <p className="article__summary">{item.summary}</p>
          <div className="article__body">
            {item.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        {newer || older ? (
          <nav className="article__nav" aria-label="More news">
            {newer ? (
              <a className="article__nav-link" href={newsHref(newer.slug)}>
                <span className="article__nav-label">Newer</span>
                <span className="article__nav-title">{newer.title}</span>
              </a>
            ) : (
              <span />
            )}
            {older ? (
              <a className="article__nav-link article__nav-link--next" href={newsHref(older.slug)}>
                <span className="article__nav-label">Older</span>
                <span className="article__nav-title">{older.title}</span>
              </a>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </main>
  )
}
