/**
 * 把 {department} / {university} / {group} 这类占位符替换成 site 里的真实值，
 * 这样文案里就不用到处重复写院系和学校全称。
 */
export function interpolate(text, site) {
  if (typeof text !== 'string') return text
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    if (key === 'university') return site.university?.name ?? match
    if (key === 'group') return site.group?.name ?? match
    const value = site.university?.[key] ?? site.group?.[key] ?? site[key]
    return value === undefined ? match : String(value)
  })
}
