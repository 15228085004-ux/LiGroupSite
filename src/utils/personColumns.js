/**
 * 卡片宽度的上下限与间距（和 sections.css 里的 gap 保持一致）。
 * 由这两个值反推列数区间，保证实际卡宽始终落在 220~280px：
 *   列数 ≥ ceil(容器宽 / (MAX_CARD + gap))  → 卡片不会超过 280
 *   列数 ≤ floor(容器宽 / (MIN_CARD + gap)) → 卡片不会小于 220
 */
const MIN_CARD = 220
const MAX_CARD = 280
const GAP = 18

/**
 * 算成员网格的列数。
 * 再把会让最后一行只落单一张的列数减掉（例如 6 人排 5 列 = 5+1，很难看；
 * 降到 4 列就是 4+2）。人少时列数可以大于人数——那样卡片保持正常大小并且左对齐，
 * 而不是两个人各占半个屏幕。
 */
export function pickColumns(count, width) {
  if (!count) return 1
  if (!width) return Math.min(count, 4)

  const fits = Math.floor((width + GAP) / (MIN_CARD + GAP))
  const needed = Math.ceil((width + GAP) / (MAX_CARD + GAP))
  // 窄屏时「不小于 MIN_CARD」优先，所以 needed 不能超过 fits
  const minColumns = Math.max(1, Math.min(needed, fits))

  let columns = Math.max(minColumns, Math.min(count, fits))

  // 只有在「列数少于人数」时才可能出现落单，这时才需要往下降
  while (columns > 1 && columns < count && count % columns === 1) columns -= 1

  return columns
}
