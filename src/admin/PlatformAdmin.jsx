import { useEffect, useMemo, useState } from 'react'
import interlockingU from '../assets/brand/interlocking-u-mark.png'
import uWordmark from '../assets/brand/u-wordmark.png'
import { groupApi } from '../lib/groupApi.js'
import {
  FacilitiesEditor,
  IdentityEditor,
  OutreachEditor,
  ResearchEditor,
  TeamEditor,
} from './AdminEditors.jsx'
import PublicPreview from './PublicPreview.jsx'

const TABS = [
  { id: 'overview', label: 'Overview', number: '00' },
  { id: 'identity', label: 'Identity & Hero', number: '01' },
  { id: 'research', label: 'Research', number: '02' },
  { id: 'team', label: 'Team', number: '03' },
  { id: 'facilities', label: 'Facilities', number: '04' },
  { id: 'outreach', label: 'Partners & Openings', number: '05' },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function Mark({ light = false }) {
  return (
    <span className={`ap-brand-mark ${light ? 'ap-brand-mark--light' : ''}`}>
      <img src={interlockingU} alt="" />
      <img src={uWordmark} alt="The University of Utah" />
    </span>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      onLogin(await groupApi.signIn(email, password))
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="ap-login">
      <div className="ap-login__atmosphere" aria-hidden="true">
        <div className="ap-login__grid" />
        <div className="ap-login__orb ap-login__orb--blue" />
        <div className="ap-login__orb ap-login__orb--red" />
      </div>

      <header className="ap-login__topbar">
        <a className="ap-login__brand" href="#/">
          <Mark />
          <span>
            <strong>LI RESEARCH GROUP</strong>
            <small>CONTENT OFFICE</small>
          </span>
        </a>
        <a className="ap-login__back" href="#/">
          Return to public site <span>↗</span>
        </a>
      </header>

      <section className="ap-login__stage">
        <div className="ap-login__ambient ap-login__ambient--top" aria-hidden="true">
          <span>RESEARCH RECORD</span>
          <strong>One source of truth</strong>
          <i />
        </div>
        <div className="ap-login__ambient ap-login__ambient--bottom" aria-hidden="true">
          <span>EDITORIAL WORKFLOW</span>
          <div>
            <b>Draft</b>
            <i />
            <b>Review</b>
            <i />
            <b>Publish</b>
          </div>
        </div>

        <div className="ap-login__card">
          <div className="ap-login__card-intro">
            <div className="ap-login__status">
              <i />
              PRIVATE WORKSPACE
            </div>
            <h1>
              Content
              <br />
              Office
            </h1>
            <p>
              Maintain the research, people, facilities and partnerships behind
              Li Research Group.
            </p>
            <div className="ap-login__credentials">
              <span>Li Research Group</span>
              <span>University of Utah</span>
            </div>
          </div>

          <div className="ap-login__form-panel">
            <div className="ap-login__form-heading">
              <span>{groupApi.mode === 'demo' ? 'PREVIEW ACCESS' : 'MEMBER ACCESS'}</span>
              <strong>Sign in to continue</strong>
            </div>

            {groupApi.mode === 'demo' ? (
              <>
                <div className="ap-demo-note">
                  <strong>Local preview mode</strong>
                  <p>
                    Changes stay in this browser. Connect Supabase for shared
                    accounts and publishing.
                  </p>
                </div>
                <button
                  className="ap-button ap-button--black ap-button--wide"
                  onClick={() => onLogin(groupApi.getDemoUser())}
                >
                  Enter demo workspace <span>→</span>
                </button>
              </>
            ) : (
              <form className="ap-login__form" onSubmit={submit}>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@utah.edu"
                    required
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your assigned password"
                    required
                  />
                </label>
                {error ? <p className="ap-error">{error}</p> : null}
                <button
                  className="ap-button ap-button--black ap-button--wide"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? 'Signing in…' : 'Sign in'} {!busy ? <span>→</span> : null}
                </button>
              </form>
            )}
            <p className="ap-login__help">
              Access is invitation-only. Account roles are managed by the site
              administrator.
            </p>
          </div>
        </div>
      </section>

      <footer className="ap-login__footer">
        <span>Department of Mining Engineering</span>
        <span>College of Mines & Earth Sciences</span>
      </footer>
    </main>
  )
}

function Overview({ content, adminData, user, goTo, onPublish }) {
  return (
    <div className="ap-stack">
      <section className="ap-hero">
        <div>
          <p className="ap-eyebrow">EDITORIAL WORKSPACE</p>
          <h1>
            Welcome back,
            <br />
            {user.profile.display_name}.
          </h1>
          <p>
            The public site currently reflects the last published version.
            Draft changes stay private until you publish them.
          </p>
        </div>
      </section>

      <div className="ap-stats">
        <button onClick={() => goTo('team')}>
          <span>Group members</span>
          <strong>{content.team.members.length}</strong>
          <small>current profiles</small>
        </button>
        <button onClick={() => goTo('research')}>
          <span>Research areas</span>
          <strong>{content.research.areas.length}</strong>
          <small>active directions</small>
        </button>
        <button onClick={() => goTo('facilities')}>
          <span>Instruments</span>
          <strong>
            {content.facilities.groups.reduce(
              (count, group) => count + group.items.length,
              0,
            )}
          </strong>
          <small>across {content.facilities.groups.length} groups</small>
        </button>
      </div>

      <div className="ap-dashboard-grid">
        <section className="ap-card ap-quick-card">
          <div className="ap-card__head">
            <div>
              <p className="ap-eyebrow">HOMEPAGE AT A GLANCE</p>
              <h3>
                {content.hero.titleLine1} {content.hero.titleLine2}
              </h3>
              <p>{content.hero.lead}</p>
            </div>
            <time>{content.group.name}</time>
          </div>
          <div className="ap-quick-card__actions">
            <button className="ap-button ap-button--red" onClick={() => goTo('identity')}>
              Edit homepage
            </button>
            <button className="ap-button ap-button--outline" onClick={onPublish}>
              Save & publish
            </button>
          </div>
        </section>

        <section className="ap-card ap-status-card">
          <p className="ap-eyebrow">PUBLICATION STATUS</p>
          <dl>
            <div>
              <dt>Draft saved</dt>
              <dd>{adminData.updatedAt ? new Date(adminData.updatedAt).toLocaleString() : 'Not saved'}</dd>
            </div>
            <div>
              <dt>Last published</dt>
              <dd>{adminData.publishedAt ? new Date(adminData.publishedAt).toLocaleString() : 'Not published'}</dd>
            </div>
            <div>
              <dt>Public site</dt>
              <dd className="is-online"><i /> Online</dd>
            </div>
          </dl>
          <a href="#/" target="_blank" rel="noreferrer">
            Open public website <span>↗</span>
          </a>
        </section>
      </div>

      <section className="ap-card">
        <div className="ap-card__head">
          <div>
            <p className="ap-eyebrow">RESEARCH AT A GLANCE</p>
            <h3>Current research directions</h3>
          </div>
          <button className="ap-text-button" onClick={() => goTo('research')}>
            Manage →
          </button>
        </div>
        <div className="ap-research-preview">
          {content.research.areas.slice(0, 4).map((area) => (
            <div key={area.title}>
              <span>{area.index}</span>
              <strong>{area.title}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AccessPanel({ user }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    groupApi
      .listProfiles()
      .then(setProfiles)
      .catch((loadError) => setError(loadError.message || 'Unable to load members'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (user.profile.role !== 'admin') {
    return (
      <div className="ap-stack">
        <section className="ap-section-heading">
          <span>06</span>
          <div>
            <p>ACCESS</p>
            <h2>Members and permissions</h2>
            <small>Administrator access is required.</small>
          </div>
        </section>
        <section className="ap-card ap-empty">
          Your account can edit and publish content but cannot manage access.
        </section>
      </div>
    )
  }

  const changeRole = async (profileId, role) => {
    try {
      await groupApi.updateRole(profileId, role)
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === profileId ? { ...profile, role } : profile,
        ),
      )
    } catch (updateError) {
      setError(updateError.message || 'Unable to update role')
    }
  }

  return (
    <div className="ap-stack">
      <section className="ap-section-heading">
        <span>06</span>
        <div>
          <p>ACCESS</p>
          <h2>Members and permissions</h2>
          <small>
            Admins manage access, editors can publish, and viewers can inspect drafts only.
          </small>
        </div>
      </section>
      <section className="ap-card ap-card--flush">
        <div className="ap-card__head ap-card__head--padded">
          <div>
            <h3>Editorial team</h3>
            <p>New accounts are invited through Supabase Authentication.</p>
          </div>
          <button className="ap-button ap-button--small ap-button--outline" onClick={load}>
            Refresh
          </button>
        </div>
        {error ? <p className="ap-error ap-error--block">{error}</p> : null}
        {loading ? (
          <p className="ap-loading-line">Loading team…</p>
        ) : (
          <div className="ap-members">
            <div className="ap-member ap-member--head">
              <span>Member</span>
              <span>Role</span>
              <span>Joined</span>
            </div>
            {profiles.map((profile) => (
              <div className="ap-member" key={profile.id}>
                <div className="ap-member__identity">
                  <i>{profile.display_name.slice(0, 1).toUpperCase()}</i>
                  <div>
                    <strong>{profile.display_name}</strong>
                    <small>{profile.email}</small>
                  </div>
                </div>
                <select
                  value={profile.role}
                  disabled={profile.id === user.id}
                  onChange={(event) => changeRole(profile.id, event.target.value)}
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <time>{new Date(profile.created_at).toLocaleDateString()}</time>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function HistoryPanel({ canEdit, onRestore }) {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    groupApi
      .listVersions()
      .then(setVersions)
      .catch((loadError) => setError(loadError.message || 'Unable to load history'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const restore = async (version) => {
    if (!window.confirm(`Restore “${version.note}” as the new draft?`)) return
    try {
      onRestore(await groupApi.restoreVersion(version.id))
    } catch (restoreError) {
      setError(restoreError.message || 'Unable to restore version')
    }
  }

  return (
    <div className="ap-stack">
      <section className="ap-section-heading">
        <span>07</span>
        <div>
          <p>PUBLICATION HISTORY</p>
          <h2>Versions</h2>
          <small>
            Every publish creates a full snapshot. Restoring a version changes
            the draft; it never changes the public site until published again.
          </small>
        </div>
      </section>
      <section className="ap-card ap-card--flush">
        <div className="ap-card__head ap-card__head--padded">
          <div>
            <h3>Publication record</h3>
            <p>The latest 30 published versions are retained.</p>
          </div>
          <button className="ap-button ap-button--small ap-button--outline" onClick={load}>
            Refresh
          </button>
        </div>
        {error ? <p className="ap-error ap-error--block">{error}</p> : null}
        {loading ? (
          <p className="ap-loading-line">Loading publication history…</p>
        ) : versions.length ? (
          <div className="ap-versions">
            {versions.map((version, index) => (
              <article className="ap-version" key={version.id}>
                <i />
                <div>
                  <strong>{version.note}</strong>
                  {index === 0 ? <em>LATEST</em> : null}
                  <p>
                    {new Date(version.createdAt).toLocaleString()} ·{' '}
                    {version.publishedBy}
                  </p>
                </div>
                {canEdit ? (
                  <button className="ap-button ap-button--small ap-button--outline" onClick={() => restore(version)}>
                    Restore draft
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="ap-loading-line">No published versions yet.</p>
        )}
      </section>
    </div>
  )
}

function Workspace({ user, onSignOut }) {
  const [content, setContent] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishNote, setPublishNote] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const initialDisplayName = user.profile.display_name || ''
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [profileNameDraft, setProfileNameDraft] = useState(initialDisplayName)
  const [profileOpen, setProfileOpen] = useState(/^\d+$/.test(initialDisplayName.trim()))

  const canEdit =
    user.profile.role === 'admin' || user.profile.role === 'editor'
  const activeUser = {
    ...user,
    profile: {
      ...user.profile,
      display_name: displayName,
    },
  }

  const notify = (message, tone = 'success') => setToast({ message, tone })

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await groupApi.getAdminContent()
      setContent(data.draft)
      setAdminData(data)
      setDirty(false)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load maintenance content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const patch = (updater) => {
    if (!canEdit) return
    setContent((current) => {
      if (!current) return current
      const next = clone(current)
      updater(next)
      return next
    })
    setDirty(true)
  }

  const validate = (draft) => {
    if (!draft.group.name.trim()) return 'Group name cannot be empty.'
    if (!draft.hero.titleLine1.trim()) return 'The hero title cannot be empty.'
    if (draft.contact.email && !draft.contact.email.includes('@')) {
      return 'Please check the contact email address.'
    }
    return ''
  }

  const saveDraft = async () => {
    const validationError = validate(content)
    if (validationError) return notify(validationError, 'error')
    setBusy(true)
    try {
      const updatedAt = await groupApi.saveDraft(content)
      setAdminData((current) => ({ ...current, updatedAt }))
      setDirty(false)
      notify('Draft saved. The public site is unchanged until you publish.')
    } catch (saveError) {
      notify(saveError.message || 'Unable to save draft', 'error')
    } finally {
      setBusy(false)
    }
  }

  const openPublish = () => {
    const validationError = validate(content)
    if (validationError) return notify(validationError, 'error')
    setPublishNote('Li Research Group site update')
    setPublishOpen(true)
  }

  const publish = async () => {
    setBusy(true)
    try {
      const next = clone(content)
      next.footer.lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      })
      const publishedAt = await groupApi.publish(
        next,
        publishNote,
        user.email,
      )
      setContent(next)
      setAdminData({
        draft: next,
        published: next,
        updatedAt: publishedAt,
        publishedAt,
      })
      setDirty(false)
      setPublishOpen(false)
      setPublishNote('')
      notify('Published. The public website now uses this version.')
    } catch (publishError) {
      notify(publishError.message || 'Unable to publish', 'error')
    } finally {
      setBusy(false)
    }
  }

  const uploadImage = async (file) => {
    try {
      const url = await groupApi.uploadImage(file)
      notify('Image uploaded. Publish to make it public.')
      return url
    } catch (uploadError) {
      notify(uploadError.message || 'Image upload failed', 'error')
      throw uploadError
    }
  }

  const saveDisplayName = async () => {
    if (profileNameDraft.trim().length < 2) {
      return notify('Display name must contain at least 2 characters.', 'error')
    }
    setBusy(true)
    try {
      const savedName = await groupApi.updateDisplayName(profileNameDraft)
      setDisplayName(savedName)
      setProfileNameDraft(savedName)
      setProfileOpen(false)
      notify('Display name updated.')
    } catch (profileError) {
      notify(profileError.message || 'Unable to update display name', 'error')
    } finally {
      setBusy(false)
    }
  }

  const goTo = (nextTab) => {
    setTab(nextTab)
    setNavOpen(false)
  }

  const restore = (restored) => {
    setContent(restored)
    setDirty(true)
    setTab('overview')
    notify('Version restored as draft. Review it before publishing.')
  }

  const pageTitle = useMemo(
    () => TABS.find((item) => item.id === tab)?.label || 'Overview',
    [tab],
  )

  if (loading) {
    return (
      <main className="ap-loading">
        <Mark />
        <span>Loading editorial workspace…</span>
      </main>
    )
  }

  if (error || !content || !adminData) {
    return (
      <main className="ap-fatal">
        <p className="ap-eyebrow">CONNECTION ERROR</p>
        <h1>Unable to open the content office</h1>
        <p>{error || 'The content document could not be loaded.'}</p>
        <button className="ap-button ap-button--red" onClick={load}>Try again</button>
      </main>
    )
  }

  const editorProps = { content, patch, canEdit, uploadImage }

  return (
    <div className="ap-shell">
      <aside className={`ap-sidebar ${navOpen ? 'ap-sidebar--open' : ''}`}>
        <a className="ap-sidebar__brand" href="#/">
          <Mark />
          <span>
            <strong>LI RESEARCH GROUP</strong>
            <small>CONTENT OFFICE</small>
          </span>
        </a>

        <nav className="ap-nav">
          <p>Editorial</p>
          {TABS.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? 'is-active' : ''}
              onClick={() => goTo(item.id)}
            >
              <span>{item.number}</span>
              {item.label}
            </button>
          ))}
          <p>System</p>
          {user.profile.role === 'admin' ? (
            <button
              className={tab === 'access' ? 'is-active' : ''}
              onClick={() => goTo('access')}
            >
              <span>06</span>Access
            </button>
          ) : null}
          <button
            className={tab === 'versions' ? 'is-active' : ''}
            onClick={() => goTo('versions')}
          >
            <span>07</span>Versions
          </button>
        </nav>

        <div className="ap-sidebar__foot">
          <a href="#/" target="_blank" rel="noreferrer">
            Public website <span>↗</span>
          </a>
          {groupApi.mode === 'demo' ? (
            <button
              className="ap-reset"
              onClick={async () => {
                if (!window.confirm('Reset all local demo content?')) return
                groupApi.resetDemo()
                await load()
                notify('Demo content reset.')
              }}
            >
              Reset demo data
            </button>
          ) : null}
          <div className="ap-account">
            <i>{displayName.slice(0, 1).toUpperCase()}</i>
            <div>
              <strong>{displayName}</strong>
              <small>{user.profile.role}</small>
            </div>
            <button
              className="ap-account__edit"
              onClick={() => setProfileOpen(true)}
              aria-label="Edit display name"
              title="Edit display name"
            >
              ✎
            </button>
            <button onClick={onSignOut} aria-label="Sign out">↪</button>
          </div>
        </div>
      </aside>

      <div className="ap-main">
        <header className="ap-topbar">
          <button
            className="ap-menu"
            onClick={() => setNavOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="ap-breadcrumb">
            <span>CONTENT OFFICE</span>
            <i>/</i>
            <strong>{pageTitle}</strong>
          </div>
          <div className="ap-topbar__actions">
            {groupApi.mode === 'demo' ? <span className="ap-mode">LOCAL DEMO</span> : null}
            {dirty ? <span className="ap-dirty">UNPUBLISHED</span> : null}
            <button
              className="ap-topbar__preview"
              onClick={() => setPreviewOpen(true)}
              aria-label="Preview draft"
            >
              <span aria-hidden="true">◉</span>
              <span className="ap-preview-label">Preview</span>
            </button>
            {canEdit ? (
              <>
                <button className="ap-button ap-button--small ap-button--outline" onClick={saveDraft} disabled={busy}>
                  Save draft
                </button>
                <button className="ap-button ap-button--small ap-button--red" onClick={openPublish} disabled={busy}>
                  Publish <span>↗</span>
                </button>
              </>
            ) : null}
          </div>
        </header>

        {!canEdit ? (
          <div className="ap-readonly">
            Your account has read-only access. Drafts are visible, but changes
            cannot be saved or published.
          </div>
        ) : null}

        <main className="ap-content">
          {tab === 'overview' ? (
            <Overview
              content={content}
              adminData={adminData}
              user={activeUser}
              goTo={goTo}
              onPublish={openPublish}
            />
          ) : null}
          {tab === 'identity' ? <IdentityEditor {...editorProps} /> : null}
          {tab === 'research' ? <ResearchEditor {...editorProps} /> : null}
          {tab === 'team' ? <TeamEditor {...editorProps} /> : null}
          {tab === 'facilities' ? <FacilitiesEditor {...editorProps} /> : null}
          {tab === 'outreach' ? <OutreachEditor {...editorProps} /> : null}
          {tab === 'access' ? <AccessPanel user={activeUser} /> : null}
          {tab === 'versions' ? (
            <HistoryPanel canEdit={canEdit} onRestore={restore} />
          ) : null}
        </main>

        <footer className="ap-footer">
          <span>Li Research Group · Department of Mining Engineering</span>
          <span>{dirty ? 'DRAFT HAS UNPUBLISHED CHANGES' : 'DRAFT IN SYNC'}</span>
        </footer>
      </div>

      {publishOpen ? (
        <div className="ap-modal-backdrop">
          <section className="ap-modal" role="dialog" aria-modal="true">
            <button className="ap-modal__close" onClick={() => setPublishOpen(false)}>×</button>
            <p className="ap-eyebrow">READY TO PUBLISH</p>
            <h2>Replace the public version?</h2>
            <p>
              Visitors will see this draft immediately. A restorable snapshot
              will be added to the publication history.
            </p>
            <label className="ap-field">
              <span>Version note</span>
              <input
                value={publishNote}
                onChange={(event) => setPublishNote(event.target.value)}
                placeholder="For example: Add new publication"
                autoFocus
              />
              <small>This note is shown in publication history.</small>
            </label>
            <div className="ap-modal__actions">
              <button className="ap-button ap-button--outline" onClick={() => setPublishOpen(false)} disabled={busy}>
                Cancel
              </button>
              <button className="ap-button ap-button--red" onClick={publish} disabled={busy}>
                {busy ? 'Publishing…' : 'Publish now'} {!busy ? <span>↗</span> : null}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {profileOpen ? (
        <div className="ap-modal-backdrop">
          <section className="ap-modal ap-profile-modal" role="dialog" aria-modal="true">
            <button className="ap-modal__close" onClick={() => setProfileOpen(false)}>×</button>
            <p className="ap-eyebrow">YOUR PROFILE</p>
            <h2>How should your name appear?</h2>
            <p>
              Your email remains the private login identifier. This display name
              is shown in the workspace and publication history.
            </p>
            <label className="ap-field">
              <span>Display name</span>
              <input
                value={profileNameDraft}
                onChange={(event) => setProfileNameDraft(event.target.value)}
                placeholder="For example: Yuan (Stuart) Li"
                autoFocus
              />
              <small>Between 2 and 80 characters.</small>
            </label>
            <div className="ap-modal__actions">
              <button className="ap-button ap-button--outline" onClick={() => setProfileOpen(false)} disabled={busy}>
                Cancel
              </button>
              <button className="ap-button ap-button--red" onClick={saveDisplayName} disabled={busy}>
                {busy ? 'Saving…' : 'Save display name'}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {previewOpen ? (
        <div className="ap-preview" role="dialog" aria-modal="true">
          <div className="ap-preview__bar">
            <div>
              <span>DRAFT PREVIEW</span>
              <strong>Li Research Group</strong>
              {dirty ? <small>Includes unpublished changes</small> : null}
            </div>
            <div>
              <a href="#/" target="_blank" rel="noreferrer">Open live site ↗</a>
              <button onClick={() => setPreviewOpen(false)}>Close preview ×</button>
            </div>
          </div>
          <div className="ap-preview__scroll">
            <PublicPreview content={content} />
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={`ap-toast ap-toast--${toast.tone}`} role="status">
          <span>{toast.tone === 'success' ? '✓' : '!'}</span>
          {toast.message}
          <button onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      ) : null}
    </div>
  )
}

export default function PlatformAdmin() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(groupApi.mode === 'supabase')

  useEffect(() => {
    if (groupApi.mode !== 'supabase') return
    groupApi
      .getCurrentUser()
      .then(setUser)
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <main className="ap-loading">
        <Mark />
        <span>Checking editorial access…</span>
      </main>
    )
  }

  if (!user) return <Login onLogin={setUser} />

  return (
    <Workspace
      user={user}
      onSignOut={async () => {
        await groupApi.signOut()
        setUser(null)
      }}
    />
  )
}
