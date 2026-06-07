-- =============================================
-- NA Mini-App — Seed Data
-- Run AFTER schema.sql
-- Passwords are bcrypt hash of 'password123'
-- =============================================

-- =====================
-- BRANCHES
-- =====================
insert into branches (id, name, location) values
  ('b1000000-0000-0000-0000-000000000001', 'Cabang Jakarta Selatan', 'Jl. Fatmawati No. 10, Jakarta Selatan'),
  ('b1000000-0000-0000-0000-000000000002', 'Cabang Serpong BSD', 'Ruko BSD City Blok A No. 5, Tangerang Selatan'),
  ('b1000000-0000-0000-0000-000000000003', 'Cabang Depok', 'Jl. Margonda Raya No. 88, Depok');

-- =====================
-- USERS (NA)
-- password: password123
-- =====================
insert into users (id, name, email, password_hash, role) values
  (
    'u1000000-0000-0000-0000-000000000001',
    'Andi Pratama',
    'andi@na-petcare.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN6AjFkqK2m',
    'na'
  ),
  (
    'u1000000-0000-0000-0000-000000000002',
    'Siti Rahayu',
    'siti@na-petcare.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN6AjFkqK2m',
    'na'
  );

-- =====================
-- USER-BRANCH MAPPING
-- =====================
insert into user_branches (user_id, branch_id) values
  -- Andi di Jaksel & Serpong
  ('u1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001'),
  ('u1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002'),
  -- Siti di Serpong & Depok
  ('u1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002'),
  ('u1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003');

-- =====================
-- PRODUCTS (Royal Canin, Hills, Purina)
-- =====================
insert into products (sku, name, category, base_price) values
  -- Royal Canin Kucing
  ('RC-RENAL-2KG',     'Royal Canin Renal 2kg',              'Royal Canin - Kucing', 425000),
  ('RC-KITTEN-2KG',    'Royal Canin Kitten 2kg',              'Royal Canin - Kucing', 235000),
  ('RC-PERSIAN-2KG',   'Royal Canin Persian Adult 2kg',       'Royal Canin - Kucing', 260000),
  ('RC-STERIL-3.5KG',  'Royal Canin Sterilised 3.5kg',        'Royal Canin - Kucing', 310000),
  ('RC-SENS-4KG',      'Royal Canin Sensible 33 4kg',         'Royal Canin - Kucing', 390000),
  -- Royal Canin Anjing
  ('RC-MINI-ADULT-2KG','Royal Canin Mini Adult 2kg',          'Royal Canin - Anjing', 195000),
  ('RC-MEDIUM-4KG',    'Royal Canin Medium Adult 4kg',        'Royal Canin - Anjing', 340000),
  ('RC-GI-2KG',        'Royal Canin Gastrointestinal 2kg',    'Royal Canin - Anjing', 445000),
  -- Hills Science Diet Kucing
  ('HS-CAT-ADULT-1.6', 'Hills Science Diet Adult Cat 1.6kg',  'Hills - Kucing',       280000),
  ('HS-CAT-SENIOR-1.6','Hills Science Diet Senior Cat 1.6kg', 'Hills - Kucing',       295000),
  -- Hills Science Diet Anjing
  ('HS-DOG-SMALL-1.5', 'Hills Science Diet Small Dog 1.5kg',  'Hills - Anjing',       265000),
  ('HS-DOG-LARGE-3KG', 'Hills Science Diet Large Dog 3kg',    'Hills - Anjing',       390000),
  -- Purina Pro Plan
  ('PP-CAT-CHICKEN-3', 'Purina Pro Plan Cat Chicken 3kg',     'Purina - Kucing',      310000),
  ('PP-DOG-ADULT-3KG', 'Purina Pro Plan Dog Adult 3kg',       'Purina - Anjing',      295000),
  ('PP-PUPPY-3KG',     'Purina Pro Plan Puppy 3kg',           'Purina - Anjing',      280000);

-- =====================
-- KPI TARGET (sample bulan ini)
-- =====================
insert into kpi_targets (advisor_id, month, edu_target, sales_target) values
  ('u1000000-0000-0000-0000-000000000001', '2026-06', 30, 5000000),
  ('u1000000-0000-0000-0000-000000000002', '2026-06', 25, 4000000);
