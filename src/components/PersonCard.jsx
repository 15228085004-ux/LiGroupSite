import { IconArrowRight } from './icons.jsx'

/** 后端可能不填 initials，缺了就按姓名自动取两个首字母，避免出现空白占位块 */
function initialsFrom(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * 人员卡片。在读成员（#/team）和毕业校友（#/team/alumni）共用同一个组件、
 * 同一套尺寸 —— 照片都是 1:1 方形、同一列宽，两边看起来完全一致。
 *
 * 字段分工（两边一致）：
 *   name    姓名
 *   role    红色小字，例如 'Ph.D. Student' / 'M.S. Student'
 *   line    灰色正文，例如研究方向 / 现任职位
 *   foot    底部小字，例如 'Since 2026' / '2026 – 2027'
 * 传了 href 整张卡片可点，没传就是静态卡片。
 */
export default function PersonCard({ person, delay = 0 }) {
  const { href, name, role, line, foot, photo, initials } = person
  const Wrapper = href ? 'a' : 'div'

  return (
    <Wrapper
      className={`person-card ${href ? 'person-card--link' : ''}`}
      data-reveal
      style={{ '--reveal-delay': `${delay}ms` }}
      {...(href ? { href, 'aria-label': `${name} — profile` } : {})}
    >
      <span className="person-card__photo">
        {photo ? (
          <img src={photo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="person-card__initials" aria-hidden="true">
            {initials || initialsFrom(name)}
          </span>
        )}
      </span>

      <span className="person-card__body">
        <span className="person-card__name">{name}</span>
        {role ? <span className="person-card__role">{role}</span> : null}
        {line ? <span className="person-card__line">{line}</span> : null}
        {foot || href ? (
          <span className="person-card__foot">
            <span className="person-card__meta">{foot}</span>
            {href ? <IconArrowRight className="person-card__arrow" /> : null}
          </span>
        ) : null}
      </span>
    </Wrapper>
  )
}
