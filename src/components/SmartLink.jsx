/**
 * href 为空字符串时渲染成不可点击的灰色状态，
 * 方便先搭骨架、之后再补真实链接（PDF / Code / CV …）。
 */
export default function SmartLink({ href, className, children, ...rest }) {
  if (!href) {
    return (
      <span className={className} aria-disabled="true" {...rest}>
        {children}
      </span>
    )
  }

  const isExternal = /^https?:/i.test(href)
  return (
    <a
      className={className}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
    </a>
  )
}
