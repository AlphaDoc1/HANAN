-- Add certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  date DATE,
  issuer VARCHAR(255),
  image_url TEXT,
  url TEXT,
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON certifications FOR SELECT USING (is_visible = true);
CREATE POLICY "Admin full access" ON certifications FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
