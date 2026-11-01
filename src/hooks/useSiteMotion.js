import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* --------------------------------------------------------------------------
   动效参数：想整体调节奏就改这里
   EASE 用 expo.out —— 起步快、收尾极慢，是高级作品集常见的「丝滑不弹跳」；
   不要换成 back/elastic（会有廉价回弹感）。
   -------------------------------------------------------------------------- */
const EASE = 'expo.out'
const EASE_SOFT = 'power3.out'
const D = {
  // 整体偏快：滚到位时动画必须已经收尾，否则会有「内容追着你出现」的滞后感
  heroTitle: 1.4,
  heroFade: 0.9,
  heading: 0.7,
  item: 0.45,
  media: 0.7,
}

/* 同一板块里相邻元素的错峰；最多错峰 6 档，排在后面的也不会等太久 */
const STAGGER = 0.04
const STAGGER_MAX = 6
const ITEM_SHIFT = 18

/* 触发点：元素刚从视口下缘露头就开始，等它真的滚到眼前时动画基本演完了 */
const START_ITEM = 'top 98%'
const START_HEADING = 'top 95%'

/*
   两道「滚到位就必须已经呈现」的兜底，缺一不可：
   1. FAST_SCROLL —— 锚点跳转 / Home、End / 快速甩动时滚动速度极快，
      这种场景再播入场动画必然是「停下来还要等它慢慢出现」，直接省略。
   2. IDLE_DELAY —— 停手 90ms 后，把视口里的、以及已经被滚过头的内容
      在 0.08s 内补齐，任何情况下都不留下一片空白。
*/
const FAST_SCROLL = 4500 // px/s
/* 超过这个速度就不再做错峰等待：等 0.2s 的功夫页面已经滚过一屏了 */
const STAGGER_SCROLL = 1200 // px/s
const IDLE_DELAY = 90
const IDLE_FADE = 0.08
/* 单个滚动事件里跨过了大半个屏幕（锚点跳转、Home/End、翻页键）也算「高速」 */
const JUMP_RATIO = 0.3

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 元素当前是否已经在视口里 */
function isInView(el, ratio = 0.98) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * ratio && rect.bottom > 0
}

/**
 * 把元素内容包进 overflow:hidden 的遮罩里，返回内层节点用于做「揭开」动画。
 * padding/margin 的负值是为了不切掉 g、y 这类字母的下伸部分。
 */
function maskify(el) {
  if (el.dataset.masked === 'true') return el.querySelector('.anim-line')
  const mask = document.createElement('span')
  mask.className = 'anim-mask'
  const line = document.createElement('span')
  line.className = 'anim-line'
  while (el.firstChild) line.appendChild(el.firstChild)
  mask.appendChild(line)
  el.appendChild(mask)
  el.dataset.masked = 'true'
  return line
}

export function useSiteMotion(deps = []) {
  useEffect(() => {
    const root = document.documentElement

    // 开了「减少动态效果」就完全不接管：去掉 js 标记，内容按静态样式直接显示
    if (reduced()) {
      root.classList.remove('js')
      return undefined
    }
    root.classList.add('js')

    /* ---------------- 0. 滚动速度追踪 + 停手兜底 ---------------- */
    let lastY = window.scrollY
    let lastAt = Date.now()
    let velocity = 0
    let idleTimer = 0
    // MutationObserver 补绑的节点不在 gsap.context 的执行栈里，
    // 它创建的 ScrollTrigger 要自己收，否则切页后会留下悬空的触发器。
    const triggers = []

    // 只在「刚刚还在高速滚动」时才算快，避免停手后一直判定为快
    const fastNow = () => velocity > FAST_SCROLL && Date.now() - lastAt < 160

    const showNow = (el) => gsap.set(el, { opacity: 1, y: 0 })

    /** 停手后补齐：视口里的极短收尾；已被滚过头的直接落定 */
    function settleInView() {
      velocity = 0
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        if (el.dataset.motionBound !== 'true') return
        if (Number(getComputedStyle(el).opacity) > 0.99) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom <= 0) {
          showNow(el)
          return
        }
        if (rect.top >= window.innerHeight) return
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: IDLE_FADE,
          ease: 'power1.out',
          overwrite: true,
        })
      })
    }

    const onScroll = () => {
      const now = Date.now()
      const y = window.scrollY
      const dt = now - lastAt
      const delta = Math.abs(y - lastY)
      if (dt > 0) velocity = delta / (dt / 1000)
      // 一次事件就跨过大半个屏幕：不管间隔多久都算跳转，别播入场动画
      if (delta > window.innerHeight * JUMP_RATIO) velocity = Math.max(velocity, FAST_SCROLL * 2)
      lastY = y
      lastAt = now
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(settleInView, IDLE_DELAY)
    }

    // 用捕获阶段：必须先于 ScrollTrigger 自己的滚动回调算出速度，
    // 否则它触发 onEnter 的时候读到的还是上一帧的速度。
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    // 改窗口大小、切横竖屏会让板块整体挪位，同样按「停手」补一次
    window.addEventListener('resize', onScroll)

    /* ---------------- 卡片 / 段落：逐个绑定，不合并批次 ---------------- */

    function revealItem(el, delay = 0) {
      const rect = el.getBoundingClientRect()
      // 已经滚过头了：没有动画可言，补上就行（否则往回滚会看到空白）
      if (rect.bottom <= 0) {
        showNow(el)
        return
      }
      /*
         节奏跟着滚动速度走：
         慢慢看 → 完整的入场 + 错峰；滚得越快 → 时长按比例缩短、并取消错峰；
         锚点跳转 / 快速甩动 → 不做动画直接落定。
         这样「滚到哪儿，哪儿的文字就已经在了」，而不是内容追着你出现。
      */
      if (fastNow()) {
        showNow(el)
        return
      }
      const speed = Math.max(1, velocity)
      const duration = Math.min(D.item, Math.max(0.16, (D.item * STAGGER_SCROLL) / speed))
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        ease: EASE_SOFT,
        delay: speed > STAGGER_SCROLL ? 0 : delay,
        overwrite: true,
      })
    }

    /** 给一批新出现的元素挂上进场动画（首屏 + 动态插入的都走这里） */
    function bindItems(elements) {
      const fresh = elements.filter((el) => el.dataset.motionBound !== 'true')
      if (!fresh.length) return

      fresh.forEach((el) => {
        el.dataset.motionBound = 'true'
      })

      // 已经在视口里的（首屏、锚点跳转、切页后的第一屏）直接显示，不做进场，避免滞后
      const visible = fresh.filter((el) => isInView(el))
      const below = fresh.filter((el) => !isInView(el))

      if (visible.length) gsap.set(visible, { opacity: 1, y: 0 })
      if (!below.length) return

      gsap.set(below, { opacity: 0, y: ITEM_SHIFT })

      // 每个元素一条独立的 ScrollTrigger：元素刚露头就进场。
      // 不经过 ScrollTrigger.batch —— 它要合并批次，会额外带来约 100ms 的延迟。
      const order = new Map()
      below.forEach((el) => {
        const group = el.closest('section') || document.body
        const index = order.get(group) || 0
        order.set(group, index + 1)
        triggers.push(ScrollTrigger.create({
          trigger: el,
          start: START_ITEM,
          once: true,
          onEnter: () => revealItem(el, Math.min(index, STAGGER_MAX) * STAGGER),
        }))
      })
    }

    const ctx = gsap.context(() => {
      /* ---------------- 1. 首屏 opening ---------------- */
      const hero = document.querySelector('.hero')
      if (hero) {
        const tl = gsap.timeline({ defaults: { ease: EASE } })

        tl.from('.site-header', { yPercent: -100, duration: 1.2 }, 0)
          .from('.hero__slides', { scale: 1.16, duration: 2.2, ease: EASE_SOFT }, 0)
          .from('.hero__grid', { opacity: 0, duration: 1.5 }, 0.2)

        // 大标题：遮罩揭开 + 压扁后归位
        gsap.utils.toArray('.hero__title-line').forEach((el, i) => {
          const line = maskify(el)
          tl.from(
            line,
            {
              yPercent: 118,
              scaleY: 0.68,
              scaleX: 0.94,
              transformOrigin: '50% 100%',
              duration: D.heroTitle,
            },
            0.35 + i * 0.13,
          )
        })

        tl.from('.hero__lead', { y: 26, opacity: 0, duration: D.heroFade }, 0.75)
          .from('.hero__actions > *', { y: 22, opacity: 0, duration: D.heroFade, stagger: STAGGER }, 0.85)
          .from('.hero__meta li', { y: 16, opacity: 0, duration: D.heroFade, stagger: 0.06 }, 0.95)
          .from('.hero__stat-value', { yPercent: 120, opacity: 0, duration: 1.05, stagger: 0.07 }, 1)
          .from('.hero__stat-label', { opacity: 0, duration: 0.85, stagger: 0.07 }, 1.15)
          .from('.hero__scroll', { opacity: 0, duration: 0.9 }, 1.3)

        // 首屏背景的轻微视差（滚出时慢一点）
        gsap.to('.hero__slides', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      /* ---------------- 2. 板块大标题：大幅进场 ---------------- */
      gsap.utils
        .toArray('.section__title, .page__title, .article__title, .join__title, .profile__name, .pi__name')
        .forEach((el) => {
          const line = maskify(el)
          if (isInView(el, 0.95)) return // 已经可见的标题不做进场
          ScrollTrigger.create({
            trigger: el,
            start: START_HEADING,
            once: true,
            onEnter: () => {
              if (fastNow()) return // 高速滚动中：标题直接落位，不做揭开
              gsap.from(line, {
                yPercent: 115,
                scaleY: 0.72,
                scaleX: 0.95,
                transformOrigin: '50% 100%',
                duration: D.heading,
                ease: EASE,
              })
            },
          })
        })

      gsap.utils.toArray('.eyebrow').forEach((el) => {
        if (isInView(el, 0.95)) return
        ScrollTrigger.create({
          trigger: el,
          start: START_HEADING,
          once: true,
          onEnter: () => {
            if (fastNow()) return
            gsap.from(el, { opacity: 0, x: -18, duration: 0.6, ease: EASE_SOFT })
          },
        })
      })

      /* ---------------- 3. 卡片 / 段落：分批 stagger ---------------- */
      bindItems(gsap.utils.toArray('[data-reveal]'))

      /* ---------------- 4. 图片：放大揭开 + 轻微视差 ---------------- */
      gsap.utils
        .toArray('.pi__photo, .person-card__photo img, .hero__slide img')
        .forEach((el) => {
          if (isInView(el)) return
          ScrollTrigger.create({
            trigger: el,
            start: START_ITEM,
            once: true,
            onEnter: () => {
              if (fastNow()) return
              gsap.from(el, {
                scale: 1.14,
                yPercent: 6,
                duration: D.media,
                ease: EASE_SOFT,
              })
            },
          })
        })

      gsap.utils.toArray('.pi__photo, .person-card__photo').forEach((el) => {
        gsap.to(el, {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })

    // 筛选、切页这类操作会重新渲染出新的 [data-reveal] 节点，
    // 它们同样要拿到初始状态和进场动画，否则会停在 opacity:0（空白）。
    const mo = new MutationObserver((records) => {
      const added = []
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches('[data-reveal]')) added.push(node)
          node.querySelectorAll?.('[data-reveal]').forEach((el) => added.push(el))
        })
      })
      if (added.length) bindItems(added)
    })
    mo.observe(document.body, { childList: true, subtree: true })

    ScrollTrigger.refresh()

    // 浏览器恢复滚动位置、路由跳锚点都发生在挂载之后，
    // 这时刚进入视口的元素要立刻显示，而不是等用户再滚一下才出现。
    const settleTimer = window.setTimeout(settleInView, 160)

    // 开发期调试钩子：控制台里可以 __motion.gsap.globalTimeline.timeScale(4) 加速预览，
    // 或 __motion.ScrollTrigger.getAll() 查看触发了多少条滚动动画。生产构建不会暴露。
    if (import.meta.env.DEV) {
      window.__motion = { gsap, ScrollTrigger, ctx }
    }

    return () => {
      window.clearTimeout(settleTimer)
      window.clearTimeout(idleTimer)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
      mo.disconnect()
      triggers.forEach((trigger) => trigger.kill())
      ctx.revert()
      // ctx.revert() 已经清掉了 GSAP 写入的内联样式，这里也要把「已绑定」标记一起清掉，
      // 否则 React 严格模式下的二次挂载会跳过这些元素，它们会一直停在 opacity:0。
      document.querySelectorAll('[data-motion-bound]').forEach((el) => {
        delete el.dataset.motionBound
      })
      if (import.meta.env.DEV) delete window.__motion
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
