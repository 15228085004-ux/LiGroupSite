import { site } from '../data/site.js'

/**
 * Lab Facilities —— 实验室与设备清单
 * 内容在 src/data/site.js 的 site.facilities 里改：
 *   lead  留空就不渲染那段介绍；photo 填了才会出现照片块。
 */
export default function Facilities() {
  const lab = site.facilities

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
                    <span className="equip__name">{item.name}</span>
                    <span className="equip__desc">{item.body}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
