alter table clinic_users
add column if not exists auth_user_id uuid references auth.users(id) on delete cascade;

create unique index if not exists clinic_users_auth_user_id_key
on clinic_users(auth_user_id)
where auth_user_id is not null;
