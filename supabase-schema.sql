-- =============================================
-- PORTFOLIO PLATFORM - DATABASE SCHEMA
-- PostgreSQL / Supabase
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  location VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- e.g., 'Frontend', 'Backend', 'Tools'
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5), -- 1-5 scale
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_order ON skills(order_index);

-- =============================================
-- 3. EXPERIENCE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means current position
  description TEXT,
  achievements TEXT[], -- Array of achievement strings
  technologies TEXT[], -- Array of technologies used
  company_url TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_experience_dates ON experience(start_date DESC, end_date DESC);
CREATE INDEX idx_experience_order ON experience(order_index);

-- =============================================
-- 4. PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tech_stack TEXT[] NOT NULL, -- Array of technologies
  image_url TEXT,
  gallery_urls TEXT[], -- Array of additional images
  demo_url TEXT,
  github_url TEXT,
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT false,
  category VARCHAR(100), -- e.g., 'Web App', 'Mobile', 'API'
  metrics JSONB, -- Store metrics like {users: 1000, performance: "2x faster"}
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_order ON projects(order_index);

-- =============================================
-- 5. EDUCATION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  grade VARCHAR(50), -- GPA or grade
  description TEXT,
  achievements TEXT[],
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_education_dates ON education(start_date DESC, end_date DESC);
CREATE INDEX idx_education_order ON education(order_index);

-- =============================================
-- 6. SOCIAL LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(100) NOT NULL, -- e.g., 'LinkedIn', 'GitHub', 'Twitter'
  url TEXT NOT NULL,
  icon_name VARCHAR(100), -- For icon mapping
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_links_order ON social_links(order_index);

-- =============================================
-- 7. SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- =============================================
-- 8. CONTACT MESSAGES TABLE (Optional - for contact form)
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access" ON social_links FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin full access" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- Public can insert contact messages
CREATE POLICY "Public can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- =============================================
-- SEED DATA (Optional - for initial setup)
-- =============================================

-- Insert default profile
INSERT INTO profile (name, title, bio, email) VALUES (
  'Your Name',
  'Full Stack Developer',
  'Passionate developer with expertise in modern web technologies.',
  'you@example.com'
) ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value, type, description) VALUES
  ('site_title', 'My Portfolio', 'string', 'Website title'),
  ('site_description', 'Personal portfolio showcasing my work and experience', 'string', 'Website meta description'),
  ('theme_color', '#0066FF', 'string', 'Primary theme color'),
  ('sections_order', '["hero","about","skills","experience","projects","education","contact"]', 'json', 'Order of sections on homepage')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- STORAGE BUCKETS (Create via Supabase Dashboard)
-- =============================================
-- Create the following buckets in Supabase Storage:
-- 1. 'profile-images' - for profile photos
-- 2. 'project-images' - for project screenshots
-- 3. 'company-logos' - for company/education logos
-- 4. 'resumes' - for CV/resume files

-- Set appropriate permissions:
-- - Public read access for all image buckets
-- - Authenticated write access for all buckets
