import { site } from '../data/site.js'
import { publicationsHref } from '../hooks/useHashRoute.js'
import { usePublications } from '../hooks/useSiteData.js'
import SmartLink from './SmartLink.jsx'
import { IconArrowRight } from './icons.jsx'

export default function Publications() {
  const publications = site.publications
  // 首页只展示最近几条，完整列表 + 年份筛选在 #/publications
  const all = usePublications()
  const items = all.slice(0, publications.limit ?? all.length)

  return (
    <section id="publications" className="section section--tint">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">{publications.eyebrow}</p>
            <h2 className="section__title">{publications.title}</h2>
          </div>
          <p className="section__lead" data-reveal>
            {publications.lead}
          </p>
        </div>

        <div className="pub-toolbar" data-reveal>
          {publications.scholarUrl ? (
            <SmartLink className="btn btn--outline btn--sm" href={publications.scholarUrl}>
              Google Scholar
            </SmartLink>
          ) : null}
        </div>

        <div className="pub-list">
          {items.map((item) => (
            <article
              className={`pub ${item.highlight ? 'pub--highlight' : ''}`}
              key={item.title}
              data-reveal
            >
              <div className="pub__year">{item.year}</div>

              <div>
                <h3 className="pub__title">{item.title}</h3>
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

        </div>

        <a className="btn btn--outline btn--sm pub-more" href={publicationsHref}>
          {publications.viewAllLabel}
          <IconArrowRight className="btn__arrow" />
        </a>
      </div>
    </section>
  )
}
