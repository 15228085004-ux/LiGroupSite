import { site } from '../data/site.js'
import { interpolate } from '../utils/format.js'

export default function About() {
  const about = site.about

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 className="section__title">{about.title}</h2>
          </div>
          <p className="section__lead" data-reveal>
            {interpolate(about.paragraphs[0], site)}
          </p>
        </div>

        <div className="about__grid">
          <div className="about__text" data-reveal>
            <p>{interpolate(about.paragraphs[1], site)}</p>
            <blockquote className="about__quote">
              <p>{about.quote}</p>
              <cite>{about.quoteBy}</cite>
            </blockquote>
          </div>

          <div className="pillars">
            {about.pillars.map((pillar, index) => (
              <article
                className="pillar"
                key={pillar.title}
                data-reveal
                style={{ '--reveal-delay': `${index * 90}ms` }}
              >
                <h3 className="pillar__title">{pillar.title}</h3>
                <p className="pillar__body">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
