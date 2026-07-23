-- Allow users to delete their own direct messages
DROP POLICY IF EXISTS "Users can delete own direct messages" ON direct_messages;

CREATE POLICY "Users can delete own direct messages"
  ON direct_messages FOR DELETE
  USING (auth.uid() = sender_id);
