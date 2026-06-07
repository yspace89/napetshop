-- =============================================
-- NA Mini-App — Supabase Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =====================
-- USERS & BRANCHES
-- =====================
create table users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique not null,
  password_hash text not null,
  role          text default 'na',
  created_at    timestamptz default now()
);

create table branches (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  location   text,
  created_at timestamptz default now()
);

-- NA bisa bertugas di banyak cabang
create table user_branches (
  user_id   uuid references users(id) on delete cascade,
  branch_id uuid references branches(id) on delete cascade,
  primary key (user_id, branch_id)
);

-- =====================
-- PRODUCTS
-- =====================
create table products (
  id         uuid primary key default gen_random_uuid(),
  sku        text unique not null,
  name       text not null,
  category   text,
  base_price bigint default 0,
  created_at timestamptz default now()
);

-- Override harga per NA per cabang per produk
create table price_overrides (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,
  branch_id    uuid references branches(id) on delete cascade,
  product_id   uuid references products(id) on delete cascade,
  custom_price bigint not null,
  updated_at   timestamptz default now(),
  unique(user_id, branch_id, product_id)
);

-- =====================
-- EDUKASI
-- =====================
create table education_sessions (
  id          uuid primary key default gen_random_uuid(),
  advisor_id  uuid references users(id) on delete cascade,
  branch_id   uuid references branches(id),
  client_name text not null,
  client_wa   text not null,
  pet_type    text not null check (pet_type in ('Kucing', 'Anjing')),
  created_at  timestamptz default now()
);

-- Multiple SKU per sesi edukasi
create table education_items (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid references education_sessions(id) on delete cascade,
  product_id      uuid references products(id),
  purchase_status text default 'pending' check (purchase_status in ('pending', 'purchased')),
  actual_price    bigint,
  updated_at      timestamptz default now()
);

-- =====================
-- KPI TARGET
-- =====================
create table kpi_targets (
  id           uuid primary key default gen_random_uuid(),
  advisor_id   uuid references users(id) on delete cascade,
  month        text not null,  -- format: '2026-06'
  edu_target   int default 0,
  sales_target bigint default 0,
  unique(advisor_id, month)
);

-- =====================
-- RLS POLICIES
-- =====================
alter table users enable row level security;
alter table branches enable row level security;
alter table user_branches enable row level security;
alter table products enable row level security;
alter table price_overrides enable row level security;
alter table education_sessions enable row level security;
alter table education_items enable row level security;
alter table kpi_targets enable row level security;

-- Products & branches: semua bisa read
create policy "Products are viewable by all" on products for select using (true);
create policy "Branches are viewable by all" on branches for select using (true);
