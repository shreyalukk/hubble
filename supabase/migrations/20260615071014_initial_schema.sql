-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Enum types
create type user_role as enum ('student', 'teacher', 'admin');
create type hub_privacy as enum ('public', 'private', 'passcode_protected', 'student_only', 'teacher_only', 'department_only', 'official');
create type channel_type as enum ('text', 'announcement', 'voice', 'resources');

-- Colleges
create table colleges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text not null unique,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Departments
create table departments (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid references colleges(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users (extends auth.users)
create table users (
  id uuid primary key references auth.users(id) on delete cascade not null,
  full_name text,
  avatar_url text,
  role user_role default 'student'::user_role not null,
  college_id uuid references colleges(id),
  department_id uuid references departments(id),
  year_of_study integer,
  interests text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hubs
create table hubs (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid references colleges(id) on delete cascade not null,
  name text not null,
  description text,
  cover_image text,
  category text,
  privacy hub_privacy default 'public'::hub_privacy not null,
  passcode text,
  department_restriction uuid references departments(id),
  year_restriction integer,
  created_by uuid references users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hub Members
create table hub_members (
  hub_id uuid references hubs(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  role text default 'member' not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (hub_id, user_id)
);

-- Channels
create table channels (
  id uuid primary key default uuid_generate_v4(),
  hub_id uuid references hubs(id) on delete cascade not null,
  name text not null,
  type channel_type default 'text'::channel_type not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages
create table messages (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references channels(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  content text not null,
  parent_id uuid references messages(id) on delete cascade,
  is_pinned boolean default false not null,
  is_edited boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reactions
create table reactions (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references messages(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  emoji text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (message_id, user_id, emoji)
);

-- Events
create table events (
  id uuid primary key default uuid_generate_v4(),
  hub_id uuid references hubs(id) on delete cascade not null,
  created_by uuid references users(id) not null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  location_or_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resources
create table resources (
  id uuid primary key default uuid_generate_v4(),
  hub_id uuid references hubs(id) on delete cascade not null,
  uploaded_by uuid references users(id) not null,
  title text not null,
  file_url text not null,
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assignments
create table assignments (
  id uuid primary key default uuid_generate_v4(),
  hub_id uuid references hubs(id) on delete cascade not null,
  created_by uuid references users(id) not null,
  title text not null,
  description text,
  deadline timestamp with time zone,
  points integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Submissions
create table submissions (
  id uuid primary key default uuid_generate_v4(),
  assignment_id uuid references assignments(id) on delete cascade not null,
  student_id uuid references users(id) on delete cascade not null,
  file_url text,
  graded_points integer,
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(assignment_id, student_id)
);

-- Marketplace
create table marketplace (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid references colleges(id) on delete cascade not null,
  seller_id uuid references users(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric(10, 2),
  category text,
  status text default 'available' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Triggers for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_users_updated_at
  before update on users
  for each row execute procedure handle_updated_at();

create trigger set_messages_updated_at
  before update on messages
  for each row execute procedure handle_updated_at();

-- RLS setup (Row Level Security)
alter table colleges enable row level security;
alter table departments enable row level security;
alter table users enable row level security;
alter table hubs enable row level security;
alter table hub_members enable row level security;
alter table channels enable row level security;
alter table messages enable row level security;

-- Very permissive RLS for initial development
create policy "Public can read colleges" on colleges for select using (true);
create policy "Public can read departments" on departments for select using (true);
create policy "Users can read all profiles" on users for select using (true);
create policy "Users can read hubs" on hubs for select using (true);
create policy "Users can read members" on hub_members for select using (true);
create policy "Users can read channels" on channels for select using (true);
create policy "Users can read messages" on messages for select using (true);

-- Allow inserts if authenticated
create policy "Authenticated users can insert hubs" on hubs for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can insert members" on hub_members for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can insert channels" on channels for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can insert messages" on messages for insert with check (auth.role() = 'authenticated');
