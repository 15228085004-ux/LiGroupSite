import { site } from '../data/site.js'
import { facilitiesHref, equipmentHref } from '../hooks/useHashRoute.js'
import { allEquipment, equipmentSlug } from '../utils/equipment.js'
import SmartLink from '../components/SmartLink.jsx'
import { IconArrowLeft, IconArrowRight } from '../components/icons.jsx'

/* 首页的 Lab Facilities 区块（注意不是 #/facilities 那个列表页） */
const facilitiesSectionHref = '#facilities'

/**
 * #/facilities/<slug> —— 单台设备的页面。
 *
 * 每台设备可以放多张照片 + 一段（或多段）介绍，内容在
 * src/data/site.js 的 site.facilities.groups[].items[] 里填：
 *   photos  照片数组，可以放多张；只有一张也可以直接写 photo
 *   intro   介绍，字符串或字符串数组（多段）
 * 什么都不填时，页面显示占位框 + 一句话说明，版面不会塌。
 */
export default function EquipmentProfile({ slug }) {
  const lab = site.facilities
  const all = allEquipment()
  const item = all.find((entry) => entry.slug === slug)

  if (!item) {
    return (
      <main className="page">
        <div className="container container--narrow">
          <div className="page__back-row">
            <a className="page__back" href={facilitiesSectionHref}>
              <IconArrowLeft />
              {lab.backLabel}
            </a>
            <SmartLink className="page__back page__back--next" href={facilitiesHref}>
              {lab.allEquipmentLabel}
              <IconArrowRight />
            </SmartLink>
          </div>
          <h1 className="page__title">This equipment page does not exist</h1>
          <p className="page__lead">
            The link may be out of date. Head back to the facilities list to find what you
            were looking for.
          </p>
        </div>
      </main>
    )
  }

  const photos = item.photos?.length ? item.photos : item.photo ? [item.photo] : []
  const intro = Array.isArray(item.intro) ? item.intro : item.intro ? [item.intro] : []

  const index = all.findIndex((entry) => entry.slug === item.slug)
  const prev = index > 0 ? all[index - 1] : null
  const next = index < all.length - 1 ? all[index + 1] : null

  return (
    <main className="page">
      <div className="container">
        {/*
          两个入口，各去各的地方：
            ① Back to the lab facilities → 首页的 Lab Facilities 区块（能继续上下滚）
            ② View all equipment         → #/facilities 设备列表页（14 台全在里面）
        */}
        <div className="page__back-row">
          <a className="page__back" href={facilitiesSectionHref}>
            <IconArrowLeft />
            {lab.backLabel}
          </a>
          <SmartLink className="page__back page__back--next" href={facilitiesHref}>
            {lab.allEquipmentLabel}
            <IconArrowRight />
          </SmartLink>
        </div>

        <header className="page__head page__head--tight">
          <p className="eyebrow">{item.group}</p>
          <h1 className="page__title">{item.name}</h1>
          {item.body ? <p className="page__lead">{item.body}</p> : null}
        </header>

        <div className="equip-profile">
          <div className="equip-profile__media">
            {photos.length ? (
              <img src={photos[0]} alt={item.name} />
            ) : (
              <span className="equip-card__placeholder">Photo</span>
            )}
          </div>

          <div className="equip-profile__body">
            {intro.length ? (
              intro.map((paragraph, i) => <p key={i}>{paragraph}</p>)
            ) : (
              <p className="equip-profile__empty">
                A longer description of this instrument will be added here — what it measures,
                how it is used in the group’s work, and its key specifications.
              </p>
            )}
          </div>
        </div>

        {/* 还有更多照片时，在下面铺开 */}
        {photos.length > 1 ? (
          <div className="equip-gallery">
            {photos.slice(1).map((src, i) => (
              <img src={src} alt={`${item.name} — ${i + 2}`} key={src} data-reveal />
            ))}
          </div>
        ) : null}

        <nav className="article__nav" aria-label="More equipment">
          {prev ? (
            <a className="article__nav-link" href={equipmentHref(prev.slug)}>
              <span className="article__nav-label">Previous</span>
              <span className="article__nav-title">{prev.name}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a className="article__nav-link article__nav-link--next" href={equipmentHref(next.slug)}>
              <span className="article__nav-label">Next</span>
              <span className="article__nav-title">{next.name}</span>
            </a>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  )
}
