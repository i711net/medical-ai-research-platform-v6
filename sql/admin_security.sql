create extension if not exists pgcrypto;

create table if not exists invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  display_name text not null,
  email text,
  role text not null check (role in ('doctor', 'student', 'admin')),
  is_used boolean not null default false,
  used_by uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  used_at timestamptz
);

create table if not exists admin_delete_passwords (
  id int primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at timestamptz default now()
);

alter table invitation_codes enable row level security;
alter table admin_delete_passwords enable row level security;

drop policy if exists "admins manage invite codes" on invitation_codes;
drop policy if exists "no direct delete password access" on admin_delete_passwords;

create policy "admins manage invite codes"
on invitation_codes for all
to authenticated
using (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  )
)
with check (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  )
);

create policy "no direct delete password access"
on admin_delete_passwords for select
to authenticated
using (false);

create or replace function redeem_invite_code(
  p_code text,
  p_auth_user_id uuid,
  p_email text,
  p_display_name text
)
returns table (
  id uuid,
  email text,
  display_name text,
  role text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  invite invitation_codes%rowtype;
  profile clinic_users%rowtype;
begin
  if auth.uid() is null or auth.uid() <> p_auth_user_id then
    raise exception 'Unauthorized invite redemption';
  end if;

  select * into invite
  from invitation_codes
  where code = p_code
    and is_used = false
  for update;

  if not found then
    raise exception 'Invalid or used invite code';
  end if;

  if invite.email is not null and lower(invite.email) <> lower(p_email) then
    raise exception 'Invite code is not assigned to this email';
  end if;

  insert into clinic_users (auth_user_id, email, display_name, role)
  values (p_auth_user_id, p_email, coalesce(nullif(p_display_name, ''), invite.display_name), invite.role)
  on conflict (auth_user_id) do update
    set email = excluded.email,
        display_name = excluded.display_name,
        role = excluded.role
  returning * into profile;

  update invitation_codes
  set is_used = true,
      used_by = p_auth_user_id,
      used_at = now()
  where id = invite.id;

  return query
  select profile.id, profile.email, profile.display_name, profile.role;
end;
$$;

create or replace function delete_outpatient_visit_with_password(
  p_visit_id uuid,
  p_delete_password text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  is_admin boolean;
  stored_hash text;
begin
  select exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  ) into is_admin;

  if not is_admin then
    raise exception 'Only administrators can delete records';
  end if;

  select password_hash into stored_hash
  from admin_delete_passwords
  where id = 1;

  if stored_hash is null then
    raise exception 'Deletion password has not been configured';
  end if;

  if crypt(p_delete_password, stored_hash) <> stored_hash then
    raise exception 'Invalid deletion password';
  end if;

  delete from outpatient_visits
  where id = p_visit_id;

  insert into admin_audit_logs (action, payload)
  values ('secure_delete_visit', jsonb_build_object('visit_id', p_visit_id));

  return true;
end;
$$;

grant execute on function redeem_invite_code(text, uuid, text, text) to authenticated;
grant execute on function delete_outpatient_visit_with_password(uuid, text) to authenticated;

-- Run this once and replace CHANGE_THIS_DELETE_PASSWORD with your private deletion password.
-- Do not reuse your Supabase or GitHub password.
--
-- insert into admin_delete_passwords (id, password_hash)
-- values (1, crypt('yb88889999', gen_salt('bf')))
-- on conflict (id) do update
-- set password_hash = excluded.password_hash,
--     updated_at = now();
