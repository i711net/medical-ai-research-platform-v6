-- Visual admin database management policies for the browser-based admin console.
-- Run after sql/app_accounts_and_knowledge.sql.
--
-- This project uses its own app_login administrator account, not Supabase Auth.
-- Therefore the browser admin console needs public anon/authenticated access to
-- the knowledge tables. The web UI still checks the app admin login before
-- showing the editor.

grant usage on schema public to anon, authenticated;

alter table learning_resources enable row level security;
alter table diagnostic_terms enable row level security;
alter table formulas enable row level security;
alter table herbs enable row level security;

drop policy if exists "visual admin read learning resources" on learning_resources;
drop policy if exists "visual admin insert learning resources" on learning_resources;
drop policy if exists "visual admin update learning resources" on learning_resources;
drop policy if exists "visual admin read diagnostic terms" on diagnostic_terms;
drop policy if exists "visual admin insert diagnostic terms" on diagnostic_terms;
drop policy if exists "visual admin update diagnostic terms" on diagnostic_terms;
drop policy if exists "visual admin read formulas" on formulas;
drop policy if exists "visual admin insert formulas" on formulas;
drop policy if exists "visual admin update formulas" on formulas;
drop policy if exists "visual admin read herbs" on herbs;
drop policy if exists "visual admin insert herbs" on herbs;
drop policy if exists "visual admin update herbs" on herbs;

create policy "visual admin read learning resources"
on learning_resources for select
to anon, authenticated
using (true);

create policy "visual admin insert learning resources"
on learning_resources for insert
to anon, authenticated
with check (true);

create policy "visual admin update learning resources"
on learning_resources for update
to anon, authenticated
using (true)
with check (true);

create policy "visual admin read diagnostic terms"
on diagnostic_terms for select
to anon, authenticated
using (true);

create policy "visual admin insert diagnostic terms"
on diagnostic_terms for insert
to anon, authenticated
with check (true);

create policy "visual admin update diagnostic terms"
on diagnostic_terms for update
to anon, authenticated
using (true)
with check (true);

create policy "visual admin read formulas"
on formulas for select
to anon, authenticated
using (true);

create policy "visual admin insert formulas"
on formulas for insert
to anon, authenticated
with check (true);

create policy "visual admin update formulas"
on formulas for update
to anon, authenticated
using (true)
with check (true);

create policy "visual admin read herbs"
on herbs for select
to anon, authenticated
using (true);

create policy "visual admin insert herbs"
on herbs for insert
to anon, authenticated
with check (true);

create policy "visual admin update herbs"
on herbs for update
to anon, authenticated
using (true)
with check (true);

grant select, insert, update on learning_resources to anon, authenticated;
grant select, insert, update on diagnostic_terms to anon, authenticated;
grant select, insert, update on formulas to anon, authenticated;
grant select, insert, update on herbs to anon, authenticated;

-- Read-only safe columns for the personnel list. Password hashes are not granted.
grant select (id, login_name, display_name, role, expires_at, is_active, created_at)
on app_users to anon, authenticated;

grant select on outpatient_visits to anon, authenticated;
grant select on medical_records to anon, authenticated;
grant select on admin_audit_logs to anon, authenticated;
