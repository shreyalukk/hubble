-- Enable realtime replication for messaging tables
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table direct_messages;
