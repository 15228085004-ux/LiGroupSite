import { useEffect, useState } from 'react'

/**
 * 根据滚动位置返回当前所在的 section id，用于导航高亮。
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.34
      let current = ids[0]

      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= marker) current = id
      })

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8
      if (atBottom) current = ids[ids.length - 1]

      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return active
}
