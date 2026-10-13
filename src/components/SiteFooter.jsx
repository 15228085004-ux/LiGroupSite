import { Fragment } from 'react'
import { site } from '../data/site.js'
import UniversityLogo from './UniversityLogo.jsx'
import SmartLink from './SmartLink.jsx'
import { IconFacebook, IconInstagram, IconX, IconYouTube } from './icons.jsx'

const SOCIAL_ICONS = {
  x: IconX,
  facebook: IconFacebook,
  instagram: IconInstagram,
  youtube: IconYouTube,
}

/**
 * 页脚 = 学校风格的三栏黑底页脚 + 灰色法务条。
 * 联系方式（邮箱 / 办公室 / 地址 / 电话）集中在中间那栏的校标下方。
 */
export default function SiteFooter() {
  const { footer, contact, university } = site

  return (
    <footer id="contact" className="site-footer-wrap">
      <div className="site-footer">
        <div className="container site-footer__cols">
          <div className="f-col">
            <h2 className="f-col__title">{footer.resourcesTitle}</h2>
            <ul className="f-col__list">
              {footer.resources.map((link) => (
                <li key={link.label}>
                  <SmartLink className="f-col__link" href={link.href}>
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="f-brand">
            <UniversityLogo />
            <p className="f-brand__name">{site.group.name}</p>
            <p className="f-brand__person">{site.team.pi.name}</p>
            <p className="f-brand__role">
              {site.team.pi.role}, {university.department}
            </p>

            {/* 联系方式集中在这里（原来在收尾大标语那块，已合并过来） */}
            <div className="f-brand__contact">
              {contact.email ? (
                <p>
                  <SmartLink className="f-brand__link" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </SmartLink>
                </p>
              ) : null}
              {contact.office ? <p>{contact.office}</p> : null}
              {contact.address ? (
                <p>
                  {contact.address}
                  {contact.mapUrl ? (
                    <>
                      {' · '}
                      <SmartLink className="f-brand__link" href={contact.mapUrl}>
                        Map
                      </SmartLink>
                    </>
                  ) : null}
                </p>
              ) : null}
              {contact.phone ? <p>{contact.phone}</p> : null}
            </div>
          </div>

          <div className="f-col f-col--right">
            <h2 className="f-col__title">{footer.quickTitle}</h2>
            <ul className="f-col__list">
              {footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <SmartLink
                    className={`f-col__link ${link.preserveCase ? 'is-mixed-case' : ''}`}
                    href={link.href}
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="container site-footer__legal-inner">
          <UniversityLogo className="u-logo--small" />

          <div className="legal__center">
            <p className="legal__copy">
              © {new Date().getFullYear()} {university.name}
            </p>
            <p className="legal__links">
              {footer.legalLinks.map((link, position) => (
                <Fragment key={link.label}>
                  {position > 0 ? <span aria-hidden="true">/</span> : null}
                  <SmartLink href={link.href}>{link.label}</SmartLink>
                </Fragment>
              ))}
            </p>
            <p className="legal__updated">Last updated: {footer.lastUpdated}</p>
          </div>

          <div className="legal__social">
            {footer.social.map((channel) => {
              const Icon = SOCIAL_ICONS[channel.id]
              return (
                <SmartLink
                  key={channel.id}
                  className="social-btn"
                  href={channel.href}
                  aria-label={channel.label}
                  title={channel.label}
                >
                  {Icon ? <Icon /> : null}
                </SmartLink>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
