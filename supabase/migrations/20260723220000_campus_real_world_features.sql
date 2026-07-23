-- Enable RLS and policies for Assignments, Submissions, Resources, and Announcements

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Assignments Policies
DROP POLICY IF EXISTS "Authenticated users can view assignments" ON assignments;
CREATE POLICY "Authenticated users can view assignments"
  ON assignments FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Teachers can create assignments" ON assignments;
CREATE POLICY "Teachers can create assignments"
  ON assignments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Submissions Policies
DROP POLICY IF EXISTS "Users can view submissions" ON submissions;
CREATE POLICY "Users can view submissions"
  ON submissions FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Students can submit assignments" ON submissions;
CREATE POLICY "Students can submit assignments"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers can grade submissions" ON submissions;
CREATE POLICY "Teachers can grade submissions"
  ON submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Resources Policies
DROP POLICY IF EXISTS "Authenticated users can view resources" ON resources;
CREATE POLICY "Authenticated users can view resources"
  ON resources FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can upload resources" ON resources;
CREATE POLICY "Users can upload resources"
  ON resources FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' NOT NULL, -- 'exam', 'academic', 'circular', 'placement', 'sports'
  is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
  posted_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view announcements" ON announcements;
CREATE POLICY "Authenticated users can view announcements"
  ON announcements FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Teachers and admins can post announcements" ON announcements;
CREATE POLICY "Teachers and admins can post announcements"
  ON announcements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
