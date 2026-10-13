import { site } from '../data/site.js'
import { IconArrowRight } from './icons.jsx'

export default function Join() {
  const join = site.join

  return (
    <section id="join" className="join">
      <div className="container join__inner">
        <div>
          <p className="eyebrow">{join.eyebrow}</p>
          <h2 className="join__title">{join.title}</h2>
          <p className="join__lead">{join.lead}</p>
          <a className="btn join__cta" href={`mailto:${site.contact.email}`}>
            {join.ctaLabel}
            <IconArrowRight className="btn__arrow" />
          </a>
        </div>

        <div className="join__columns">
          {join.columns.map((column) => (
            <div className="join__col" key={column.title} data-reveal>
              <h3>{column.title}</h3>
              <ul>
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
