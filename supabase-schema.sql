-- ============================================================
-- Supabase SQL 스키마 — Supabase 대시보드 SQL 에디터에서 실행
-- ============================================================

-- 1. Profile 테이블 (단일 행)
create table public.profile (
  id                uuid primary key default gen_random_uuid(),
  name              text not null default '이름',
  tagline           text,
  school            text,
  age               integer,
  bio               text,
  interests         text[] default '{}',
  profile_image_url text,
  updated_at        timestamptz default now()
);

-- 2. Skills 테이블
create table public.skills (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  icon          text default '⚡',
  level         integer default 3 check (level between 1 and 5),
  category      text default '',
  color         text default '#7c3aed',
  display_order integer default 0,
  created_at    timestamptz default now()
);

-- 3. Projects 테이블
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  thumbnail_url text,
  display_order integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profile  enable row level security;
alter table public.skills   enable row level security;
alter table public.projects enable row level security;

-- Profile: 퍼블릭 읽기, 인증된 사용자 쓰기
create policy "Public read profile"  on public.profile  for select using (true);
create policy "Auth write profile"   on public.profile  for insert to authenticated with check (true);
create policy "Auth update profile"  on public.profile  for update to authenticated using (true);

-- Skills: 퍼블릭 읽기, 인증된 사용자 CRUD
create policy "Public read skills"   on public.skills   for select using (true);
create policy "Auth insert skills"   on public.skills   for insert to authenticated with check (true);
create policy "Auth update skills"   on public.skills   for update to authenticated using (true);
create policy "Auth delete skills"   on public.skills   for delete to authenticated using (true);

-- Projects: 퍼블릭 읽기, 인증된 사용자 CRUD
create policy "Public read projects" on public.projects for select using (true);
create policy "Auth insert projects" on public.projects for insert to authenticated with check (true);
create policy "Auth update projects" on public.projects for update to authenticated using (true);
create policy "Auth delete projects" on public.projects for delete to authenticated using (true);

-- ============================================================
-- Storage 버킷 설정
-- ============================================================
-- Supabase 대시보드 > Storage > New Bucket 에서:
--   버킷명: portfolio-images
--   Public 체크
--
-- 또는 아래 SQL 실행:

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Auth upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

create policy "Auth delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images');

create policy "Auth update images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images');

-- ============================================================
-- 어드민 계정 생성
-- ============================================================
-- Supabase 대시보드 > Authentication > Users > Add user 에서
-- 이메일과 비밀번호를 직접 생성하세요.
-- (회원가입은 비활성화 상태로 두면 됩니다)
