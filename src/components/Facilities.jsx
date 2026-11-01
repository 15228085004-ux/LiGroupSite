import { useSite } from '../data/siteContent.jsx'
import { equipmentHref, facilitiesHref } from '../hooks/useHashRoute.js'
import { equipmentSlug } from '../utils/equipment.js'
import { IconArrowRight } from './icons.jsx'

/**
 * Lab Facilities —— 实验室与设备清单
 * 内容在 src/data/site.js 的 site.facilities 里改：
 *   lead  留空就不渲染那段介绍；photo 填了才会出现照片块。
 */
export default function Facilities() {
  const site = useSite()
  const lab = site.facilities
  const anyDetailEnabled = lab.groups.some((group) =>
    group.items.some((item) => item.detailPageEnabled === true),
  )

  return (
    <section id="facilities" className="section section--tint">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">{lab.eyebrow}</p>
            <h2 className="section__title">{lab.title}</h2>
          </div>
          {lab.lead ? (
            <p className="section__lead" data-reveal>
              {lab.lead}
            </p>
          ) : null}
        </div>

        {lab.photo ? (
          <figure className="lab-photo" data-reveal>
            <img src={lab.photo} alt={lab.photoCaption || ''} />
            {lab.photoCaption ? <figcaption>{lab.photoCaption}</figcaption> : null}
          </figure>
        ) : null}

        <div className="equip">
          {lab.groups.map((group) => (
            <article className="equip__group" key={group.title} data-reveal>
              <h3 className="equip__group-title">{group.title}</h3>
              <ul className="equip__list">
                {group.items.map((item) => (
                  <li className="equip__item" key={item.name}>
                    {item.detailPageEnabled === true ? (
                      <a className="equip__link" href={equipmentHref(equipmentSlug(item))}>
                        <span className="equip__name">{item.name}</span>
                        <span className="equip__desc">{item.body}</span>
                      </a>
                    ) : (
                      <span className="equip__link equip__link--static">
                        <span className="equip__name">{item.name}</span>
                        <span className="equip__desc">{item.body}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {anyDetailEnabled ? (
          <a className="btn btn--outline btn--sm equip__more" href={facilitiesHref}>
            {lab.viewAllLabel}
            <IconArrowRight className="btn__arrow" />
          </a>
        ) : null}
      </div>
    </section>
  )
}
