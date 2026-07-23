-- Enable RLS for Marketplace and Student Projects

ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view marketplace items" ON marketplace;
CREATE POLICY "Authenticated users can view marketplace items"
  ON marketplace FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can list marketplace items" ON marketplace;
CREATE POLICY "Users can list marketplace items"
  ON marketplace FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Student Projects Showcase Table
CREATE TABLE IF NOT EXISTS student_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  demo_url TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view projects" ON student_projects;
CREATE POLICY "Authenticated users can view projects"
  ON student_projects FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Students can post projects" ON student_projects;
CREATE POLICY "Students can post projects"
  ON student_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);
