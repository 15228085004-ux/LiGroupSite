import { useEffect, useRef, useState } from 'react'

/**
 * 通用「远程数据 + 站点内置数据」读取。
 *
 *   source 为空字符串 → 直接用站点里写死的数据（现在的默认状态）
 *   source 填了地址   → fetch 这个地址，成功就用接口数据覆盖内置数据
 *
 * 三条硬性保证，都是为了「后端挂了 / 还没做好」时站点照常对外：
 *   1. 请求失败、返回 404、JSON 解析失败、格式不对 → 静默回落到内置数据
 *   2. 同一个地址全站只请求一次（模块级缓存），首页 / 列表页 / 详情页共用
 *   3. 组件卸载后回来的响应会被丢弃，不会 setState 到已卸载的组件上
 *
 * 字段约定见 docs/BACKEND-API.md。
 */
const cache = new Map()

// 这两个校验函数必须是稳定的引用（写在模块作用域），否则会触发重复请求
const isList = Array.isArray
const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

function useRemoteData(source, fallback, validate) {
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const [data, setData] = useState(() => (source && cache.has(source) ? cache.get(source) : fallback))

  useEffect(() => {
    if (!source) {
      setData(fallbackRef.current)
      return undefined
    }

    const cached = cache.get(source)
    if (cached) {
      setData(cached)
      return undefined
    }

    let cancelled = false

    fetch(source)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((json) => {
        if (cancelled || !validate(json)) return
        cache.set(source, json)
        setData(json)
      })
      .catch(() => {
        // 静默回落：对外站点不能因为后端没起就白屏，也不该在页面上弹错误
      })

    return () => {
      cancelled = true
    }
  }, [source, validate])

  return data
}

/** 远程列表（顶层是数组），失败回落内置数组 */
export function useRemoteList(source, fallback) {
  return useRemoteData(source, fallback, isList)
}

/** 远程配置对象（顶层是对象），失败回落内置对象 */
export function useRemoteConfig(source, fallback) {
  return useRemoteData(source, fallback, isPlainObject)
}
