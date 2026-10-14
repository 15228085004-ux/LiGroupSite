import { useEffect, useMemo, useRef, useState } from 'react'
import { site } from '../data/site.js'
import { facilitiesHref } from '../hooks/useHashRoute.js'
import { useMembers } from '../hooks/useSiteData.js'
import { IconSearch } from './icons.jsx'

/**
 * 把站内内容摊平成一张可以本地搜索的索引（不联网）。
 * 成员用接口或静态数据统一喂进来，保证搜索结果和页面显示一致。
 *
 * 注意：**论文和新闻暂时不放进搜索索引**（方案 B，2026-10-14）。
 * 首页和导航里已经没有这两个板块，把索引也去掉之后，
 * 站内就彻底搜不到那些占位论文 / 占位新闻了。
 * 以后要恢复：把下面注释掉的那两段 forEach 放回来，
 * 再把 usePublications / useNews 和 newsHref / publicationsHref 的 import 加回来即可。
 */
function buildIndex({ members }) {
  const items = []

  site.research.areas.forEach((area) =>
    items.push({
      type: 'Research',
      title: area.title,
      meta: area.body,
      href: '#research',
    }),
  )

  items.push({
    type: 'Team',
    title: site.team.pi.name,
    meta: `${site.team.pi.role} · ${site.team.pi.affiliation}`,
    href: '#team',
  })

  // 实验室设备也进搜索：搜 "filtration" 能直接命中 Lab Facilities
  site.facilities.groups.forEach((group) =>
    items.push({
      type: 'Facilities',
      title: group.title,
      meta: group.items.map((item) => item.name).join(' · '),
      href: facilitiesHref,
    }),
  )

  members.forEach((member) =>
    items.push({
      type: 'Team',
      title: member.name,
      meta: `${member.role} · ${member.focus}`,
      href: member.slug ? `#/team/${member.slug}` : '#team',
    }),
  )

  return items
}

export default function SiteSearch({ onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const members = useMembers()
  const index = useMemo(() => buildIndex({ members }), [members])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return index.slice(0, 6)
    return index
      .filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(keyword))
      .slice(0, 10)
  }, [index, query])

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search this site">
      <button
        type="button"
        className="search-overlay__backdrop"
        aria-label="Close search"
        onClick={onClose}
      />

      <div className="search-overlay__panel">
        <div className="container">
          <div className="search-box">
            <IconSearch className="search-box__icon" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder="Search research, people, equipment…"
              aria-label="Search"
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" className="search-box__close" onClick={onClose}>
              Esc
            </button>
          </div>

          <ul className="search-results">
            {results.map((item, position) => (
              <li key={`${item.type}-${position}`}>
                <a href={item.href} onClick={onClose}>
                  <span className="search-results__type">{item.type}</span>
                  <span className="search-results__body">
                    <span className="search-results__title">{item.title}</span>
                    <span className="search-results__meta">{item.meta}</span>
                  </span>
                </a>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="search-results__empty">No matches for “{query}”.</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  )
}
