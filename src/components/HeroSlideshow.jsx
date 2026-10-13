import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site.js'

/**
 * 首页背景的自动轮播（交叉淡入 + 缓慢推近）。
 * 照片列表在 site.js 的 hero.slides 里，换照片只改那个数组即可。
 * 只在页面可见时计时，并且尊重系统「减少动态效果」设置。
 *
 * onActiveChange(index)：把当前是第几张告诉 Hero，用来显示对应的图片署名。
 */
export default function HeroSlideshow({ onActiveChange }) {
  const slides = site.hero.slides ?? []
  const interval = site.hero.slideInterval ?? 6500
  const [active, setActive] = useState(0)

  // 用 ref 存回调：父组件每次渲染都会传新的函数，不能让它进依赖数组，
  // 否则计时器会被反复重置，轮播就永远不切换了。
  const notify = useRef(onActiveChange)
  notify.current = onActiveChange

  useEffect(() => {
    notify.current?.(active)
  }, [active])

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
