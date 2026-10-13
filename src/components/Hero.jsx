import { useState } from 'react'
import { site } from '../data/site.js'
import { IconArrowRight } from './icons.jsx'
import HeroSlideshow from './HeroSlideshow.jsx'

export default function Hero() {
  const hero = site.hero
  const slides = hero.slides ?? []
  // 当前轮播到第几张 —— 用来显示对应的图片署名
  const [slideIndex, setSlideIndex] = useState(0)
  const credit = slides[slideIndex]?.credit

  return (
    <section
      id="home"
      className={`hero ${site.hero.slides?.length ? 'hero--media' : ''} ${
        hero.titleLine2 ? '' : 'hero--single'
      }`}
    >
      <div className="hero__bg" aria-hidden="true" />
      <HeroSlideshow onActiveChange={setSlideIndex} />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__body">
        <div className="container hero__body-inner">
          <div>
            {/* 只给一行标题时用 hero__title--single：字号收小，保证一行放得下 */}
            <h1 className={`hero__title ${hero.titleLine2 ? '' : 'hero__title--single'}`}>
              <span className="hero__title-line">{hero.titleLine1}</span>
              {hero.titleLine2 ? (
                <span className="hero__title-line hero__title-line--accent">
                  {hero.titleLine2}
                </span>
              ) : null}
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

          {/* 图片署名：CC 授权要求，跟着当前那张照片变 */}
          {credit ? (
            <p className="hero__credit">
              Photo:{' '}
              <a href={credit.href} target="_blank" rel="noreferrer">
                {credit.author}
              </a>{' '}
              · {credit.license} · Wikimedia Commons
            </p>
          ) : null}

          <div className="hero__scroll">
            <span>Scroll</span>
            <span className="hero__scroll-line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
