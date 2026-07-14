-- 1. Drop the permissive development policies
DROP POLICY IF EXISTS "Public can read colleges" ON colleges;
DROP POLICY IF EXISTS "Public can read departments" ON departments;
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can read hubs" ON hubs;
DROP POLICY IF EXISTS "Users can read members" ON hub_members;
DROP POLICY IF EXISTS "Users can read channels" ON channels;
DROP POLICY IF EXISTS "Users can read messages" ON messages;
DROP POLICY IF EXISTS "Users can read conversations" ON conversations;
DROP POLICY IF EXISTS "Users can read direct messages" ON direct_messages;

DROP POLICY IF EXISTS "Authenticated users can insert hubs" ON hubs;
DROP POLICY IF EXISTS "Authenticated users can insert members" ON hub_members;
DROP POLICY IF EXISTS "Authenticated users can insert channels" ON channels;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can insert direct messages" ON direct_messages;

-- 2. Add Strict Policies for Profiles & Hubs

-- USERS
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- HUBS
CREATE POLICY "Users can view all hubs"
  ON hubs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own hubs"
  ON hubs FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own hubs"
  ON hubs FOR UPDATE
  USING (auth.uid() = created_by);

-- HUB MEMBERS
CREATE POLICY "Users can view hub members"
  ON hub_members FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join hubs"
  ON hub_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave hubs"
  ON hub_members FOR DELETE
  USING (auth.uid() = user_id);


-- 3. Add Strict Policies for Messages & Channels

-- CHANNELS
CREATE POLICY "Hub members can view channels"
  ON channels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hub_members 
      WHERE hub_members.hub_id = channels.hub_id 
      AND hub_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Hub creators can insert channels"
  ON channels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hubs
      WHERE hubs.id = channels.hub_id
      AND hubs.created_by = auth.uid()
    )
  );

-- MESSAGES
CREATE POLICY "Hub members can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM channels
      JOIN hub_members ON hub_members.hub_id = channels.hub_id
      WHERE channels.id = messages.channel_id
      AND hub_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Hub members can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM channels
      JOIN hub_members ON hub_members.hub_id = channels.hub_id
      WHERE channels.id = channel_id
      AND hub_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);


-- 4. Add Strict Policies for Direct Messages

-- CONVERSATIONS
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can start conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- DIRECT MESSAGES
CREATE POLICY "Users can view own direct messages"
  ON direct_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = direct_messages.conversation_id
      AND (conversations.user_a_id = auth.uid() OR conversations.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own direct messages"
  ON direct_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.user_a_id = auth.uid() OR conversations.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own direct messages"
  ON direct_messages FOR UPDATE
  USING (auth.uid() = sender_id);
