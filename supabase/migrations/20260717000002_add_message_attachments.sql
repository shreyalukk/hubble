-- Add attachments column to messages (Hub chat)
alter table messages
add column if not exists attachments jsonb default '[]'::jsonb;

-- Add attachments column to direct_messages (DM chat)
alter table direct_messages
add column if not exists attachments jsonb default '[]'::jsonb;
