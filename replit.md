# Project Overview

A full-stack web platform for students — featuring hackathon listings, learning resources, blog posts, user profiles, and an admin dashboard. Built with React (frontend) and Express (backend), using Supabase for authentication and Replit's PostgreSQL (via Drizzle ORM) for data storage.

## Architecture

- **Frontend**: React 18 + Vite, TailwindCSS, shadcn/ui components, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express 5, TypeScript, Drizzle ORM with PostgreSQL
- **Auth**: Supabase Auth (JWT-based) — tokens are validated server-side via Supabase's `/auth/v1/user` endpoint
- **Database**: Replit PostgreSQL (accessed via `DATABASE_URL` env var)

## Project Structure

```
/
├── client/src/          # React frontend
│   ├── pages/           # Route-level page components
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom hooks (use-auth, etc.)
│   └── lib/             # Supabase client, query client, utils
├── server/              # Express backend
│   ├── index.ts         # Entry point
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # All API routes
│   ├── storage.ts       # Database access layer (IStorage interface)
│   ├── db.ts            # Drizzle + pg pool setup
│   ├── supabase.ts      # Server-side Supabase auth helpers
│   └── services/        # Admin service functions
├── shared/              # Shared types and schemas
│   ├── schema.ts        # Drizzle table definitions + Zod schemas
│   └── routes.ts        # API route definitions with Zod validators
└── supabase/schema.sql  # Initial DB schema + seed data
```

## Key Configuration

- **Port**: 5000 (mapped to external port 80)
- **Dev command**: `npm run dev` → `cross-env NODE_ENV=development tsx server/index.ts`
- **Build command**: `npm run build` → `tsx script/build.ts`
- **DB push**: `npm run db:push`

## Environment Variables

- `DATABASE_URL` — Replit PostgreSQL connection string (auto-provided)
- `VITE_SUPABASE_URL` — Supabase project URL (for frontend auth)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key (for frontend auth)
- `SUPABASE_URL` — Same as above, for server-side auth validation
- `SUPABASE_ANON_KEY` — Same as above, for server-side auth validation
- `ADMIN_EMAILS` — Comma-separated list of admin email addresses

## Authentication Flow

1. User logs in via Supabase (email/password or Google OAuth) on the frontend
2. Supabase issues a JWT access token stored in the browser
3. Frontend sends `Authorization: Bearer <token>` with API requests
4. Server validates the token by calling Supabase's `/auth/v1/user` endpoint
5. If valid, the server looks up the user's profile in the local PostgreSQL database

## Database Schema

Tables: `waitlist`, `profiles`, `hackathons`, `learning_resources`, `blog_posts`, `contact_requests`, `products`, `site_contents`

## Notes

- Supabase is used only for authentication; all application data lives in Replit's PostgreSQL
- The `supabase/schema.sql` file contains seed data for hackathons, learning resources, and blog posts
- Admin access is controlled by `ADMIN_EMAILS` env var or by setting `user_role = 'admin'` in the profiles table
