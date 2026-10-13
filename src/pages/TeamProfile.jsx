import { site } from '../data/site.js'
import { teamIndexHref } from '../hooks/useHashRoute.js'
import { useMembers } from '../hooks/useMembers.js'
import SmartLink from '../components/SmartLink.jsx'
import { IconArrowLeft } from '../components/icons.jsx'

/*
  学生个人页固定显示这三个入口，顺序也固定 —— 数据里缺哪个都会补一个空位，
  免得有的学生三个链接、有的只有一个。href 为空时按钮是灰色不可点状态，
  真实链接填进 site.js 的 members[].links 之后自动变可点。
*/
const CONTACT_LABELS = ['Email', 'Google Scholar', 'LinkedIn']

function contactLinks(member) {
  const links = member.links ?? []
  const fixed = CONTACT_LABELS.map((label) => {
    const found = links.find((link) => link.label?.trim().toLowerCase() === label.toLowerCase())
    const href =
      found?.href || (label === 'Email' && member.email ? `mailto:${member.email}` : '')
    return { label, href }
  })
  // 数据里如果还写了别的链接（比如个人主页），接在后面，不吞掉
  const extras = links.filter(
    (link) => !CONTACT_LABELS.some((label) => label.toLowerCase() === link.label?.trim().toLowerCase()),
  )
  return [...fixed, ...extras]
}

export default function TeamProfile({ slug }) {
  const team = site.team
  const members = useMembers()
  const member = members.find((item) => item.slug === slug)

  if (!member) {
    return (
      <main className="page">
        <div className="container container--narrow">
          <a className="page__back" href={teamIndexHref}>
            <IconArrowLeft />
            {team.viewAllLabel}
          </a>
          <h1 className="page__title">This profile does not exist</h1>
          <p className="page__lead">
            The link may be out of date. Head back to the people list to find who you were
            looking for.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container container--narrow">
        <a className="page__back" href={teamIndexHref}>
          <IconArrowLeft />
          {team.viewAllLabel}
        </a>

        <article className="profile">
          <div className="profile__media">
            {member.photo ? (
              <img src={member.photo} alt="" />
            ) : (
              <span className="profile__initials" aria-hidden="true">
                {member.initials}
              </span>
            )}
          </div>

          <div className="profile__body">
            <p className="profile__role">{member.role}</p>
            <h1 className="profile__name">{member.name}</h1>
            {member.status ? <p className="profile__status">{member.status}</p> : null}

            {member.interests?.length ? (
              <ul className="profile__tags">
                {member.interests.map((interest) => (
                  <li className="tag" key={interest}>
                    {interest}
                  </li>
                ))}
              </ul>
            ) : null}

            {member.bio?.length ? (
              <div className="profile__bio">
                {member.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <div className="profile__links">
              {contactLinks(member).map((link) => (
                <SmartLink className="link-pill" href={link.href} key={link.label}>
                  {link.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </article>

        {member.education?.length ? (
          <section className="profile-section">
            <h2 className="profile-section__title">Education</h2>
            {/* 按标注：Education 只列「学位 + 学校」，不显示年份 */}
            <ul className="timeline timeline--no-period">
              {member.education.map((entry) => (
                <li className="timeline__item" key={`${entry.degree}-${entry.institution}`}>
                  <span className="timeline__body">
                    <span className="timeline__title">{entry.degree}</span>
                    <span className="timeline__meta">{entry.institution}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {member.experience?.length ? (
          <section className="profile-section">
            <h2 className="profile-section__title">Experience</h2>
            <ul className="timeline">
              {member.experience.map((entry) => (
                <li className="timeline__item" key={`${entry.title}-${entry.period}`}>
                  <span className="timeline__period">{entry.period}</span>
                  <span className="timeline__body">
                    <span className="timeline__title">{entry.title}</span>
                    <span className="timeline__meta">{entry.organization}</span>
                    {entry.description ? (
                      <span className="timeline__text">{entry.description}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {member.projects?.length ? (
          <section className="profile-section">
            <h2 className="profile-section__title">Projects</h2>
            <div className="project-grid">
              {member.projects.map((project) => (
                <article className="project" key={project.title}>
                  <p className="project__period">{project.period}</p>
                  <h3 className="project__title">{project.title}</h3>
                  {project.description ? (
                    <p className="project__text">{project.description}</p>
                  ) : null}
                  {project.link ? (
                    <SmartLink className="project__link" href={project.link}>
                      Learn more
                    </SmartLink>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
