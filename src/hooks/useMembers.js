/**
 * 兼容入口：成员数据现在统一放在 `useSiteData.js` 里。
 * 已经 `import { useMembers } from '../hooks/useMembers.js'` 的组件不用改。
 */
export { useMembers, useAlumni, usePublications, useNews } from './useSiteData.js'
