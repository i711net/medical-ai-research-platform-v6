create extension if not exists pgcrypto with schema extensions;

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  login_name text unique not null,
  password_hash text not null,
  display_name text not null,
  role text not null check (role in ('doctor', 'student', 'admin')),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists learning_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'link',
  description text,
  url text,
  content text,
  storage_path text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists diagnostic_terms (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('symptom', 'tongue', 'pulse')),
  parent_slug text,
  slug text unique not null,
  label_cn text not null,
  label_en text,
  description text,
  is_active boolean not null default true,
  sort_order int default 100,
  created_at timestamptz default now()
);

create table if not exists formulas (
  id uuid primary key default gen_random_uuid(),
  name_cn text unique not null,
  name_en text,
  source text,
  composition text,
  dosage text,
  usage text,
  indications text,
  modifications text,
  modern_notes text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists herbs (
  id uuid primary key default gen_random_uuid(),
  name_cn text unique not null,
  name_en text,
  nature_flavor text,
  meridians text,
  functions text,
  dosage text,
  cautions text,
  modern_notes text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create or replace function app_login(
  p_login_name text,
  p_password text
)
returns table (
  id uuid,
  login_name text,
  display_name text,
  role text,
  expires_at timestamptz,
  days_remaining int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  u app_users%rowtype;
begin
  select * into u
  from app_users au
  where au.login_name = p_login_name
    and au.is_active = true;

  if not found or extensions.crypt(p_password, u.password_hash) <> u.password_hash then
    raise exception '用户名或密码错误';
  end if;

  if u.expires_at is not null and u.expires_at < now() then
    raise exception '账号已过期，请联系管理员';
  end if;

  return query
  select
    u.id,
    u.login_name,
    u.display_name,
    u.role,
    u.expires_at,
    case
      when u.expires_at is null then null
      else greatest(0, ceil(extract(epoch from (u.expires_at - now())) / 86400.0)::int)
    end;
end;
$$;

create or replace function admin_create_app_user(
  p_admin_login_name text,
  p_admin_password text,
  p_login_name text,
  p_password text,
  p_display_name text,
  p_role text,
  p_valid_days int
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_user app_users%rowtype;
  new_id uuid;
begin
  select * into admin_user
  from app_users au
  where au.login_name = p_admin_login_name
    and au.is_active = true
    and au.role = 'admin';

  if not found or extensions.crypt(p_admin_password, admin_user.password_hash) <> admin_user.password_hash then
    raise exception '管理员校验失败';
  end if;

  insert into app_users (login_name, password_hash, display_name, role, expires_at)
  values (
    p_login_name,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    p_display_name,
    p_role,
    case when p_valid_days is null then null else now() + make_interval(days => p_valid_days) end
  )
  on conflict (login_name) do update
  set password_hash = excluded.password_hash,
      display_name = excluded.display_name,
      role = excluded.role,
      expires_at = excluded.expires_at,
      is_active = true
  returning id into new_id;

  insert into admin_audit_logs (action, payload)
  values ('admin_create_app_user', jsonb_build_object('login_name', p_login_name, 'role', p_role));

  return new_id;
end;
$$;

create or replace function admin_delete_app_user(
  p_admin_login_name text,
  p_admin_password text,
  p_delete_password text,
  p_login_name text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_user app_users%rowtype;
  stored_hash text;
begin
  select * into admin_user
  from app_users au
  where au.login_name = p_admin_login_name
    and au.is_active = true
    and au.role = 'admin';

  if not found or extensions.crypt(p_admin_password, admin_user.password_hash) <> admin_user.password_hash then
    raise exception '管理员校验失败';
  end if;

  select password_hash into stored_hash
  from admin_delete_passwords
  where id = 1;

  if stored_hash is null or extensions.crypt(p_delete_password, stored_hash) <> stored_hash then
    raise exception '删除专用密码错误';
  end if;

  update app_users
  set is_active = false
  where app_users.login_name = p_login_name
    and app_users.role <> 'admin';

  insert into admin_audit_logs (action, payload)
  values ('admin_delete_app_user', jsonb_build_object('login_name', p_login_name));

  return true;
end;
$$;

grant execute on function app_login(text, text) to anon, authenticated;
grant execute on function admin_create_app_user(text, text, text, text, text, text, int) to anon, authenticated;
grant execute on function admin_delete_app_user(text, text, text, text) to anon, authenticated;

-- 初始化管理员账号：执行前把 admin 和 CHANGE_ADMIN_PASSWORD 改成你自己的。
-- insert into app_users (login_name, password_hash, display_name, role, expires_at)
-- values ('admin', extensions.crypt('CHANGE_ADMIN_PASSWORD', extensions.gen_salt('bf')), '系统管理员', 'admin', null)
-- on conflict (login_name) do update
-- set password_hash = excluded.password_hash,
--     display_name = excluded.display_name,
--     role = 'admin',
--     expires_at = null,
--     is_active = true;

insert into diagnostic_terms (category, parent_slug, slug, label_cn, label_en, description, sort_order) values
  ('symptom', null, 'headache', '头痛', 'Headache', '头部疼痛总类', 10),
  ('symptom', 'headache', 'frontal-headache', '前头痛', 'Frontal headache', '多与阳明经、鼻窦、眼压等鉴别相关', 11),
  ('symptom', 'headache', 'occipital-headache', '后头痛', 'Occipital headache', '多与太阳经、颈项、外感等鉴别相关', 12),
  ('symptom', 'headache', 'temporal-headache', '两侧头痛', 'Temporal headache', '多与少阳经、肝胆、偏头痛鉴别相关', 13),
  ('symptom', 'headache', 'vertex-headache', '巅顶痛', 'Vertex headache', '多与厥阴经、肝风等鉴别相关', 14),
  ('symptom', null, 'fever', '发热', 'Fever', '发热、恶寒、寒热往来等', 20),
  ('symptom', null, 'cough', '咳嗽', 'Cough', '咳嗽、咳痰、喘促等', 30),
  ('symptom', null, 'chest-pain', '胸痛', 'Chest pain', '需优先排查急症', 40),
  ('symptom', null, 'palpitation', '心悸', 'Palpitation', '心悸、怔忡、胸闷', 50),
  ('symptom', null, 'insomnia', '失眠', 'Insomnia', '入睡困难、多梦、早醒', 60),
  ('tongue', null, 'red-tongue', '舌红', 'Red tongue', '多提示热象或阴虚热', 10),
  ('tongue', null, 'pale-tongue', '舌淡', 'Pale tongue', '多提示气血阳虚', 20),
  ('tongue', null, 'purple-tongue', '舌紫', 'Purple tongue', '多提示瘀血或寒凝', 30),
  ('tongue', null, 'greasy-coating', '苔腻', 'Greasy coating', '多提示痰湿、湿热', 40),
  ('pulse', null, 'floating-pulse', '浮脉', 'Floating pulse', '多见表证', 10),
  ('pulse', null, 'deep-pulse', '沉脉', 'Deep pulse', '多见里证', 20),
  ('pulse', null, 'wiry-pulse', '弦脉', 'Wiry pulse', '多见肝胆、疼痛、痰饮', 30),
  ('pulse', null, 'slippery-pulse', '滑脉', 'Slippery pulse', '多见痰湿、食积、妊娠', 40)
on conflict (slug) do update
set label_cn = excluded.label_cn,
    label_en = excluded.label_en,
    description = excluded.description,
    sort_order = excluded.sort_order;

insert into formulas (name_cn, name_en, source, composition, dosage, usage, indications, modifications, modern_notes) values
  ('天麻钩藤饮', 'Gastrodia and Uncaria Decoction', '《杂病证治新义》', '天麻、钩藤、石决明、栀子、黄芩、川牛膝、杜仲、益母草、桑寄生、夜交藤、茯神', '教学资料示例，实际剂量需医师辨证', '水煎服，遵医嘱', '肝阳上亢，头痛眩晕，失眠，舌红，脉弦', '热重加清热药；痰湿重加化痰药；阴虚明显加养阴药', '高血压、头痛眩晕相关研究常见，但不能替代临床诊疗'),
  ('四君子汤', 'Si Jun Zi Tang', '《太平惠民和剂局方》', '人参、白术、茯苓、甘草', '教学资料示例，实际剂量需医师辨证', '水煎服，遵医嘱', '脾胃气虚，面色萎白，气短乏力，舌淡脉虚', '气虚明显可合黄芪；湿重可加陈皮半夏', '常作为补气基础方讨论')
on conflict (name_cn) do update
set name_en = excluded.name_en,
    source = excluded.source,
    composition = excluded.composition,
    dosage = excluded.dosage,
    usage = excluded.usage,
    indications = excluded.indications,
    modifications = excluded.modifications,
    modern_notes = excluded.modern_notes;
