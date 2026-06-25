-- ══════════════════════════════════════════════════════════════
--  SportOS — Schema Supabase
--  Ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════

-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- ─── CLUBS ────────────────────────────────────────────────────
create table if not exists clubs (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  sport       text not null,           -- rugby | futbol | handball | basketball | hockey
  country     text not null default 'CL',
  plan        text not null default 'starter', -- starter | pro | enterprise
  colors      jsonb default '{"primary":"#1B4332","secondary":"#FFD700"}',
  created_at  timestamptz default now()
);

-- ─── PROFILES (extiende auth.users) ──────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text not null,
  rol         text not null,           -- superadmin | admin | entrenador | preparador | jugador
  club_id     uuid references clubs(id),
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Crear perfil automáticamente al registrarse
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, nombre, rol, club_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', new.email),
    coalesce(new.raw_user_meta_data->>'rol', 'jugador'),
    (new.raw_user_meta_data->>'club_id')::uuid
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── PLAYERS ──────────────────────────────────────────────────
create table if not exists players (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  name        text not null,
  number      int,
  position    text,
  category    text,
  age         int,
  med_status  text default 'verde',   -- verde | amarillo | rojo
  hia_reason  text,
  cuota_status text default 'ok',     -- ok | vencida
  profile_id  uuid references profiles(id),
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Si la tabla ya existe, agregar la columna avatar_url si falta
alter table players add column if not exists avatar_url text;

-- ─── TEAMS (equipos dentro de un club) ───────────────────────
create table if not exists teams (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  name        text not null,
  category    text,
  created_at  timestamptz default now()
);

-- ─── MATCHES ──────────────────────────────────────────────────
create table if not exists matches (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  team_id     uuid references teams(id),
  rival       text not null,
  match_date  date not null,
  location    text,
  result      text,                   -- victoria | derrota | empate | pendiente
  score_home  int,
  score_away  int,
  notes       text,
  created_at  timestamptz default now()
);

-- ─── ATTENDANCE ───────────────────────────────────────────────
create table if not exists attendance (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  date        date not null,
  present     boolean default false,
  notes       text,
  unique (player_id, date)
);

-- ─── GYM LOGS ─────────────────────────────────────────────────
create table if not exists gym_logs (
  id          uuid primary key default uuid_generate_v4(),
  player_id   uuid not null references players(id) on delete cascade,
  exercise    text not null,
  set_index   int not null,
  weight_kg   numeric(6,2),
  reps        int,
  rpe         int,
  one_rm_kg   numeric(6,2) generated always as (weight_kg * (1 + reps::numeric/30)) stored,
  volume_kg   numeric(8,2) generated always as (weight_kg * reps) stored,
  week_start  date,
  logged_at   timestamptz default now(),
  unique (player_id, exercise, set_index, week_start)
);

-- ─── PAYMENTS (cuotas) ────────────────────────────────────────
create table if not exists payments (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  amount      numeric(12,2) not null,
  currency    text default 'CLP',
  method      text,                   -- khipu | webpay | transferencia
  status      text default 'pending', -- pending | paid | failed
  due_date    date,
  paid_at     timestamptz,
  created_at  timestamptz default now()
);

-- ─── POSTS (el Muro) ──────────────────────────────────────────
create table if not exists posts (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  author_id   uuid references profiles(id),
  text        text not null,
  type        text default 'general',  -- general | resultado | medico | admin | advertencia
  created_at  timestamptz default now()
);

create table if not exists post_likes (
  post_id     uuid references posts(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

-- ─── LINEUPS (nóminas) ────────────────────────────────────────
create table if not exists lineups (
  id          uuid primary key default uuid_generate_v4(),
  club_id     uuid not null references clubs(id) on delete cascade,
  team_id     uuid references teams(id),
  formation   text not null,
  slots       jsonb not null default '[]',  -- array de player_ids por posición
  bench       jsonb not null default '[]',  -- array de player_ids en el banco
  updated_at  timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Cada usuario solo ve datos de su propio club
-- ══════════════════════════════════════════════════════════════

alter table clubs      enable row level security;
alter table profiles   enable row level security;
alter table players    enable row level security;
alter table teams      enable row level security;
alter table matches    enable row level security;
alter table attendance enable row level security;
alter table gym_logs   enable row level security;
alter table payments   enable row level security;
alter table posts      enable row level security;
alter table post_likes enable row level security;
alter table lineups    enable row level security;

-- Función auxiliar: obtener club_id del usuario actual
create or replace function my_club_id()
returns uuid language sql stable as $$
  select club_id from profiles where id = auth.uid()
$$;

-- Eliminar políticas si ya existen (para poder re-ejecutar el script)
drop policy if exists "club members see their club"   on clubs;
drop policy if exists "own profile"                   on profiles;
drop policy if exists "club players"                  on players;
drop policy if exists "club teams"                    on teams;
drop policy if exists "club matches"                  on matches;
drop policy if exists "club attendance"               on attendance;
drop policy if exists "own gym logs"                  on gym_logs;
drop policy if exists "club payments"                 on payments;
drop policy if exists "club posts"                    on posts;
drop policy if exists "club post likes"               on post_likes;
drop policy if exists "club lineups"                  on lineups;

-- Políticas: solo ver/editar registros de tu club
create policy "club members see their club"   on clubs      for select using (id = my_club_id());
create policy "own profile"                   on profiles   for all    using (id = auth.uid());
create policy "club players"                  on players    for all    using (club_id = my_club_id());
create policy "club teams"                    on teams      for all    using (club_id = my_club_id());
create policy "club matches"                  on matches    for all    using (club_id = my_club_id());
create policy "club attendance"               on attendance for all    using (club_id = my_club_id());
create policy "own gym logs"                  on gym_logs   for all    using (player_id in (select id from players where club_id = my_club_id()));
create policy "club payments"                 on payments   for all    using (club_id = my_club_id());
create policy "club posts"                    on posts      for all    using (club_id = my_club_id());
create policy "club post likes"               on post_likes for all    using (post_id in (select id from posts where club_id = my_club_id()));
create policy "club lineups"                  on lineups    for all    using (club_id = my_club_id());

-- ══════════════════════════════════════════════════════════════
--  DATOS DE PRUEBA (opcional — borra si no los necesitas)
-- ══════════════════════════════════════════════════════════════

-- insert into clubs (id, name, sport, country, plan) values
--   ('00000000-0000-0000-0000-000000000001', 'Toros RC', 'rugby', 'CL', 'pro');
