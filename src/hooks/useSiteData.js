import { site } from '../data/site.js'
import { useRemoteList } from './useRemoteData.js'

/**
 * 站点内容数据源。
 *
 * 每一项在 `site.dataSources` 里对应一个地址：
 *   - 留空字符串 → 用 `site.js` 里写死的静态数据（默认）
 *   - 填接口地址 → 用接口数据覆盖静态数据
 *
 * 所以后端接口做好之后，只要改 `site.dataSources` 里对应那一行，
 * 组件本身一行都不用动。字段约定见 docs/BACKEND-API.md。
 */
const sources = site.dataSources ?? {}

/** 在读成员：首页团队区 / #/team / #/team/<slug> 三处共用同一份数据 */
export function useMembers() {
  return useRemoteList(sources.members, site.team.members)
}

/** 校友与访问学者：#/team/alumni */
export function useAlumni() {
  return useRemoteList(sources.alumni, site.team.alumni ?? [])
}

/** 论文：首页精选 + #/publications 完整列表（年份筛选项由数据自动生成） */
export function usePublications() {
  return useRemoteList(sources.publications, site.publications.items)
}

/** 新闻：首页最近几条 + #/news + #/news/<slug> */
export function useNews() {
  return useRemoteList(sources.news, site.news.items)
}
