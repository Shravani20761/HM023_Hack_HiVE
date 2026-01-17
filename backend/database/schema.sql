-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appwrite_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Seed roles (only if they don't exist)
INSERT INTO roles (name, description) 
VALUES 
  ('creator', 'Can create and edit content'),
  ('editor', 'Can edit content'),
  ('marketer', 'Can approve and publish content'),
  ('manager', 'Can view analytics and feedback'),
  ('admin', 'Full access to campaign')
ON CONFLICT (name) DO NOTHING;

-- 3. campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  objective TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. campaign_members
CREATE TABLE IF NOT EXISTS campaign_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE (campaign_id, user_id, role_id)
);

-- 5. system_roles
CREATE TABLE IF NOT EXISTS system_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed system roles
INSERT INTO system_roles (name, description) VALUES
('super_admin', 'Full system control'),
('org_admin', 'Can create and manage campaigns'),
('member', 'Cannot create campaigns')
ON CONFLICT (name) DO NOTHING;

-- 6. user_system_roles
CREATE TABLE IF NOT EXISTS user_system_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  system_role_id UUID REFERENCES system_roles(id) ON DELETE CASCADE,
  UNIQUE (user_id, system_role_id)
);
