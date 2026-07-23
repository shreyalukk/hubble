-- 1. Create a storage bucket for chat attachments
insert into storage.buckets (id, name, public) 
values ('chat_attachments', 'chat_attachments', true)
on conflict (id) do nothing;

-- 2. Allow authenticated users to upload files
create policy "Authenticated users can upload attachments"
on storage.objects for insert
with check (
  bucket_id = 'chat_attachments' and 
  auth.role() = 'authenticated'
);

-- 3. Allow public reading of attachments
create policy "Anyone can view attachments"
on storage.objects for select
using (bucket_id = 'chat_attachments');

-- 4. Allow users to delete their own uploads
create policy "Users can delete own attachments"
on storage.objects for delete
using (
  bucket_id = 'chat_attachments' and 
  auth.uid() = owner
);
