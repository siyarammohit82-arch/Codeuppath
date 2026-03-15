create table if not exists waitlist (
  id serial primary key,
  email text not null unique,
  created_at timestamp default now()
);

create table if not exists profiles (
  id serial primary key,
  auth_user_id uuid not null unique,
  email text not null unique,
  full_name text not null,
  country text default '',
  college text default '',
  role text default '',
  skills text default '',
  bio text default '',
  resume_link text default '',
  experience text default '',
  projects text default '',
  achievements text default '',
  certifications text default '',
  user_role text not null default 'user',
  is_blocked boolean not null default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists hackathons (
  id serial primary key,
  slug text not null unique,
  name text not null,
  organizer text not null,
  mode text not null,
  location text not null,
  prize integer not null default 0,
  deadline text not null,
  description text not null,
  rules jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  registration_url text not null,
  banner_image text default '',
  tags jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists learning_resources (
  id serial primary key,
  slug text not null unique,
  category text not null,
  name text not null,
  provider text not null,
  duration text not null,
  level text not null default 'Beginner',
  description text not null,
  outcomes jsonb not null default '[]'::jsonb,
  platform_url text not null,
  thumbnail text default '',
  is_published boolean not null default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists blog_posts (
  id serial primary key,
  slug text not null unique,
  title text not null,
  category text not null,
  summary text not null,
  read_time text not null,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  seo_title text default '',
  meta_description text default '',
  featured_image text default '',
  is_published boolean not null default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists contact_requests (
  id serial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp default now()
);

create table if not exists products (
  id serial primary key,
  name text not null,
  description text not null,
  price integer not null default 0,
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists site_contents (
  id serial primary key,
  page_key text not null unique,
  hero_title text not null,
  hero_subtitle text not null,
  body text not null,
  modules jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  updated_at timestamp default now()
);

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
before update on profiles
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists hackathons_set_updated_at on hackathons;
create trigger hackathons_set_updated_at
before update on hackathons
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists learning_resources_set_updated_at on learning_resources;
create trigger learning_resources_set_updated_at
before update on learning_resources
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists blog_posts_set_updated_at on blog_posts;
create trigger blog_posts_set_updated_at
before update on blog_posts
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
before update on products
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists site_contents_set_updated_at on site_contents;
create trigger site_contents_set_updated_at
before update on site_contents
for each row
execute function public.set_current_timestamp_updated_at();

alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
on profiles
for select
to authenticated
using (auth.uid() = auth_user_id);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
on profiles
for insert
to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
on profiles
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

insert into hackathons (slug, name, organizer, mode, location, prize, deadline, description, rules, timeline, registration_url)
values
  (
    'global-ai-buildathon',
    'Global AI Buildathon',
    'AI Consortium',
    'Online',
    'Worldwide',
    30000,
    '2026-04-28',
    'Build practical AI tools for education, productivity, or social impact with mentorship from product and ML teams.',
    '["Teams of 2-5 participants", "Original idea required", "Working demo and short pitch deck mandatory"]'::jsonb,
    '["Registration closes on April 28, 2026", "Kickoff on May 1, 2026", "Final demo day on May 10, 2026"]'::jsonb,
    'https://example.com/global-ai-buildathon'
  ),
  (
    'europe-web-innovation-hack',
    'Europe Web Innovation Hack',
    'EU Dev Network',
    'Offline',
    'Berlin, Germany',
    12000,
    '2026-05-08',
    'A product-focused web hackathon centered on accessibility, performance, and developer experience for the modern web.',
    '["Maximum 4 members per team", "Open-source frameworks allowed", "Final prototype must be deployable"]'::jsonb,
    '["Registration closes on May 8, 2026", "On-site hack begins on May 15, 2026", "Winners announced on May 17, 2026"]'::jsonb,
    'https://example.com/europe-web-innovation'
  ),
  (
    'fintech-sprint-challenge',
    'Fintech Sprint Challenge',
    'NextBank Labs',
    'Online',
    'Remote',
    18000,
    '2026-05-18',
    'Create secure fintech workflows, budgeting assistants, or inclusion-first payment tools using sandbox banking APIs.',
    '["Solo and team entries accepted", "API usage report required", "Compliance and privacy section mandatory"]'::jsonb,
    '["Registration closes on May 18, 2026", "Mentor clinic on May 20, 2026", "Submission deadline on May 29, 2026"]'::jsonb,
    'https://example.com/fintech-sprint'
  ),
  (
    'open-source-impact-hack',
    'Open Source Impact Hack',
    'OSS Collective',
    'Offline',
    'Toronto, Canada',
    10000,
    '2026-06-03',
    'Contribute to real open-source products, improve maintainability, and ship features that communities can adopt immediately.',
    '["Team size 1-4", "At least one OSS repository contribution required", "Documentation quality is scored"]'::jsonb,
    '["Registration closes on June 3, 2026", "Community briefing on June 7, 2026", "Closing showcase on June 14, 2026"]'::jsonb,
    'https://example.com/open-source-impact'
  )
on conflict (slug) do update
set
  name = excluded.name,
  organizer = excluded.organizer,
  mode = excluded.mode,
  location = excluded.location,
  prize = excluded.prize,
  deadline = excluded.deadline,
  description = excluded.description,
  rules = excluded.rules,
  timeline = excluded.timeline,
  registration_url = excluded.registration_url,
  is_published = true;

insert into learning_resources (slug, category, name, provider, duration, description, outcomes, platform_url)
values
  (
    'responsive-web-design',
    'Web Development',
    'Responsive Web Design',
    'freeCodeCamp',
    '40 hours',
    'HTML, CSS, and responsive UI fundamentals for students building their first solid frontend portfolio.',
    '["Build responsive pages", "Understand layout systems", "Earn a free certificate"]'::jsonb,
    'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
  ),
  (
    'google-ai-essentials',
    'AI',
    'Google AI Essentials',
    'Google',
    '10 hours',
    'A practical entry point into AI workflows, prompt usage, and responsible adoption in real projects.',
    '["Learn AI basics", "Use generative AI in workflows", "Understand responsible AI habits"]'::jsonb,
    'https://www.coursera.org/professional-certificates/google-ai-essentials'
  ),
  (
    'cs50x-introduction-to-computer-science',
    'Programming',
    'CS50x Introduction to Computer Science',
    'Harvard',
    '12 weeks',
    'Programming fundamentals, algorithms, data structures, and problem-solving for strong technical foundations.',
    '["Learn core programming concepts", "Practice algorithmic thinking", "Build project confidence"]'::jsonb,
    'https://cs50.harvard.edu/x/'
  ),
  (
    'microsoft-learn-cloud-skills',
    'Free Certifications',
    'Microsoft Learn Cloud Skills',
    'Microsoft',
    'Self-paced',
    'Structured cloud learning paths with badges and certification preparation for developers and students.',
    '["Prepare for certificates", "Understand cloud basics", "Track progress with badges"]'::jsonb,
    'https://learn.microsoft.com/training/'
  )
on conflict (slug) do update
set
  category = excluded.category,
  name = excluded.name,
  provider = excluded.provider,
  duration = excluded.duration,
  description = excluded.description,
  outcomes = excluded.outcomes,
  platform_url = excluded.platform_url,
  is_published = true;

insert into blog_posts (slug, title, category, summary, read_time, description, highlights)
values
  (
    'ai-tools-changing-student-projects',
    'AI tools changing student projects',
    'AI Update',
    'How students can use modern AI workflows without building shallow projects.',
    '5 min read',
    'AI tools ab sirf code generation tak limited nahi hain. Students unhe research acceleration, UI prototyping, debugging assistance, aur documentation quality improve karne ke liye use kar sakte hain.',
    '["Use AI for iteration speed, not as a replacement for core understanding", "Showcase real problem solving in portfolio projects", "Add evaluation, testing, and reasoning to make projects credible"]'::jsonb
  ),
  (
    'new-developer-tools-worth-tracking',
    'New developer tools worth tracking',
    'Developer Tools',
    'A focused look at tools that improve coding speed, debugging, and shipping.',
    '4 min read',
    'Developer tooling fast change ho raha hai. Teams ab AI-assisted editors, observability platforms, and deployment pipelines combine karke much faster shipping cycles achieve kar rahe hain.',
    '["Faster debugging with trace-first tooling", "Better deployment confidence through previews and checks", "Improved local development through integrated AI copilots"]'::jsonb
  ),
  (
    'tech-terms-you-should-actually-understand',
    'Tech terms you should actually understand',
    'Tech Terms',
    'Clear explainers on models, agents, vector databases, cloud runtimes, and more.',
    '6 min read',
    'Hype bohot hai, clarity kam. Ye post practical definitions deti hai jisse students interviews, hackathons, aur project discussions me stronger lagte hain.',
    '["Model, agent, and workflow me difference samajhna", "Vector database kab useful hai aur kab nahi", "Cloud runtime terms ko project examples se connect karna"]'::jsonb
  ),
  (
    'industry-signals-that-affect-hiring',
    'Industry signals that affect hiring',
    'Industry Trend',
    'What current platform and AI shifts mean for internships and entry-level roles.',
    '5 min read',
    'Hiring trends mostly skill signaling aur practical proof par shift ho rahe hain. Strong portfolios, shipped demos, and visible technical depth entry-level candidates ko alag karte hain.',
    '["Internship competition me project quality matters more", "Applied AI literacy is becoming a baseline advantage", "Public proof of work remains a strong differentiator"]'::jsonb
  )
on conflict (slug) do update
set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  read_time = excluded.read_time,
  description = excluded.description,
  highlights = excluded.highlights,
  is_published = true;
