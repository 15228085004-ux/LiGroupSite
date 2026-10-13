import { site } from '../data/site.js'
import { newsHref, newsIndexHref } from '../hooks/useHashRoute.js'
import { useNews } from '../hooks/useSiteData.js'
import { IconArrowRight } from './icons.jsx'

export default function News() {
  const news = site.news
  // 条目来自接口或静态数据；下面的标题 / 文案仍来自 site.js
  const all = useNews()
  const items = [...all]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, news.limit ?? all.length)

  return (
    <section id="news" className="section">
      <div className="container news__grid">
        <div className="news__sticky">
          <p className="eyebrow">{news.eyebrow}</p>
          <h2 className="section__title">{news.title}</h2>
          <a className="btn btn--outline btn--sm news__more" href={newsIndexHref}>
            {news.viewAllLabel}
            <IconArrowRight className="btn__arrow" />
          </a>
        </div>

        <ul className="news__list">
          {items.map((item, index) => (
            <li
              className="news__item"
              key={item.slug}
              data-reveal
              style={{ '--reveal-delay': `${index * 70}ms` }}
            >
              <span className="news__date">{item.dateLabel}</span>
              <a className="news__text news__link" href={newsHref(item.slug)}>
                {item.title}
                <IconArrowRight className="news__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
