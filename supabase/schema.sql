-- Li Research Group content platform
-- Run this file once in Supabase Dashboard > SQL Editor.
-- Then create the first account under Authentication > Users.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  display_name text not null default '',
  role text not null default 'viewer'
    check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_staff(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$;

revoke all on function public.is_staff(uuid) from public;
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_staff(uuid) to authenticated;
grant execute on function public.is_admin(uuid) to authenticated;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

-- Direct profile updates are intentionally blocked. Roles change through RPC.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text;
begin
  select case
    when not exists (select 1 from public.profiles where role = 'admin')
      then 'admin'
    else 'viewer'
  end
  into assigned_role;

  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(coalesce(new.email, 'member'), '@', 1)
    ),
    assigned_role
  )
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  draft jsonb not null,
  published jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  published_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  note text not null default 'Published update',
  published_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  content jsonb not null
);

alter table public.content_versions enable row level security;
revoke all on public.content_versions from anon, authenticated;

-- Public site: returns only the published document.
create or replace function public.get_published_content()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select published
  from public.site_content
  where id = 'main';
$$;

revoke all on function public.get_published_content() from public;
grant execute on function public.get_published_content() to anon, authenticated;

-- Drafts are never directly readable through PostgREST.
create or replace function public.get_maintenance_content()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'Maintenance access denied' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'draft', draft,
    'published', published,
    'updatedAt', updated_at,
    'publishedAt', published_at
  )
  into result
  from public.site_content
  where id = 'main';

  return result;
end;
$$;

revoke all on function public.get_maintenance_content() from public;
grant execute on function public.get_maintenance_content() to authenticated;

create or replace function public.save_draft(p_content jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_at timestamptz;
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'Maintenance access denied' using errcode = '42501';
  end if;

  if jsonb_typeof(p_content) <> 'object'
    or p_content ->> 'schemaVersion' <> '1' then
    raise exception 'Invalid Li Group content document';
  end if;

  update public.site_content
  set
    draft = p_content,
    updated_by = auth.uid(),
    updated_at = now()
  where id = 'main'
  returning updated_at into saved_at;

  if saved_at is null then
    raise exception 'Li Group content row not found';
  end if;

  return saved_at;
end;
$$;

revoke all on function public.save_draft(jsonb) from public;
grant execute on function public.save_draft(jsonb) to authenticated;

create or replace function public.publish_content(p_note text default null)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  content_to_publish jsonb;
  published_time timestamptz;
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'Maintenance access denied' using errcode = '42501';
  end if;

  select draft into content_to_publish
  from public.site_content
  where id = 'main'
  for update;

  if content_to_publish is null then
    raise exception 'Draft content not found';
  end if;

  update public.site_content
  set
    published = content_to_publish,
    published_by = auth.uid(),
    published_at = now(),
    updated_at = now()
  where id = 'main'
  returning published_at into published_time;

  insert into public.content_versions (note, published_by, content)
  values (
    coalesce(nullif(trim(p_note), ''), 'Published update'),
    auth.uid(),
    content_to_publish
  );

  delete from public.content_versions
  where id in (
    select id
    from public.content_versions
    order by created_at desc
    offset 30
  );

  return published_time;
end;
$$;

revoke all on function public.publish_content(text) from public;
grant execute on function public.publish_content(text) to authenticated;

create or replace function public.list_content_versions()
returns table (
  id uuid,
  note text,
  published_by uuid,
  published_by_name text,
  created_at timestamptz,
  content jsonb
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'Maintenance access denied' using errcode = '42501';
  end if;

  return query
  select
    version.id,
    version.note,
    version.published_by,
    coalesce(profile.display_name, 'Group editor'),
    version.created_at,
    version.content
  from public.content_versions version
  left join public.profiles profile on profile.id = version.published_by
  order by version.created_at desc;
end;
$$;

revoke all on function public.list_content_versions() from public;
grant execute on function public.list_content_versions() to authenticated;

create or replace function public.restore_content_version(p_version_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  restored_content jsonb;
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'Maintenance access denied' using errcode = '42501';
  end if;

  select content into restored_content
  from public.content_versions
  where id = p_version_id;

  if restored_content is null then
    raise exception 'Version not found';
  end if;

  update public.site_content
  set
    draft = restored_content,
    updated_by = auth.uid(),
    updated_at = now()
  where id = 'main';

  return restored_content;
end;
$$;

revoke all on function public.restore_content_version(uuid) from public;
grant execute on function public.restore_content_version(uuid) to authenticated;

create or replace function public.update_member_role(
  p_profile_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if p_profile_id = auth.uid() then
    raise exception 'You cannot change your own role';
  end if;

  if p_role not in ('admin', 'editor', 'viewer') then
    raise exception 'Invalid role';
  end if;

  update public.profiles
  set role = p_role
  where id = p_profile_id;
end;
$$;

revoke all on function public.update_member_role(uuid, text) from public;
grant execute on function public.update_member_role(uuid, text) to authenticated;

create or replace function public.update_my_profile(p_display_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_name text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  cleaned_name := btrim(coalesce(p_display_name, ''));
  if char_length(cleaned_name) < 2 or char_length(cleaned_name) > 80 then
    raise exception 'Display name must be between 2 and 80 characters';
  end if;

  update public.profiles
  set display_name = cleaned_name
  where id = auth.uid()
  returning display_name into cleaned_name;

  if cleaned_name is null then
    raise exception 'Profile not found';
  end if;

  return cleaned_name;
end;
$$;

revoke all on function public.update_my_profile(text) from public;
grant execute on function public.update_my_profile(text) to authenticated;

-- Public images. Only group editors may upload or remove.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site_media_public_read" on storage.objects;
create policy "site_media_public_read"
on storage.objects
for select
to public
using (bucket_id = 'site-media');

drop policy if exists "site_media_staff_insert" on storage.objects;
create policy "site_media_staff_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_staff(auth.uid()));

drop policy if exists "site_media_staff_update" on storage.objects;
create policy "site_media_staff_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and public.is_staff(auth.uid()))
with check (bucket_id = 'site-media' and public.is_staff(auth.uid()));

drop policy if exists "site_media_staff_delete" on storage.objects;
create policy "site_media_staff_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and public.is_staff(auth.uid()));

-- The client safely merges this document with the source-controlled fallback.
-- The first editor save replaces it with the complete content document.
insert into public.site_content (id, draft, published, published_at)
select
  'main',
  '{"schemaVersion":1}'::jsonb,
  '{"schemaVersion":1}'::jsonb,
  now()
where not exists (select 1 from public.site_content where id = 'main');

insert into public.content_versions (note, content)
select 'Li Research Group initial release', published
from public.site_content
where id = 'main'
  and not exists (select 1 from public.content_versions);
