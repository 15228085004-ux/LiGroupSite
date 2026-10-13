import { site } from '../data/site.js'

/**
 * #/facilities —— 实验室与设备的完整页面。
 *
 * 首页的 Lab Facilities 区块只列名称和一句话说明；这里每台设备都有
 * 自己的照片位和更长的介绍，内容都在 src/data/site.js 的 site.facilities 里填：
 *   groups[].items[].photo  设备照片（留空就显示占位框）
 *   groups[].items[].intro  更长的介绍（留空就不渲染）
 *   lead / pageLead         整段实验室介绍
 *   photo                   实验室全景照
 */
export default function FacilitiesIndex() {
  const lab = site.facilities

  return (
    <main className="page">
      <div className="container">
        {/* 回到首页的 Lab Facilities 区块 */}
        <a className="page__back" href="#facilities">
          ← Back to the {lab.title}
        </a>

        <header className="page__head">
          <p className="eyebrow">{lab.eyebrow}</p>
          <h1 className="page__title">{lab.pageTitle}</h1>
          {lab.pageLead ? <p className="page__lead">{lab.pageLead}</p> : null}
        </header>

        {lab.photo ? (
          <figure className="lab-photo" data-reveal>
            <img src={lab.photo} alt={lab.photoCaption || ''} />
            {lab.photoCaption ? <figcaption>{lab.photoCaption}</figcaption> : null}
          </figure>
        ) : null}

        {lab.groups.map((group) => (
          <section className="profile-section" key={group.title}>
            <h2 className="profile-section__title">{group.title}</h2>
            <div className="equip-detail">
              {group.items.map((item) => (
                <article className="equip-card" key={item.name} data-reveal>
                  <div className="equip-card__media">
                    {item.photo ? (
                      <img src={item.photo} alt={item.name} loading="lazy" decoding="async" />
                    ) : (
                      <span className="equip-card__placeholder">Photo</span>
                    )}
                  </div>
                  <div className="equip-card__body">
                    <h3 className="equip-card__name">{item.name}</h3>
                    <p className="equip-card__desc">{item.body}</p>
                    {item.intro ? <p className="equip-card__intro">{item.intro}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
