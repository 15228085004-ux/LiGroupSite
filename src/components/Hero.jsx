import { site } from '../data/site.js'
import { IconArrowRight } from './icons.jsx'
import HeroSlideshow from './HeroSlideshow.jsx'

export default function Hero() {
  const hero = site.hero

  return (
    <section id="home" className={`hero ${site.hero.slides?.length ? 'hero--media' : ''}`}>
      <div className="hero__bg" aria-hidden="true" />
      <HeroSlideshow />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__body">
        <div className="container hero__body-inner">
          <div>
            <h1 className="hero__title">
              <span className="hero__title-line">{hero.titleLine1}</span>
              <span className="hero__title-line hero__title-line--accent">
                {hero.titleLine2}
              </span>
            </h1>
          </div>

          <div className="hero__panel">
            <p className="hero__lead">{hero.lead}</p>

            <div className="hero__actions">
              <a className="btn btn--primary" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <IconArrowRight className="btn__arrow" />
              </a>
              <a className="btn btn--ghost" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </a>
            </div>

            <ul className="hero__meta">
              {hero.meta.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="hero__footer">
        <div className="container hero__footer-inner">
          <ul className="hero__stats">
            {site.stats.map((stat) => (
              <li key={stat.label}>
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>

          <div className="hero__scroll">
            <span>Scroll</span>
            <span className="hero__scroll-line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
