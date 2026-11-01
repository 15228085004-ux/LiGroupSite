# Li Research Group Website & Content Office

The University of Utah · Department of Mining Engineering

- Public website: <https://15228085004-ux.github.io/LiGroupSite/>
- Source repository: <https://github.com/15228085004-ux/LiGroupSite>
- Maintenance workspace: `正式网址/#/admin`

This version keeps the existing Li Research Group visual identity and adds a
full content-maintenance system backed by Supabase.

## What is included

### Public website

- Full-screen mine photography and existing University of Utah visual identity
- Research interests
- Principal Investigator and student profiles
- Lab facilities and equipment
- Industry partners
- Open positions
- Responsive desktop and mobile layouts

### Content Office

- Invitation-only email/password login
- Admin, editor and viewer roles
- Separate draft and published versions
- Full-page draft preview using the real public components
- Editing for identity, hero photography, research, team, facilities,
  partners, logos and openings
- Image upload through Supabase Storage
- Publication history with up to 30 restorable versions
- Public fallback when Supabase temporarily cannot be reached
- Local demo mode before Supabase is configured

## Local preview

On Windows, double-click `启动网站.cmd`, or run:

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
http://127.0.0.1:5173/#/admin
```

The admin login page provides a demo editor when Supabase variables are absent.
Demo changes are stored only in the current browser.

Production check:

```powershell
npm run build
npm run preview
```

## How content works

`src/data/site.js` remains the source-controlled fallback and a complete example
of every content field.

When Supabase is configured:

1. The public site requests the published JSON document.
2. Missing fields are safely merged with the source-controlled fallback.
3. The admin loads the private draft.
4. “Save draft” changes only the draft.
5. “Publish” replaces the public document and creates a version snapshot.

This means the public website remains available during a temporary backend
outage, while the original React components and CSS continue to drive the design.
Publication and news routes remain in the source for later use, but are
intentionally not exposed while the current public homepage does not include
those sections.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Create the first user in **Authentication → Users**. The first user becomes
   an administrator.
4. Copy `.env.example` to `.env.local` and add the public project URL and anon
   key.
5. Restart `npm run dev`.

Full instructions: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Teacher and student guides

- [Teacher emergency guide](docs/TEACHER-GUIDE.md)
- [Student maintenance guide](docs/STUDENT-GUIDE.md)

## Project structure

```text
src/
├─ admin/                    Content Office interface and editors
├─ components/               Existing public website components
├─ pages/                    Existing publication/news/profile pages
├─ data/
│  ├─ site.js                Source-controlled content and image fallback
│  ├─ contentModel.js        Safe content normalization
│  └─ siteContent.jsx        Shared public-site content provider
├─ lib/groupApi.js           Supabase and demo data adapter
└─ styles/admin.css          Li Group-branded admin styling
supabase/schema.sql           Database, RLS, publication and storage setup
.github/workflows/deploy.yml  GitHub Pages deployment
```

## Security

- Anonymous users can read only `get_published_content()`.
- Drafts and version history are protected by database functions and row-level
  security.
- The anon key is public by design. The `service_role` key is never used in the
  frontend and must never be added to `VITE_` variables.
- New accounts are read-only until an administrator assigns a role.
- The administrator should keep independent access and should not depend on one
  student being awake.
