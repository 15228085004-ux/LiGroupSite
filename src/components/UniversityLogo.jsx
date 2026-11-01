/**
 * 学校标准的「U + THE UNIVERSITY OF UTAH」组合标识。
 *
 * 标记和字标都用官方素材位图，不用字体去排——官方字标是特定字体
 * （尤其斜体 "of" 的比例很独特），任何替代字体都做不到一模一样。
 *
 *   interlocking-u-mark.png —— 官方标记（110×102，来自 brand.utah.edu）
 *   u-wordmark.png         —— 从官方高清锁定图里抠出的字标
 *                             （652×302，白色、透明底）
 *
 * 相对尺寸 / 间距 / 垂直关系都按官方锁定图的比例写在 header.css 的 .u-logo：
 * 标记 508×472、字标 652×302、间距 36、字标中心比标记中心低 31（同一坐标系）。
 * 更多变体（block U、block U + Utah、纵向组合等）见
 * https://brand.utah.edu/branding/logos-marks/
 */
import uMark from '../assets/brand/interlocking-u-mark.png'
import uWordmark from '../assets/brand/u-wordmark.png'

export default function UniversityLogo({ className = '' }) {
  return (
    <span className={`u-logo ${className}`} role="img" aria-label="The University of Utah">
      <img className="u-logo__mark" src={uMark} alt="" aria-hidden="true" />
      <img className="u-logo__word" src={uWordmark} alt="" aria-hidden="true" />
    </span>
  )
}
