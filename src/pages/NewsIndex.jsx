import { site } from '../data/site.js'
import { newsHref } from '../hooks/useHashRoute.js'
import { useNews } from '../hooks/useSiteData.js'
import { IconArrowRight } from '../components/icons.jsx'

export default function NewsIndex() {
  const { news } = site
  const all = useNews()
  const items = [...all].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="page">
      <div className="container">
        <header className="page__head">
          <p className="eyebrow">{news.eyebrow}</p>
          <h1 className="page__title">{news.title}</h1>
          <p className="page__lead">{news.lead}</p>
        </header>

        <ul className="news-list">
          {items.map((item) => (
            <li className="news-list__item" key={item.slug} data-reveal>
              <a className="news-list__link" href={newsHref(item.slug)}>
                <span className="news-list__meta">
                  <time dateTime={item.date}>{item.dateLabel}</time>
                  {item.tag ? <span className="tag tag--red">{item.tag}</span> : null}
                </span>
                <span className="news-list__body">
                  <span className="news-list__title">{item.title}</span>
                  <span className="news-list__summary">{item.summary}</span>
                </span>
                <IconArrowRight className="news-list__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
