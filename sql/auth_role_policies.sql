alter table clinic_users enable row level security;
alter table patients enable row level security;
alter table outpatient_visits enable row level security;
alter table medical_records enable row level security;
alter table admin_audit_logs enable row level security;

drop policy if exists "users can read own profile" on clinic_users;
drop policy if exists "users can create own profile" on clinic_users;
drop policy if exists "admins can read all profiles" on clinic_users;

create policy "users can read own profile"
on clinic_users for select
to authenticated
using (auth_user_id = auth.uid());

create policy "admins can read all profiles"
on clinic_users for select
to authenticated
using (
  exists (
    select 1
    from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  )
);

drop policy if exists "authenticated read patients" on patients;
drop policy if exists "doctors admins insert patients" on patients;
drop policy if exists "authenticated read visits" on outpatient_visits;
drop policy if exists "doctors admins insert visits" on outpatient_visits;
drop policy if exists "doctors admins update visits" on outpatient_visits;
drop policy if exists "authenticated read records" on medical_records;
drop policy if exists "doctors admins insert records" on medical_records;
drop policy if exists "doctors admins update records" on medical_records;
drop policy if exists "admins read audit logs" on admin_audit_logs;
drop policy if exists "authenticated insert audit logs" on admin_audit_logs;

create policy "authenticated read patients"
on patients for select
to authenticated
using (true);

create policy "doctors admins insert patients"
on patients for insert
to authenticated
with check (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
);

create policy "authenticated read visits"
on outpatient_visits for select
to authenticated
using (true);

create policy "doctors admins insert visits"
on outpatient_visits for insert
to authenticated
with check (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
);

create policy "doctors admins update visits"
on outpatient_visits for update
to authenticated
using (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
)
with check (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
);

create policy "authenticated read records"
on medical_records for select
to authenticated
using (true);

create policy "doctors admins insert records"
on medical_records for insert
to authenticated
with check (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
);

create policy "doctors admins update records"
on medical_records for update
to authenticated
using (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
)
with check (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role in ('doctor', 'admin')
  )
);

create policy "admins read audit logs"
on admin_audit_logs for select
to authenticated
using (
  exists (
    select 1 from clinic_users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  )
);

create policy "authenticated insert audit logs"
on admin_audit_logs for insert
to authenticated
with check (true);
