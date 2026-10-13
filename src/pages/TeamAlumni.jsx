import { site } from '../data/site.js'
import { teamIndexHref } from '../hooks/useHashRoute.js'
import { useAlumni } from '../hooks/useSiteData.js'
import SmartLink from '../components/SmartLink.jsx'
import { IconArrowLeft } from '../components/icons.jsx'
import PersonGrid from '../components/PersonGrid.jsx'

export default function TeamAlumni() {
  const team = site.team
  const alumni = useAlumni()
  const cards = alumni.map((person) => ({
    key: `${person.name}-${person.period}`,
    href: person.link || '',
    photo: person.photo,
    initials: person.name
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    name: person.name,
    role: person.role,
    line: [person.position?.title, person.position?.organization].filter(Boolean).join(', '),
    foot: person.period,
  }))

  return (
    <main className="page">
      <div className="container container--narrow">
        <a className="page__back" href={teamIndexHref}>
          <IconArrowLeft />
          {team.viewAllLabel}
        </a>

        <header className="page__head page__head--tight">
          <p className="eyebrow">{team.eyebrow}</p>
          <h1 className="page__title">{team.alumniTitle}</h1>
          <p className="page__lead">{team.alumniLead}</p>
        </header>

        {alumni.length ? (
          <PersonGrid people={cards} />
        ) : (
          <p className="pub-empty">No alumni listed yet.</p>
        )}
      </div>
    </main>
  )
}
