-- Conversations for Direct Messages
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  user_a_id uuid references users(id) on delete cascade not null,
  user_b_id uuid references users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure user_a_id < user_b_id to prevent duplicate conversations
  constraint unique_conversation unique(user_a_id, user_b_id),
  constraint user_a_less_than_user_b check (user_a_id < user_b_id)
);

-- Direct Messages
create table direct_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references users(id) on delete cascade not null,
  content text not null,
  parent_id uuid references direct_messages(id) on delete cascade,
  is_edited boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Triggers for updated_at
create trigger set_conversations_updated_at
  before update on conversations
  for each row execute procedure handle_updated_at();

create trigger set_direct_messages_updated_at
  before update on direct_messages
  for each row execute procedure handle_updated_at();

-- RLS setup
alter table conversations enable row level security;
alter table direct_messages enable row level security;

-- Very permissive RLS for initial development
create policy "Users can read conversations" on conversations for select using (true);
create policy "Users can read direct messages" on direct_messages for select using (true);

create policy "Authenticated users can insert conversations" on conversations for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can insert direct messages" on direct_messages for insert with check (auth.role() = 'authenticated');
