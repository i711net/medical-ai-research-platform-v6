alter table patients enable row level security;
alter table outpatient_visits enable row level security;
alter table medical_records enable row level security;
alter table admin_audit_logs enable row level security;
alter table medical_knowledge enable row level security;
alter table graph_nodes enable row level security;
alter table graph_edges enable row level security;

drop policy if exists "public demo read patients" on patients;
drop policy if exists "public demo insert patients" on patients;
drop policy if exists "public demo read visits" on outpatient_visits;
drop policy if exists "public demo insert visits" on outpatient_visits;
drop policy if exists "public demo read records" on medical_records;
drop policy if exists "public demo insert records" on medical_records;
drop policy if exists "public demo read audit logs" on admin_audit_logs;
drop policy if exists "public demo insert audit logs" on admin_audit_logs;
drop policy if exists "public demo read knowledge" on medical_knowledge;
drop policy if exists "public demo read graph nodes" on graph_nodes;
drop policy if exists "public demo read graph edges" on graph_edges;

create policy "public demo read patients"
on patients for select
to anon, authenticated
using (true);

create policy "public demo insert patients"
on patients for insert
to anon, authenticated
with check (true);

create policy "public demo read visits"
on outpatient_visits for select
to anon, authenticated
using (true);

create policy "public demo insert visits"
on outpatient_visits for insert
to anon, authenticated
with check (true);

create policy "public demo read records"
on medical_records for select
to anon, authenticated
using (true);

create policy "public demo insert records"
on medical_records for insert
to anon, authenticated
with check (true);

create policy "public demo read audit logs"
on admin_audit_logs for select
to anon, authenticated
using (true);

create policy "public demo insert audit logs"
on admin_audit_logs for insert
to anon, authenticated
with check (true);

create policy "public demo read knowledge"
on medical_knowledge for select
to anon, authenticated
using (true);

create policy "public demo read graph nodes"
on graph_nodes for select
to anon, authenticated
using (true);

create policy "public demo read graph edges"
on graph_edges for select
to anon, authenticated
using (true);
