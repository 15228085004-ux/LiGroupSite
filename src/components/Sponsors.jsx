import { site } from '../data/site.js'

/**
 * Sponsors —— 合作企业 / 赞助单位
 * 名单还没到时，首页先按 placeholderSlots 摆几个空位，版面不会塌。
 * 有 logo 之后，在 src/data/site.js 的 site.sponsors.logos 里逐条加：
 *   { name: '公司名', logo: 图片地址, href: '公司网址' }
 *
 * 每张卡片 = logo + 公司名。留空时显示占位（灰色 "Logo" 框 + "Company name"），
 * 这样版面效果和真实数据填进去之后一致。
 */
export default function Sponsors() {
  const sponsors = site.sponsors
  const hasLogos = sponsors.logos.length > 0
  const slots = hasLogos
    ? sponsors.logos
    : Array.from({ length: sponsors.placeholderSlots ?? 6 }, (_, index) => ({
        key: `slot-${index}`,
      }))

  return (
    <section id="sponsors" className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">{sponsors.eyebrow}</p>
            <h2 className="section__title">{sponsors.title}</h2>
          </div>
          {sponsors.lead ? (
            <p className="section__lead" data-reveal>
              {sponsors.lead}
            </p>
          ) : null}
        </div>

        <ul className="sponsors">
          {slots.map((partner) => (
            <li className="sponsors__item" key={partner.key || partner.name} data-reveal>
              <span className="sponsors__logo">
                {partner.logo ? (
                  partner.href ? (
                    <a href={partner.href} target="_blank" rel="noreferrer">
                      <img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
                    </a>
                  ) : (
                    <img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
                  )
                ) : (
                  <span className="sponsors__placeholder">Logo</span>
                )}
              </span>
              <span className={`sponsors__name ${partner.name ? '' : 'sponsors__name--muted'}`}>
                {partner.name || 'Company name'}
              </span>
            </li>
          ))}
        </ul>

        {!hasLogos && sponsors.note ? (
          <p className="sponsors__note">{sponsors.note}</p>
        ) : null}
      </div>
    </section>
  )
}
