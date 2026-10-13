import { site } from '../data/site.js'
import PersonGrid from '../components/PersonGrid.jsx'
import SmartLink from '../components/SmartLink.jsx'
import { useAlumni, useMembers } from '../hooks/useSiteData.js'
import { teamAlumniHref, teamHref } from '../hooks/useHashRoute.js'
import { IconArrowRight } from '../components/icons.jsx'

export default function TeamIndex() {
  const team = site.team
  const members = useMembers()
  const alumni = useAlumni()
  const cards = members.map((member) => ({
    key: member.name,
    href: member.slug ? teamHref(member.slug) : '',
    photo: member.photo,
    initials: member.initials,
    name: member.name,
    role: member.role,
    line: member.focus,
    foot: member.since ? `Since ${member.since}` : '',
  }))

  return (
    <main className="page">
      <div className="container">
        <header className="page__head">
          <p className="eyebrow">{team.eyebrow}</p>
          <h1 className="page__title">{team.pageTitle}</h1>
          <p className="page__lead">{team.pageLead}</p>
        </header>

        <article className="pi">
          {team.pi.photo ? (
            <img className="pi__photo" src={team.pi.photo} alt="" />
          ) : (
            <div className="avatar avatar--pi" aria-hidden="true">
              {team.pi.initials}
            </div>
          )}
          <div>
            <p className="pi__role">{team.pi.role}</p>
            <h2 className="pi__name">{team.pi.name}</h2>
            <p className="pi__affiliation">{team.pi.affiliation}</p>
            <p className="pi__bio">{team.pi.bio}</p>
            <div className="pi__links">
              {team.pi.links.map((link) => (
                <SmartLink className="link-pill" href={link.href} key={link.label}>
                  {link.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </article>

        <div className="team__subhead">
          <h2>{team.membersTitle}</h2>
          <span>{members.length} people</span>
        </div>

        <PersonGrid people={cards} />

        {alumni.length ? (
          <a className="team-link-row" href={teamAlumniHref}>
            <span className="team-link-row__body">
              <span className="team-link-row__title">{team.alumniTitle}</span>
              <span className="team-link-row__meta">
                {alumni.length} people · former members and visiting researchers
              </span>
            </span>
            <IconArrowRight className="team-link-row__arrow" />
          </a>
        ) : null}
      </div>
    </main>
  )
}
