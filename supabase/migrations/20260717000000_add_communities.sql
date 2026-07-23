-- Create communities table
create table communities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_by uuid references users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community_subcategories table
create table community_subcategories (
  id uuid primary key default uuid_generate_v4(),
  community_id uuid references communities(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_communities table
create table user_communities (
  user_id uuid references users(id) on delete cascade not null,
  community_id uuid references communities(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, community_id)
);

-- RLS setup (Row Level Security)
alter table communities enable row level security;
alter table community_subcategories enable row level security;
alter table user_communities enable row level security;

-- Policies for communities
create policy "Users can view all communities"
  on communities for select
  using (auth.role() = 'authenticated');

create policy "Users can insert communities"
  on communities for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update own communities"
  on communities for update
  using (auth.uid() = created_by);

-- Policies for community_subcategories
create policy "Users can view all community subcategories"
  on community_subcategories for select
  using (auth.role() = 'authenticated');

create policy "Users can insert community subcategories"
  on community_subcategories for insert
  with check (auth.role() = 'authenticated');

-- Policies for user_communities
create policy "Users can view all user communities"
  on user_communities for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own user communities"
  on user_communities for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own user communities"
  on user_communities for delete
  using (auth.uid() = user_id);

-- Insert seed data
insert into communities (name, description) values
  ('Peer Tutoring & Academic Support', 'Students teaching students — structured drop-in help for tough courses, exam prep, and study groups.'),
  ('Industry & Career Mentorship', 'Alumni and industry pros host workshops, mock interviews, resume reviews, and networking nights.'),
  ('Entrepreneurship & Innovation', 'A space for startup ideas, hackathons, pitch competitions, and side projects.'),
  ('Mental Health & Peer Support', 'Trained student listeners, stress-management workshops, meditation groups, and a stigma-free space to talk.'),
  ('Tech & Coding', 'Workshops, open-source contributions, project showcases, and competitive programming.'),
  ('Debate, Public Speaking & MUN', 'Builds critical thinking, articulation, and confidence.'),
  ('Community Service & Social Impact', 'Regular volunteering, fundraising, and local NGO partnerships.'),
  ('Creative Arts & Media', 'Writers, filmmakers, podcasters, designers, and photographers.'),
  ('Sports & Fitness', 'Intramural leagues, running clubs, yoga sessions, and fitness challenges.'),
  ('Research & Publication', 'Undergrad research groups, journal clubs, and conference-prep squads.'),
  ('Cultural & Diversity', 'Celebrates different backgrounds, languages, festivals, and cuisines.'),
  ('Alumni-Student Connect', 'Structured mentorship, guest lectures, internship referrals, and annual meetups.');
