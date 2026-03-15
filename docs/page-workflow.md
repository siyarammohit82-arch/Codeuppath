# CodeUpPath Page Workflow

## Public Flow

1. User opens `Home`
2. User clicks `Login`
3. User can sign in with Google through Supabase Auth
4. After login, user lands on `Profile`
5. User completes profile
6. Full platform unlocks

## Auth Setup

- Google login uses Supabase Auth
- Set `VITE_SUPABASE_URL`
- Set `VITE_SUPABASE_ANON_KEY`
- Enable Google provider in Supabase Auth
- Add redirect URL: `http://127.0.0.1:5000/login`
- Add your production domain redirect URL too

## Public Flow Fallback

- Email/password fallback demo login still exists for local testing
- If Supabase env is missing, Google login button stays disabled

## Member Flow

### Dashboard
- Resume score
- Profile completion status
- Fit/recommendation summary
- Improvement suggestions

### Hackathons
1. User opens hackathons listing
2. Filters by mode, deadline, and prize
3. Opens a hackathon detail page
4. Reads description, rules, and timeline
5. Clicks registration button
6. Registers on the organizer website

### Learning Resources
1. User opens learning resources listing
2. Filters by category
3. Opens a resource detail page
4. Checks provider, duration, and outcomes
5. Clicks start learning
6. Continues on the course platform

### Blog
1. User opens blog listing
2. Selects a post
3. Reads overview and highlights
4. Returns to explore more posts

### Contact
1. User opens contact page
2. Sends support or collaboration request
3. Request is saved in the database

## Data Flow

- Hackathons page reads from `hackathons`
- Learning Resources page reads from `learning_resources`
- Blog page reads from `blog_posts`
- Contact form writes to `contact_requests`
- Waitlist writes to `waitlist`

## Database Target

- Supabase Postgres through `DATABASE_URL`
- Schema managed from `shared/schema.ts`
- Push schema with `npm run db:push`
