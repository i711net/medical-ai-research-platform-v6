alter table clinic_users
add column if not exists auth_user_id uuid unique references auth.users(id) on delete cascade;
