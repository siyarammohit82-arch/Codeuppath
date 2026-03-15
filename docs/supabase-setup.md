# Supabase Setup

1. Create a Supabase project and copy the project URL, anon key, and Postgres connection string into `.env`.
2. In the Supabase SQL editor, run [`supabase/schema.sql`](../supabase/schema.sql). It creates the tables, adds `profiles` policies, and seeds the hackathons, learning resources, and blog data.
3. In Supabase Auth, enable Google under `Authentication > Providers > Google`.
4. Add these redirect URLs in both Google Cloud and Supabase:
   - `http://localhost:5000/login`
   - your production site URL with `/login`
5. Put the same project URL/key into both `SUPABASE_URL` / `SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
6. Run `npm run dev`. On this Windows machine the scripts now use `cross-env`, so `.env` and `NODE_ENV` load correctly.

Notes:
- `DATABASE_URL` is used by the Express server and Drizzle to read/write the content tables in Supabase Postgres.
- If `db.<project-ref>.supabase.co` fails with `getaddrinfo ENOENT`, use the Supabase `Connect` page and copy the `Session pooler` connection string instead. Supabase documents the direct host as IPv6-oriented, while the shared pooler supports both IPv4 and IPv6.
- If the pooler says `Tenant or user not found`, the URI is malformed. For the shared pooler, the username must look like `postgres.<project-ref>`, not just `postgres`.
- Google sign-in and email/password sign-in are handled by Supabase Auth on the client.
- User profile save/load goes through `/api/profile`, which verifies the Supabase access token before writing to Postgres.
