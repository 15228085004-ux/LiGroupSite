# Student maintenance guide

## Roles

| Role | Access |
|---|---|
| Administrator | Content, publishing and member roles |
| Editor | Content, preview, publishing and version restore |
| Viewer | View drafts only |

Most routine edits happen in Content Office. Do not change React code for a
member biography, lab update or partner logo.

## Daily workflow

```text
Sign in → choose section → edit → Preview → Publish → check public page
```

Every public change creates a restorable snapshot.

## Development

```powershell
npm install
npm run dev
npm run build
```

Local addresses:

```text
http://127.0.0.1:5173/
http://127.0.0.1:5173/#/admin
```

Without Supabase environment variables, the admin runs in local demo mode.

## Architecture

- Public React components preserve the original Li Group design.
- `src/data/site.js` is the source-controlled fallback content.
- `src/data/siteContent.jsx` merges published Supabase content with the fallback.
- `src/lib/groupApi.js` handles authentication, drafts, publishing, history,
  users and image upload.
- `supabase/schema.sql` creates all database and storage permissions.

## Safety rules

- Never put a Supabase `service_role` key in a `VITE_` variable.
- Never edit production data directly in Supabase tables.
- Do not change a news slug after publishing if the existing URL should keep
  working.
- Use Content Office for normal changes.
- Use a branch and Pull Request for React/CSS changes.
- Test `npm run build` before merging code changes.

## Database permissions

Anonymous visitors can execute only `get_published_content()`.

Editors can:

- Read the private draft
- Save a draft
- Publish
- Read and restore history
- Upload public images

Administrators can also list users and change roles.

## Large code changes

1. Create a branch.
2. Run the site locally.
3. Check desktop and mobile.
4. Run `npm run build`.
5. Open a Pull Request.
6. Merge only after review.
7. Confirm GitHub Actions completed.

For content-only edits, use the maintenance UI. Keep the public record editable
without requiring a code deployment.
