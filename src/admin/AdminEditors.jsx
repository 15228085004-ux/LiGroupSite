import { useRef, useState } from 'react'
import { createId } from '../lib/ids.ts'
import { equipmentSlug } from '../utils/equipment.js'

function Field({
  label,
  value = '',
  onChange,
  type = 'text',
  placeholder = '',
  hint = '',
  wide = false,
  disabled = false,
}) {
  return (
    <label className={`ap-field ${wide ? 'ap-field--wide' : ''}`}>
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

function RoleField({ value, onChange, disabled }) {
  const standardRoles = [
    'Ph.D. Student',
    'M.S. Student',
    'Undergraduate Student',
  ]
  const options = value && !standardRoles.includes(value)
    ? [...standardRoles, value]
    : standardRoles

  return (
    <label className="ap-field">
      <span>Role</span>
      <select
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {options.map((role) => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </label>
  )
}

const STATUS_OPTIONS = {
  'Ph.D. Student': [
    'Ph.D. Student, incoming',
    'Ph.D. Student, 1st year',
    'Ph.D. Student, 2nd year',
    'Ph.D. Student, 3rd year',
    'Ph.D. Student, 4th year',
    'Ph.D. Student, 5th year',
    'Ph.D. Candidate',
  ],
  'M.S. Student': [
    'M.S. Student, incoming',
    'M.S. Student, 1st year',
    'M.S. Student, 2nd year',
  ],
  'Undergraduate Student': [
    'Undergraduate Student, 1st year',
    'Undergraduate Student, 2nd year',
    'Undergraduate Student, 3rd year',
    'Undergraduate Student, 4th year',
  ],
}

function StatusField({ role, value, onChange, disabled }) {
  const options = STATUS_OPTIONS[role] || []
  const allOptions = value && !options.includes(value) ? [value, ...options] : options

  return (
    <label className="ap-field">
      <span>Profile status</span>
      <select
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {!value ? <option value="">Choose year or status</option> : null}
        {allOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <small>Automatically matched to the selected role.</small>
    </label>
  )
}

function slugifyName(name, fallback) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || fallback
}

function Area({
  label,
  value = '',
  onChange,
  rows = 4,
  hint = '',
  wide = true,
  placeholder = '',
  disabled = false,
}) {
  return (
    <label className={`ap-field ${wide ? 'ap-field--wide' : ''}`}>
      <span>{label}</span>
      <textarea
        value={Array.isArray(value) ? value.join('\n\n') : value ?? ''}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

function Toggle({ label, value, onChange, disabled }) {
  return (
    <label className="ap-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={Boolean(value)}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i />
    </label>
  )
}

export function ImageField({
  label,
  value,
  onChange,
  uploadImage,
  canEdit,
  ratio = 'wide',
  hint = 'JPG, PNG or WebP. Use the highest-resolution original available.',
}) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const upload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    setBusy(true)
    try {
      onChange(await uploadImage(file))
    } catch (uploadError) {
      setError(uploadError.message || 'Image upload failed')
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  return (
    <div className={`ap-image-field ap-image-field--${ratio}`}>
      <div
        className={`ap-image-field__preview ${value ? 'has-image' : ''}`}
        style={value ? { backgroundImage: `url("${value}")` } : undefined}
      >
        {!value ? <span>IMAGE</span> : null}
      </div>
      <div className="ap-image-field__body">
        <strong>{label}</strong>
        <p>{hint}</p>
        {canEdit ? (
          <div className="ap-image-actions">
            <button
              type="button"
              className="ap-image-action ap-image-action--upload"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              <span aria-hidden="true">{busy ? '···' : value ? '↻' : '+'}</span>
              <b>{busy ? 'Uploading…' : value ? 'Replace image' : 'Choose image'}</b>
            </button>
            {value ? (
              <button
                type="button"
                className="ap-image-action ap-image-action--remove"
                onClick={() => onChange('')}
              >
                Remove <span aria-hidden="true">×</span>
              </button>
            ) : null}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={upload}
              hidden
            />
          </div>
        ) : null}
        {error ? <p className="ap-error">{error}</p> : null}
      </div>
    </div>
  )
}

function SectionHeading({ index, eyebrow, title, description }) {
  return (
    <header className="ap-section-heading">
      <span>{index}</span>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <small>{description}</small>
      </div>
    </header>
  )
}

function Card({ title, description, action, children, flush = false }) {
  return (
    <section className={`ap-card ${flush ? 'ap-card--flush' : ''}`}>
      {title ? (
        <div className="ap-card__head">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

function RowActions({ index, length, onMove, onRemove, canEdit = true }) {
  if (!canEdit) return null
  return (
    <div className="ap-row-actions">
      <button
        type="button"
        className="ap-row-action ap-row-action--icon"
        aria-label="Move up"
        disabled={index === 0}
        onClick={() => onMove(index, -1)}
      >
        <span aria-hidden="true">↑</span>
      </button>
      <button
        type="button"
        className="ap-row-action ap-row-action--icon"
        aria-label="Move down"
        disabled={index === length - 1}
        onClick={() => onMove(index, 1)}
      >
        <span aria-hidden="true">↓</span>
      </button>
      <button
        type="button"
        className="ap-row-action ap-row-action--remove"
        onClick={() => onRemove(index)}
      >
        Remove
      </button>
    </div>
  )
}

function moveItem(array, index, direction) {
  const destination = index + direction
  if (destination < 0 || destination >= array.length) return
  const [item] = array.splice(index, 1)
  array.splice(destination, 0, item)
}

function values(text) {
  return text
    .split(',')
    .map((valueText) => valueText.trim())
    .filter(Boolean)
}

export function IdentityEditor({
  content,
  patch,
  canEdit,
  uploadImage,
}) {
  const updateSlide = (index, key, value) =>
    patch((draft) => {
      draft.hero.slides[index][key] = value
    })

  return (
    <div className="ap-stack">
      <SectionHeading
        index="01"
        eyebrow="IDENTITY & HERO"
        title="Site identity"
        description="The text, contact details and photography that establish the group's public presence."
      />

      <Card title="Research group" description="Used in the header, footer and page metadata.">
        <div className="ap-form-grid">
          <Field label="Group name" value={content.group.name} onChange={(value) => patch((draft) => { draft.group.name = value })} disabled={!canEdit} />
          <Field label="Short name" value={content.group.shortName} onChange={(value) => patch((draft) => { draft.group.shortName = value })} disabled={!canEdit} />
          <Field label="University" value={content.university.name} onChange={(value) => patch((draft) => { draft.university.name = value })} disabled={!canEdit} />
          <Field label="University short name" value={content.university.shortName} onChange={(value) => patch((draft) => { draft.university.shortName = value })} disabled={!canEdit} />
          <Field label="College" value={content.university.college} onChange={(value) => patch((draft) => { draft.university.college = value })} disabled={!canEdit} />
          <Field label="Department" value={content.university.department} onChange={(value) => patch((draft) => { draft.university.department = value })} disabled={!canEdit} />
        </div>
      </Card>

      <Card title="Contact" description="Shown in the navigation panel and the University-style footer.">
        <div className="ap-form-grid">
          <Field label="Email" type="email" value={content.contact.email} onChange={(value) => patch((draft) => { draft.contact.email = value })} disabled={!canEdit} />
          <Field label="Phone" value={content.contact.phone} onChange={(value) => patch((draft) => { draft.contact.phone = value })} disabled={!canEdit} />
          <Field label="Office" value={content.contact.office} onChange={(value) => patch((draft) => { draft.contact.office = value })} disabled={!canEdit} />
          <Field label="Address" value={content.contact.address} onChange={(value) => patch((draft) => { draft.contact.address = value })} disabled={!canEdit} />
          <Field label="Campus map URL" type="url" value={content.contact.mapUrl} onChange={(value) => patch((draft) => { draft.contact.mapUrl = value })} disabled={!canEdit} />
        </div>
      </Card>

      <Card title="Homepage hero" description="Keep the two-line title rhythm: line one solid, line two outlined.">
        <div className="ap-form-grid">
          <Field label="Headline line 1" value={content.hero.titleLine1} onChange={(value) => patch((draft) => { draft.hero.titleLine1 = value })} disabled={!canEdit} />
          <Field label="Headline line 2" value={content.hero.titleLine2} onChange={(value) => patch((draft) => { draft.hero.titleLine2 = value })} disabled={!canEdit} />
          <Area label="Introduction" value={content.hero.lead} onChange={(value) => patch((draft) => { draft.hero.lead = value })} disabled={!canEdit} />
          <Field label="Primary button" value={content.hero.primaryCta?.label} onChange={(value) => patch((draft) => { draft.hero.primaryCta.label = value })} disabled={!canEdit} />
          <Field label="Primary button link" value={content.hero.primaryCta?.href} onChange={(value) => patch((draft) => { draft.hero.primaryCta.href = value })} disabled={!canEdit} />
          <Field label="Secondary button" value={content.hero.secondaryCta?.label} onChange={(value) => patch((draft) => { draft.hero.secondaryCta.label = value })} disabled={!canEdit} />
          <Field label="Secondary button link" value={content.hero.secondaryCta?.href} onChange={(value) => patch((draft) => { draft.hero.secondaryCta.href = value })} disabled={!canEdit} />
          <Field label="Photo interval (ms)" type="number" value={content.hero.slideInterval} onChange={(value) => patch((draft) => { draft.hero.slideInterval = Number(value) })} disabled={!canEdit} />
        </div>
      </Card>

      <Card
        title="Hero photography"
        description="These images form the full-screen opening sequence. A slow crossfade is applied by the public site."
        action={canEdit ? (
          <button
            className="ap-button ap-button--small"
            onClick={() => patch((draft) => {
              draft.hero.slides.push({ src: '', alt: '' })
            })}
          >
            + Add image
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.hero.slides.map((slide, index) => (
            <article className="ap-image-row" key={`${slide.src}-${index}`}>
              <ImageField
                label={`Slide ${String(index + 1).padStart(2, '0')}`}
                value={slide.src}
                onChange={(value) => updateSlide(index, 'src', value)}
                uploadImage={uploadImage}
                canEdit={canEdit}
              />
              <RowActions
                index={index}
                length={content.hero.slides.length}
                canEdit={canEdit}
                onMove={(position, direction) => patch((draft) => moveItem(draft.hero.slides, position, direction))}
                onRemove={(position) => patch((draft) => draft.hero.slides.splice(position, 1))}
              />
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function ResearchEditor({ content, patch, canEdit }) {
  return (
    <div className="ap-stack">
      <SectionHeading
        index="02"
        eyebrow="RESEARCH"
        title="Research interests"
        description="The five research areas are the intellectual core of the public homepage."
      />
      <Card
        title="Overview"
        description="The heading and optional introduction before the research cards."
      >
        <div className="ap-form-grid">
          <Field label="Eyebrow" value={content.research.eyebrow} onChange={(value) => patch((draft) => { draft.research.eyebrow = value })} disabled={!canEdit} />
          <Field label="Section title" value={content.research.title} onChange={(value) => patch((draft) => { draft.research.title = value })} disabled={!canEdit} />
          <Area label="Optional introduction" value={content.research.lead} onChange={(value) => patch((draft) => { draft.research.lead = value })} disabled={!canEdit} />
        </div>
      </Card>
      <Card
        title="Research areas"
        description="Reorder cards with the arrow controls."
        action={canEdit ? (
          <button className="ap-button ap-button--small" onClick={() => patch((draft) => {
            draft.research.areas.push({ index: String(draft.research.areas.length + 1).padStart(2, '0'), title: 'New research area', body: '', tags: [] })
          })}>
            + Add area
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.research.areas.map((area, index) => (
            <article className="ap-repeat-card" key={`${area.title}-${index}`}>
              <div className="ap-repeat-card__top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{area.title}</strong>
                <RowActions
                  index={index}
                  length={content.research.areas.length}
                  canEdit={canEdit}
                  onMove={(position, direction) => patch((draft) => moveItem(draft.research.areas, position, direction))}
                  onRemove={(position) => patch((draft) => draft.research.areas.splice(position, 1))}
                />
              </div>
              <div className="ap-form-grid">
                <Field label="Card number" value={area.index} onChange={(value) => patch((draft) => { draft.research.areas[index].index = value })} disabled={!canEdit} />
                <Field label="Title" value={area.title} onChange={(value) => patch((draft) => { draft.research.areas[index].title = value })} disabled={!canEdit} />
                <Area label="Description" value={area.body} onChange={(value) => patch((draft) => { draft.research.areas[index].body = value })} disabled={!canEdit} />
                <Field label="Tags" value={(area.tags || []).join(', ')} onChange={(value) => patch((draft) => { draft.research.areas[index].tags = values(value) })} hint="Comma-separated; optional." disabled={!canEdit} />
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function TeamEditor({ content, patch, canEdit, uploadImage }) {
  const remove = (list, index) => patch((draft) => list(draft).splice(index, 1))
  const move = (list, index, direction) => patch((draft) => moveItem(list(draft), index, direction))

  return (
    <div className="ap-stack">
      <SectionHeading
        index="03"
        eyebrow="PEOPLE"
        title="Team and Previous Students"
        description="Editorial profiles for the PI, current group members, former students and researchers."
      />
      <Card title="Principal Investigator">
        <ImageField
          label="PI portrait"
          value={content.team.pi.photo}
          onChange={(value) => patch((draft) => { draft.team.pi.photo = value })}
          uploadImage={uploadImage}
          canEdit={canEdit}
          ratio="portrait"
          hint="Square or portrait crop works best."
        />
        <div className="ap-form-grid">
          <Field label="Name" value={content.team.pi.name} onChange={(value) => patch((draft) => { draft.team.pi.name = value })} disabled={!canEdit} />
          <Field label="Role" value={content.team.pi.role} onChange={(value) => patch((draft) => { draft.team.pi.role = value })} disabled={!canEdit} />
          <Field label="Initials" value={content.team.pi.initials} onChange={(value) => patch((draft) => { draft.team.pi.initials = value })} disabled={!canEdit} />
          <Field label="Affiliation" value={content.team.pi.affiliation} onChange={(value) => patch((draft) => { draft.team.pi.affiliation = value })} disabled={!canEdit} />
          <Area label="Biography" value={content.team.pi.bio} onChange={(value) => patch((draft) => { draft.team.pi.bio = value })} disabled={!canEdit} />
        </div>
      </Card>

      <Card
        title="Current members"
        description={`${content.team.members.length} profiles are listed on the homepage.`}
        action={canEdit ? (
          <button className="ap-button ap-button--small" onClick={() => patch((draft) => {
            const id = createId('member')
            draft.team.members.push({ slug: id, name: 'New member', role: 'Ph.D. Student', initials: '', photo: '', email: '', focus: '', expected: '', status: '', interests: [], education: [], bio: [], links: [] })
          })}>
            + Add member
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.team.members.map((member, index) => (
            <article className="ap-profile-card" key={`${member.slug || member.name}-${index}`}>
              <div className="ap-repeat-card__top">
                <span>{member.initials || String(index + 1).padStart(2, '0')}</span>
                <strong>{member.name}</strong>
                <RowActions
                  index={index}
                  length={content.team.members.length}
                  canEdit={canEdit}
                  onMove={(position, direction) => move((draft) => draft.team.members, position, direction)}
                  onRemove={(position) => remove((draft) => draft.team.members, position)}
                />
              </div>
              <div className="ap-profile-card__layout">
                <ImageField
                  label="Portrait"
                  value={member.photo}
                  onChange={(value) => patch((draft) => { draft.team.members[index].photo = value })}
                  uploadImage={uploadImage}
                  canEdit={canEdit}
                  ratio="square"
                />
                <div className="ap-form-grid">
                  <Field label="Name" value={member.name} onChange={(value) => patch((draft) => { draft.team.members[index].name = value })} disabled={!canEdit} />
                  <RoleField
                    value={member.role}
                    onChange={(value) => patch((draft) => {
                      draft.team.members[index].role = value
                      draft.team.members[index].status = STATUS_OPTIONS[value]?.[0] || ''
                    })}
                    disabled={!canEdit}
                  />
                  <div className="ap-profile-link-control">
                    <label className="ap-check-field">
                      <input
                        type="checkbox"
                        checked={Boolean(member.slug)}
                        onChange={(event) => patch((draft) => {
                          draft.team.members[index].slug = event.target.checked
                            ? slugifyName(member.name, `member-${index + 1}`)
                            : ''
                        })}
                        disabled={!canEdit}
                      />
                      <span>
                        <strong>Create a personal profile page</strong>
                        <small>Visitors can open the card to see full education, experience and contact links.</small>
                      </span>
                    </label>
                    {member.slug ? (
                      <>
                        <div className="ap-route-preview">
                          <span>PUBLIC LINK</span>
                          <code>#/team/{member.slug}</code>
                        </div>
                        <details className="ap-slug-advanced">
                          <summary>Change page address</summary>
                          <Field
                            label="Profile page address"
                            value={member.slug}
                            onChange={(value) => patch((draft) => { draft.team.members[index].slug = value.toLowerCase().replace(/\s+/g, '-') })}
                            hint="Changing this after publishing will break the previous profile link."
                            disabled={!canEdit}
                          />
                        </details>
                      </>
                    ) : null}
                  </div>
                  {!member.photo ? (
                    <Field
                      label="Initials fallback"
                      value={member.initials}
                      onChange={(value) => patch((draft) => { draft.team.members[index].initials = value })}
                      hint="Only shown when no portrait is uploaded. Leave empty to derive it from the name."
                      disabled={!canEdit}
                    />
                  ) : (
                    <div className="ap-field ap-field-note">
                      <span>Portrait uploaded</span>
                      <p>Initials are hidden on the public card because a photo is available.</p>
                    </div>
                  )}
                  <Field label="Research focus" value={member.focus} onChange={(value) => patch((draft) => { draft.team.members[index].focus = value })} disabled={!canEdit} />
                  <Field label="Expected graduation" value={member.expected} onChange={(value) => patch((draft) => { draft.team.members[index].expected = value })} disabled={!canEdit} />
                  <StatusField
                    role={member.role}
                    value={member.status}
                    onChange={(value) => patch((draft) => { draft.team.members[index].status = value })}
                    disabled={!canEdit}
                  />
                  <Field label="Email" type="email" value={member.email} onChange={(value) => patch((draft) => { draft.team.members[index].email = value })} disabled={!canEdit} />
                  <Field label="Research interests" value={(member.interests || []).join(', ')} onChange={(value) => patch((draft) => { draft.team.members[index].interests = values(value) })} hint="Comma-separated." disabled={!canEdit} />
                  <Area label="Biography" value={(member.bio || []).join('\n\n')} onChange={(value) => patch((draft) => { draft.team.members[index].bio = value.split(/\n\s*\n/).filter(Boolean) })} hint="Separate paragraphs with a blank line." disabled={!canEdit} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Card
        title="Previous Students"
        description="Former students, visiting scholars and researchers."
        action={canEdit ? (
          <button className="ap-button ap-button--small" onClick={() => patch((draft) => {
            draft.team.alumni.push({ name: 'New alumnus', role: '', period: '', photo: '', position: { title: '', organization: '', link: '' }, link: '' })
          })}>
            + Add previous student
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.team.alumni.map((person, index) => (
            <article className="ap-repeat-card" key={`${person.name}-${index}`}>
              <div className="ap-repeat-card__top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{person.name}</strong>
                <RowActions
                  index={index}
                  length={content.team.alumni.length}
                  canEdit={canEdit}
                  onMove={(position, direction) => move((draft) => draft.team.alumni, position, direction)}
                  onRemove={(position) => remove((draft) => draft.team.alumni, position)}
                />
              </div>
              <div className="ap-form-grid">
                <Field label="Name" value={person.name} onChange={(value) => patch((draft) => { draft.team.alumni[index].name = value })} disabled={!canEdit} />
                <Field label="Role while in group" value={person.role} onChange={(value) => patch((draft) => { draft.team.alumni[index].role = value })} disabled={!canEdit} />
                <Field label="Period" value={person.period} onChange={(value) => patch((draft) => { draft.team.alumni[index].period = value })} disabled={!canEdit} />
                <Field label="Current title" value={person.position?.title || ''} onChange={(value) => patch((draft) => { draft.team.alumni[index].position.title = value })} disabled={!canEdit} />
                <Field label="Current organization" value={person.position?.organization || ''} onChange={(value) => patch((draft) => { draft.team.alumni[index].position.organization = value })} disabled={!canEdit} />
                <Field label="Profile link" type="url" value={person.link || ''} onChange={(value) => patch((draft) => { draft.team.alumni[index].link = value })} disabled={!canEdit} />
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function FacilitiesEditor({ content, patch, canEdit, uploadImage }) {
  const move = (index, direction) => patch((draft) => moveItem(draft.facilities.groups, index, direction))

  return (
    <div className="ap-stack">
      <SectionHeading
        index="04"
        eyebrow="LABORATORY"
        title="Facilities and instruments"
        description="A structured inventory shared by the homepage and the full facilities page."
      />
      <Card title="Section introduction">
        <div className="ap-form-grid">
          <Field label="Eyebrow" value={content.facilities.eyebrow} onChange={(value) => patch((draft) => { draft.facilities.eyebrow = value })} disabled={!canEdit} />
          <Field label="Title" value={content.facilities.title} onChange={(value) => patch((draft) => { draft.facilities.title = value })} disabled={!canEdit} />
          <Area label="Introduction" value={content.facilities.lead} onChange={(value) => patch((draft) => { draft.facilities.lead = value })} disabled={!canEdit} />
        </div>
      </Card>
      <Card
        title="Equipment groups"
        description="Each group is shown as a compact editorial list."
        action={canEdit ? (
          <button className="ap-button ap-button--small" onClick={() => patch((draft) => {
            draft.facilities.groups.push({ title: 'New equipment group', items: [] })
          })}>
            + Add group
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.facilities.groups.map((group, groupIndex) => (
            <article className="ap-repeat-card" key={`${group.title}-${groupIndex}`}>
              <div className="ap-repeat-card__top">
                <span>{String(groupIndex + 1).padStart(2, '0')}</span>
                <strong>{group.title}</strong>
                <RowActions
                  index={groupIndex}
                  length={content.facilities.groups.length}
                  canEdit={canEdit}
                  onMove={move}
                  onRemove={(position) => patch((draft) => draft.facilities.groups.splice(position, 1))}
                />
              </div>
              <Field label="Group title" value={group.title} onChange={(value) => patch((draft) => { draft.facilities.groups[groupIndex].title = value })} disabled={!canEdit} />
              <div className="ap-nested-list">
                {group.items.map((item, itemIndex) => (
                  <div className="ap-nested-item" key={`${item.name}-${itemIndex}`}>
                    <div className="ap-nested-item__head">
                      <strong>Instrument {itemIndex + 1}</strong>
                      {canEdit ? (
                        <button type="button" onClick={() => patch((draft) => draft.facilities.groups[groupIndex].items.splice(itemIndex, 1))}>
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <Field label="Name" value={item.name} onChange={(value) => patch((draft) => { draft.facilities.groups[groupIndex].items[itemIndex].name = value })} disabled={!canEdit} />
                    <Field label="Short description" value={item.body} onChange={(value) => patch((draft) => { draft.facilities.groups[groupIndex].items[itemIndex].body = value })} disabled={!canEdit} />
                    <Toggle
                      label="Create an individual equipment page"
                      value={item.detailPageEnabled}
                      onChange={(value) => patch((draft) => {
                        draft.facilities.groups[groupIndex].items[itemIndex].detailPageEnabled = value
                      })}
                      disabled={!canEdit}
                    />
                    {item.detailPageEnabled ? (
                      <div className="ap-equipment-page-editor">
                        <div className="ap-equipment-page-editor__heading">
                          <strong>Individual page details</strong>
                          <code>#/facilities/{equipmentSlug(item)}</code>
                        </div>
                        <ImageField
                          label="Equipment photo"
                          value={item.photo || ''}
                          onChange={(value) => patch((draft) => {
                            draft.facilities.groups[groupIndex].items[itemIndex].photo = value
                          })}
                          uploadImage={uploadImage}
                          canEdit={canEdit}
                          hint="Shown on the equipment list and its individual page."
                        />
                        <Area
                          label="Long description"
                          value={item.intro || ''}
                          onChange={(value) => patch((draft) => {
                            draft.facilities.groups[groupIndex].items[itemIndex].intro = value
                          })}
                          disabled={!canEdit}
                        />
                      </div>
                    ) : (
                      <p className="ap-inline-note">
                        This equipment remains visible on the public list, but its
                        card will not link to a detail page.
                      </p>
                    )}
                  </div>
                ))}
                {canEdit ? (
                  <button
                    type="button"
                    className="ap-add-line"
                    onClick={() => patch((draft) => {
                      draft.facilities.groups[groupIndex].items.push({
                        name: 'New instrument',
                        body: '',
                        intro: '',
                        photo: '',
                        detailPageEnabled: false,
                      })
                    })}
                  >
                    + Add instrument to this group
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function PublicationsEditor({ content, patch, canEdit }) {
  const move = (index, direction) => patch((draft) => moveItem(draft.publications.items, index, direction))

  return (
    <div className="ap-stack">
      <SectionHeading
        index="05"
        eyebrow="SCHOLARSHIP"
        title="Publications"
        description="Selected work appears first on the public site; complete entries remain available by year."
      />
      <Card title="Section settings">
        <div className="ap-form-grid">
          <Field label="Section title" value={content.publications.title} onChange={(value) => patch((draft) => { draft.publications.title = value })} disabled={!canEdit} />
          <Field label="Google Scholar URL" type="url" value={content.publications.scholarUrl} onChange={(value) => patch((draft) => { draft.publications.scholarUrl = value })} disabled={!canEdit} />
          <Field label="Homepage item limit" type="number" value={content.publications.limit} onChange={(value) => patch((draft) => { draft.publications.limit = Number(value) })} disabled={!canEdit} />
          <Area label="Introduction" value={content.publications.lead} onChange={(value) => patch((draft) => { draft.publications.lead = value })} disabled={!canEdit} />
        </div>
      </Card>
      <Card
        title="Publication list"
        description="Newest first. Click the highlight toggle on work that should receive the red marker."
        action={canEdit ? (
          <button className="ap-button ap-button--small" onClick={() => patch((draft) => {
            draft.publications.items.unshift({ year: String(new Date().getFullYear()), title: 'New publication', authors: 'Y. Li', venue: '', highlight: false, links: [] })
          })}>
            + Add publication
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.publications.items.map((item, index) => (
            <article className="ap-repeat-card" key={`${item.title}-${index}`}>
              <div className="ap-repeat-card__top">
                <span>{item.year}</span>
                <strong>{item.title}</strong>
                <RowActions
                  index={index}
                  length={content.publications.items.length}
                  canEdit={canEdit}
                  onMove={move}
                  onRemove={(position) => patch((draft) => draft.publications.items.splice(position, 1))}
                />
              </div>
              <div className="ap-form-grid">
                <Field label="Year" value={item.year} onChange={(value) => patch((draft) => { draft.publications.items[index].year = value })} disabled={!canEdit} />
                <Field label="Authors" value={item.authors} onChange={(value) => patch((draft) => { draft.publications.items[index].authors = value })} disabled={!canEdit} />
                <Field label="Title" value={item.title} onChange={(value) => patch((draft) => { draft.publications.items[index].title = value })} disabled={!canEdit} />
                <Field label="Journal or venue" value={item.venue} onChange={(value) => patch((draft) => { draft.publications.items[index].venue = value })} disabled={!canEdit} />
                <Toggle label="Highlighted work" value={item.highlight} onChange={(value) => patch((draft) => { draft.publications.items[index].highlight = value })} disabled={!canEdit} />
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function NewsEditor({ content, patch, canEdit }) {
  const move = (index, direction) => patch((draft) => moveItem(draft.news.items, index, direction))

  return (
    <div className="ap-stack">
      <SectionHeading
        index="06"
        eyebrow="NEWS"
        title="Group updates"
        description="Announcements, papers, talks and practical updates appear here with their own linked page."
      />
      <Card
        title="News stories"
        description={content.news.items.length ? `${content.news.items.length} published updates.` : 'No updates yet.'}
        action={canEdit ? (
          <button className="ap-button ap-button--small" onClick={() => patch((draft) => {
            draft.news.items.unshift({
              slug: `update-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              dateLabel: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              tag: 'Announcement',
              title: 'New group update',
              summary: '',
              body: [],
            })
          })}>
            + Add news item
          </button>
        ) : null}
      >
        <div className="ap-repeaters">
          {content.news.items.map((item, index) => (
            <article className="ap-repeat-card" key={`${item.slug}-${index}`}>
              <div className="ap-repeat-card__top">
                <span>{item.dateLabel || item.date}</span>
                <strong>{item.title}</strong>
                <RowActions
                  index={index}
                  length={content.news.items.length}
                  canEdit={canEdit}
                  onMove={move}
                  onRemove={(position) => patch((draft) => draft.news.items.splice(position, 1))}
                />
              </div>
              <div className="ap-form-grid">
                <Field label="URL slug" value={item.slug} onChange={(value) => patch((draft) => { draft.news.items[index].slug = value })} hint="Changing this breaks old links." disabled={!canEdit} />
                <Field label="Tag" value={item.tag} onChange={(value) => patch((draft) => { draft.news.items[index].tag = value })} disabled={!canEdit} />
                <Field label="ISO date" type="date" value={item.date} onChange={(value) => patch((draft) => { draft.news.items[index].date = value })} disabled={!canEdit} />
                <Field label="Display date" value={item.dateLabel} onChange={(value) => patch((draft) => { draft.news.items[index].dateLabel = value })} disabled={!canEdit} />
                <Field label="Title" wide value={item.title} onChange={(value) => patch((draft) => { draft.news.items[index].title = value })} disabled={!canEdit} />
                <Area label="Summary" value={item.summary} onChange={(value) => patch((draft) => { draft.news.items[index].summary = value })} disabled={!canEdit} />
                <Area label="Article body" value={(item.body || []).join('\n\n')} onChange={(value) => patch((draft) => { draft.news.items[index].body = value.split(/\n\s*\n/).filter(Boolean) })} hint="Separate paragraphs with a blank line." disabled={!canEdit} />
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function OutreachEditor({ content, patch, canEdit, uploadImage }) {
  const movePartner = (index, direction) =>
    patch((draft) => moveItem(draft.sponsors.logos, index, direction))

  return (
    <div className="ap-stack">
      <SectionHeading
        index="05"
        eyebrow="INDUSTRY PARTNERS"
        title="Industry Partners"
        description="Manage partner logos, company names and links, followed by the public openings section."
      />
      <Card title="Partner introduction">
        <div className="ap-form-grid">
          <Field label="Eyebrow" value={content.sponsors.eyebrow} onChange={(value) => patch((draft) => { draft.sponsors.eyebrow = value })} disabled={!canEdit} />
          <Field label="Title" value={content.sponsors.title} onChange={(value) => patch((draft) => { draft.sponsors.title = value })} disabled={!canEdit} />
          <Area label="Introduction" value={content.sponsors.lead} onChange={(value) => patch((draft) => { draft.sponsors.lead = value })} disabled={!canEdit} />
        </div>
      </Card>
      <Card
        title="Partner logos"
        description="Each entry appears as a logo card on the public homepage."
        action={canEdit ? (
          <button
            type="button"
            className="ap-button ap-button--small"
            onClick={() => patch((draft) => {
              draft.sponsors.logos.push({ name: 'Company name', logo: '', href: '' })
            })}
          >
            + Add partner
          </button>
        ) : null}
      >
        {content.sponsors.logos.length ? (
          <div className="ap-repeaters">
            {content.sponsors.logos.map((partner, index) => (
              <article className="ap-partner-editor" key={`${partner.name}-${index}`}>
                <div className="ap-repeat-card__top">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{partner.name || 'Untitled partner'}</strong>
                  <RowActions
                    index={index}
                    length={content.sponsors.logos.length}
                    canEdit={canEdit}
                    onMove={movePartner}
                    onRemove={(position) => patch((draft) => draft.sponsors.logos.splice(position, 1))}
                  />
                </div>
                <div className="ap-partner-editor__body">
                  <ImageField
                    label="Company logo"
                    value={partner.logo}
                    onChange={(value) => patch((draft) => { draft.sponsors.logos[index].logo = value })}
                    uploadImage={uploadImage}
                    canEdit={canEdit}
                    ratio="logo"
                    hint="Transparent PNG or SVG-style mark works best."
                  />
                  <div className="ap-form-grid">
                    <Field label="Company name" value={partner.name} onChange={(value) => patch((draft) => { draft.sponsors.logos[index].name = value })} disabled={!canEdit} />
                    <Field label="Website" type="url" value={partner.href} onChange={(value) => patch((draft) => { draft.sponsors.logos[index].href = value })} disabled={!canEdit} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ap-partner-empty">
            <span>NO PARTNER LOGOS YET</span>
            <p>
              The public homepage will show the configured placeholder slots until
              the first company logo is added.
            </p>
          </div>
        )}
      </Card>
      <Card title="Open positions" description="The red closing section on the public homepage.">
        <div className="ap-form-grid">
          <Field label="Eyebrow" value={content.join.eyebrow} onChange={(value) => patch((draft) => { draft.join.eyebrow = value })} disabled={!canEdit} />
          <Field label="Title" value={content.join.title} onChange={(value) => patch((draft) => { draft.join.title = value })} disabled={!canEdit} />
          <Field label="Button label" value={content.join.ctaLabel} onChange={(value) => patch((draft) => { draft.join.ctaLabel = value })} disabled={!canEdit} />
          <Area label="Introduction" value={content.join.lead} onChange={(value) => patch((draft) => { draft.join.lead = value })} disabled={!canEdit} />
        </div>
        <div className="ap-two-column">
          {content.join.columns.map((column, columnIndex) => (
            <article className="ap-repeat-card" key={`${column.title}-${columnIndex}`}>
              <Field label={`Column ${columnIndex + 1} title`} value={column.title} onChange={(value) => patch((draft) => { draft.join.columns[columnIndex].title = value })} disabled={!canEdit} />
              <Area label="Items" value={column.points.join('\n')} onChange={(value) => patch((draft) => { draft.join.columns[columnIndex].points = value.split('\n').filter(Boolean) })} hint="One item per line." disabled={!canEdit} />
            </article>
          ))}
        </div>
      </Card>
      <Card title="Footer">
        <div className="ap-form-grid">
          <Field label="Last updated" value={content.footer.lastUpdated} onChange={(value) => patch((draft) => { draft.footer.lastUpdated = value })} disabled={!canEdit} />
        </div>
      </Card>
    </div>
  )
}
