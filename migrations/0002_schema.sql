create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  is_anonymous boolean not null default false,
  message text not null default '',
  time_in_recovery text not null default '',
  substances text not null default '[]',
  milestone_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stories (
  id text primary key,
  user_id text not null,
  author_name text not null,
  is_anonymous boolean not null default false,
  title text not null,
  body text not null,
  medium text not null default 'text',
  tags text not null default '[]',
  recovery_time text not null default '',
  theme text not null default '',
  spark_votes integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists stories_created_idx on stories (created_at desc);
create index if not exists stories_theme_idx on stories (theme);
create index if not exists stories_user_idx on stories (user_id);

create table if not exists story_votes (
  story_id text not null,
  user_id text not null,
  primary key (story_id, user_id)
);

create table if not exists sparks (
  id text primary key,
  user_id text,
  body text not null,
  author_name text not null,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists tributes (
  id text primary key,
  user_id text not null,
  honoree_name text not null,
  relationship text not null default '',
  body text not null,
  years text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists circles (
  id text primary key,
  name text not null,
  stage text not null,
  focus text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists circle_members (
  circle_id text not null,
  user_id text not null,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

create table if not exists circle_posts (
  id text primary key,
  circle_id text not null,
  user_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists circle_posts_idx on circle_posts (circle_id, created_at desc);

create table if not exists circle_checkins (
  id text primary key,
  circle_id text not null,
  user_id text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists milestones (
  id text primary key,
  user_id text not null,
  label text not null,
  occurred_on date not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists milestones_user_idx on milestones (user_id, occurred_on);

create table if not exists recovery_starts (
  user_id text primary key,
  started_on date not null,
  updated_at timestamptz not null default now()
);

create table if not exists urge_logs (
  id text primary key,
  user_id text not null,
  intensity integer not null,
  trigger text not null default '',
  technique text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists urge_logs_user_idx on urge_logs (user_id, created_at desc);

create table if not exists reports (
  id text primary key,
  user_id text not null,
  target_type text not null,
  target_id text not null,
  reason text not null,
  created_at timestamptz not null default now()
);
