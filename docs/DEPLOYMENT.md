# Li Research Group deployment

## 1. Create Supabase

1. Create a project at <https://supabase.com>.
2. Store the database password in a password manager.
3. Open **SQL Editor**, paste all of `supabase/schema.sql`, and run it.
4. Open **Project Settings → API** and record:
   - Project URL
   - anon / publishable key

Never put the `service_role` key in this website.

## 2. Create the first administrator

Run the database script before creating users.

1. Open **Authentication → Users**.
2. Add the teacher account with an email and strong password.
3. The first account becomes `admin`.
4. Additional users are created as `viewer`.
5. An administrator signs into Content Office and assigns `editor` or `admin`
   under **Access**.

If a user existed before the script was run, create the missing profile:

```sql
insert into public.profiles (id, email, display_name, role)
select id, coalesce(email, ''), split_part(coalesce(email, 'member'), '@', 1), 'admin'
from auth.users
where email = 'stuart.li@utah.edu'
on conflict (id) do update set role = 'admin';
```

## 3. Connect locally

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Restart the development server:

```powershell
npm run dev
```

The demo-mode notice should disappear. Sign in with the teacher account.

## 4. Publish first content

The SQL seed intentionally contains only the schema version. The frontend safely
merges it with `src/data/site.js`, so the current Li Group content is visible
immediately.

1. Sign into `/#/admin`.
2. Open **Preview** and check the complete website.
3. Click **Publish**.
4. Confirm that the public page and the publication history both work.

This first publish stores a complete content document in Supabase. Future edits
are made without changing React source.

## 5. GitHub Pages

Add repository secrets under:

```text
Settings → Secrets and variables → Actions
```

| Secret | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

Then:

1. Open **Settings → Pages**.
2. Set Source to **GitHub Actions**.
3. Push to `main`.
4. Open **Actions** and wait for `Deploy to GitHub Pages`.
5. Test the public URL and `/#/admin` in an incognito window.

## 6. Image storage

The SQL script creates a public `site-media` bucket with:

- 10 MB maximum file size
- JPG, PNG, WebP and GIF support
- Public read access
- Staff-only upload, replace and delete

Use the Content Office image controls. This creates stable Supabase URLs instead
of depending on local asset filenames.

## 7. Security checklist

- Disable public sign-up after accounts have been invited.
- Keep at least two people with administrator access.
- Do not paste the database password into code or GitHub secrets.
- Confirm anonymous requests cannot call `get_maintenance_content()`.
- Check that `service_role` does not appear anywhere in the repository.

## 8. Troubleshooting

### User can sign in but cannot edit

Open **Access** as an administrator and assign `editor`. New accounts start as
`viewer`.

### GitHub Actions says credentials are missing

Both values must be **Repository secrets**, with the exact names
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Upload fails

Run the full `supabase/schema.sql` again and confirm the `site-media` bucket
exists. Check the user is an editor or administrator.

### Website still shows old data

Use an incognito window first. Confirm the latest publication is visible in
Content Office → Versions and that the GitHub Actions deployment completed.
