create extension if not exists vector;

create table if not exists medical_knowledge (
  id uuid primary key default gen_random_uuid(),
  title_cn text not null,
  title_en text not null,
  content_cn text not null,
  content_en text not null,
  type text not null,
  source text,
  embedding vector(1536),
  created_at timestamptz default now()
);

create table if not exists graph_nodes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null,
  name_cn text not null,
  name_en text not null,
  embedding vector(1536)
);

create table if not exists graph_edges (
  id uuid primary key default gen_random_uuid(),
  from_id uuid references graph_nodes(id) on delete cascade,
  to_id uuid references graph_nodes(id) on delete cascade,
  relation text not null
);

create table if not exists clinic_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null,
  role text not null check (role in ('doctor', 'student', 'admin')),
  created_at timestamptz default now()
);

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  sex text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists outpatient_visits (
  id uuid primary key default gen_random_uuid(),
  visit_no text unique not null,
  patient_id uuid references patients(id) on delete set null,
  department text not null,
  doctor_name text not null,
  chief_complaint text,
  status text not null default 'waiting',
  risk_level text not null default 'moderate',
  created_at timestamptz default now()
);

create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references outpatient_visits(id) on delete set null,
  symptoms jsonb not null default '[]'::jsonb,
  tongue_sign text,
  pulse_sign text,
  tcm_diagnosis text,
  western_diagnosis text,
  formula text,
  confidence numeric,
  graph_path jsonb not null default '[]'::jsonb,
  created_by uuid references clinic_users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references clinic_users(id) on delete set null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function match_medical_knowledge(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title_cn text,
  title_en text,
  content_cn text,
  content_en text,
  similarity float
)
language sql stable
as $$
  select
    medical_knowledge.id,
    medical_knowledge.title_cn,
    medical_knowledge.title_en,
    medical_knowledge.content_cn,
    medical_knowledge.content_en,
    1 - (medical_knowledge.embedding <=> query_embedding) as similarity
  from medical_knowledge
  where medical_knowledge.embedding is not null
  order by medical_knowledge.embedding <=> query_embedding
  limit match_count;
$$;
