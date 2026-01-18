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

-- Update campaigns table with missing columns
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;

-- 7. content - Main content items with workflow states
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  content_type TEXT DEFAULT 'post', -- 'post', 'video', 'story', 'email', 'ad'
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published', 'archived'
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  published_at TIMESTAMP
);

-- 8. content_versions - Version history tracking
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (content_id, version_number)
);

-- 9. content_comments - Internal feedback on content
CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. assets - ImageKit media files
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  imagekit_file_id TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT, -- 'image', 'video', 'document'
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 11. content_assets - Link assets to content
CREATE TABLE IF NOT EXISTS content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0,
  UNIQUE (content_id, asset_id)
);

-- 12. schedules - Publishing schedule for channels
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL, -- 'instagram', 'facebook', 'youtube', 'email'
  scheduled_time TIMESTAMP NOT NULL,
  published_at TIMESTAMP,
  status TEXT DEFAULT 'pending', -- 'pending', 'published', 'failed'
  error_message TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 13. feedback - Social media comments/email replies
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'instagram', 'facebook', 'youtube', 'email'
  author_name TEXT,
  author_id TEXT,
  message TEXT NOT NULL,
  sentiment TEXT, -- 'positive', 'neutral', 'negative'
  status TEXT DEFAULT 'unread', -- 'unread', 'read', 'replied', 'archived'
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 14. analytics - Performance metrics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  channel TEXT,
  metric_type TEXT NOT NULL, -- 'views', 'likes', 'comments', 'shares', 'reach', 'engagement'
  metric_value INTEGER DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT NOW(),
  date TIMESTAMP NOT NULL
);

-- 15. notifications - User notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'content_submitted', 'content_approved', 'feedback_received', 'schedule_published'
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 16. ai_usage - AI feature usage tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'script_writer', 'caption_helper', 'sentiment_analysis'
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_campaign ON content(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_created_by ON content(created_by);
CREATE INDEX IF NOT EXISTS idx_content_versions_content ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_content ON content_comments(content_id);
CREATE INDEX IF NOT EXISTS idx_assets_campaign ON assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_content ON content_assets(content_id);
CREATE INDEX IF NOT EXISTS idx_schedules_content ON schedules(content_id);
CREATE INDEX IF NOT EXISTS idx_schedules_campaign ON schedules(campaign_id);
CREATE INDEX IF NOT EXISTS idx_feedback_campaign ON feedback(campaign_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_analytics_content ON analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign ON analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_campaign ON ai_usage(campaign_id);
