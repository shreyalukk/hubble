-- Create event_attendees table to track users joining events
CREATE TABLE IF NOT EXISTS event_attendees (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (event_id, user_id)
);

-- Enable RLS
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Policies for event_attendees
DROP POLICY IF EXISTS "Authenticated users can view event attendees" ON event_attendees;
CREATE POLICY "Authenticated users can view event attendees"
  ON event_attendees FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can join events" ON event_attendees;
CREATE POLICY "Users can join events"
  ON event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave events" ON event_attendees;
CREATE POLICY "Users can leave events"
  ON event_attendees FOR DELETE
  USING (auth.uid() = user_id);
