import { site } from '../data/site.js'
import { teamIndexHref } from '../hooks/useHashRoute.js'
import { useMembers } from '../hooks/useMembers.js'
import SmartLink from '../components/SmartLink.jsx'
import { IconArrowLeft } from '../components/icons.jsx'

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
            <p className="profile__meta">
              {member.focus}
              {member.since ? ` · Since ${member.since}` : ''}
            </p>

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

            {member.links?.length || member.email ? (
              <div className="profile__links">
                {member.email ? (
                  <SmartLink className="link-pill" href={`mailto:${member.email}`}>
                    Email
                  </SmartLink>
                ) : null}
                {member.links?.map((link) => (
                  <SmartLink className="link-pill" href={link.href} key={link.label}>
                    {link.label}
                  </SmartLink>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        {member.education?.length ? (
          <section className="profile-section">
            <h2 className="profile-section__title">Education</h2>
            <ul className="timeline">
              {member.education.map((entry) => (
                <li className="timeline__item" key={`${entry.degree}-${entry.period}`}>
                  <span className="timeline__period">{entry.period}</span>
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
