import { site } from '../data/site.js'

/**
 * 设备名 → URL 片段。
 * "Particle Size Analyzer" → "particle-size-analyzer"
 * 想在数据里手写 slug 也可以：{ name: '…', slug: 'my-slug' }，会优先用你写的那个。
 */
export function equipmentSlug(item) {
  if (item?.slug) return item.slug
  return String(item?.name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** 把 5 组设备摊平成一维数组，并记住每台设备属于哪一组 */
export function allEquipment() {
  const groups = site.facilities?.groups ?? []
  return groups.flatMap((group) =>
    group.items.map((item) => ({ ...item, group: group.title, slug: equipmentSlug(item) })),
  )
}
