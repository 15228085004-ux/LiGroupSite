import { site as fallbackSite } from './site.js'

export function cloneContent(value) {
  return JSON.parse(JSON.stringify(value))
}

function mergeValue(fallback, value) {
  if (Array.isArray(fallback)) {
    return Array.isArray(value) ? value : cloneContent(fallback)
  }
  if (fallback && typeof fallback === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return cloneContent(fallback)
    }
    const result = { ...cloneContent(fallback) }
    Object.keys(value).forEach((key) => {
      result[key] = mergeValue(fallback[key], value[key])
    })
    return result
  }
  return value === undefined ? fallback : value
}

export function normalizeSiteContent(content) {
  const normalized = mergeValue(fallbackSite, content || {})
  normalized.schemaVersion = 1

  // Built-in photography is a visual fallback until the group uploads its own.
  if (!normalized.hero?.slides?.length) {
    normalized.hero.slides = cloneContent(fallbackSite.hero.slides)
  }
  if (!normalized.team?.pi?.photo) {
    normalized.team.pi.photo = fallbackSite.team.pi.photo
  }
  delete normalized.sponsors?.placeholderSlots
  return normalized
}

export function createDefaultSiteContent() {
  return normalizeSiteContent(cloneContent(fallbackSite))
}
