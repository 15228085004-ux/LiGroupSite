import { useEffect, useState } from 'react'

/**
 * 根据滚动位置返回当前所在的 section id，用于导航高亮。
 *
 * 注意两点：
 *  1. 这里要认识页面上「所有」带 id 的 section，而不只是导航里那几个 ——
 *     否则滚到不在导航里的区块（最底下的 #join、以及页脚）时，
 *     高亮会一直卡在最后一个导航项上。
 *  2. 当前区块不在导航里就返回 null，导航整体取消高亮。
 */
export function useActiveSection(navIds) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.34

      let current = null
      document.querySelectorAll('main section[id]').forEach((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= marker) current = el.id
      })

      setActive(current && navIds.includes(current) ? current : null)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [navIds])

  return active
}
