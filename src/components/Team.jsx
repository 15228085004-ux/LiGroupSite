import { site } from '../data/site.js'
import { teamIndexHref, teamAlumniHref, teamHref } from '../hooks/useHashRoute.js'
import SmartLink from './SmartLink.jsx'
import PersonGrid from './PersonGrid.jsx'
import { useAlumni, useMembers } from '../hooks/useSiteData.js'
import { IconArrowRight } from './icons.jsx'

export default function Team() {
  const team = site.team
  const allMembers = useMembers()
  const alumni = useAlumni()
  const members = allMembers.slice(0, team.limit ?? allMembers.length)
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
    <section id="team" className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">{team.eyebrow}</p>
            <h2 className="section__title">{team.title}</h2>
          </div>
          <p className="section__lead" data-reveal>
            {team.lead}
          </p>
        </div>

        <article className="pi" data-reveal>
          {team.pi.photo ? (
            <img className="pi__photo" src={team.pi.photo} alt="" />
          ) : (
            <div className="avatar avatar--pi" aria-hidden="true">
              {team.pi.initials}
            </div>
          )}
          <div>
            <p className="pi__role">{team.pi.role}</p>
            <h3 className="pi__name">{team.pi.name}</h3>
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
          <h3>{team.membersTitle}</h3>
          <span>{allMembers.length} people</span>
        </div>

        <PersonGrid people={cards} />

        <a className="btn btn--outline btn--sm team__more" href={teamIndexHref}>
          {team.viewAllLabel}
          <IconArrowRight className="btn__arrow" />
        </a>

        {/* Alumni 会越积越多，首页只放入口，名单在 #/team/alumni */}
        <a className="team-link-row" href={teamAlumniHref}>
          <span className="team-link-row__body">
            <span className="team-link-row__title">{team.alumniTitle}</span>
            <span className="team-link-row__meta">
              {alumni.length} people · former members and visiting researchers
            </span>
          </span>
          <IconArrowRight className="team-link-row__arrow" />
        </a>

      </div>
    </section>
  )
}
