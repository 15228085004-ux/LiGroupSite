import { useEffect, useState } from 'react'
import { site } from '../data/site.js'

/**
 * 首页背景的自动轮播（交叉淡入 + 缓慢推近）。
 * 照片列表在 site.js 的 hero.slides 里，换照片只改那个数组即可。
 * 只在页面可见时计时，并且尊重系统「减少动态效果」设置。
 */
export default function HeroSlideshow() {
  const slides = site.hero.slides ?? []
  const interval = site.hero.slideInterval ?? 6500
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let timer = null
    const start = () => {
      timer = window.setInterval(() => {
        setActive((index) => (index + 1) % slides.length)
      }, interval)
    }
    const stop = () => {
      if (timer) window.clearInterval(timer)
      timer = null
    }
    // 切到后台标签页就停表，回来再继续，避免白白耗电
    const onVisibilityChange = () => {
      stop()
      if (!document.hidden) start()
    }

    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [slides.length, interval])

  if (slides.length === 0) return null

  return (
    <div className="hero__slides" aria-hidden="true">
      {slides.map((slide, index) => (
        <div
          className={`hero__slide ${index === active ? 'is-active' : ''}`}
          key={slide.src}
        >
          <img src={slide.src} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
        </div>
      ))}
    </div>
  )
}
