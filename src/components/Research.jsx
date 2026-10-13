import { site } from '../data/site.js'

export default function Research() {
  const research = site.research

  return (
    <section id="research" className="section section--tint">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">{research.eyebrow}</p>
            <h2 className="section__title">{research.title}</h2>
          </div>
          <p className="section__lead" data-reveal>
            {research.lead}
          </p>
        </div>

        <div className="research__grid">
          {research.areas.map((area, index) => (
            <article
              className="r-card"
              key={area.index}
              data-reveal
              style={{ '--reveal-delay': `${index * 80}ms` }}
            >
              <span className="r-card__index">{area.index}</span>
              <h3 className="r-card__title">{area.title}</h3>
              <p className="r-card__body">{area.body}</p>
              <div className="r-card__tags">
                {area.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="facilities" data-reveal>
          <h3 className="facilities__title">{research.equipmentTitle}</h3>
          <ul className="facilities__list">
            {research.equipment.map((item) => (
              <li className="facilities__item" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
