import { useEffect, useState } from 'react'
import { IconArrowUp } from './icons.jsx'

/** 滚动超过这个距离（px）就出现；设成很小，等于「一开始滑就出现」 */
const SHOW_AFTER = 40

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // 开始滑动就出现；但滑到最底部的灰色法务条时要收起来，
      // 否则按钮会压住右下的社交图标。
      const band = document.querySelector('.site-footer__legal')
      const bandInView = band
        ? band.getBoundingClientRect().top < window.innerHeight
        : false
      setVisible(window.scrollY > SHOW_AFTER && !bandInView)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      aria-label="Back to top"
      aria-hidden={visible ? undefined : 'true'}
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
    >
      <IconArrowUp />
    </button>
  )
}
