**CodeUpPath README (Deployment-ready version)**

```
# CodeUpPath

CodeUpPath is a Next/Vite + Express + Supabase platform that helps developers discover internships, hackathons, learning resources, and Ai-guided pathways. It includes:
- Hero/public funnel (Home, Policy, Product, etc.)
- Authenticated dashboard + admin console
- Supabase-backed data (profiles, opportunities, products, site content)
- SEO, analytics, and Play Store-ready metadata
- Policy/CMS pages managed via the `/admin` UI

## Local development

1. Copy `.env.example` → `.env` and fill in real values:
   - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
   - `VITE_SITE_URL=https://codeuppath.online`
   - `VITE_GA_MEASUREMENT_ID=G-2GYDEK0VC1`
   - `VITE_GOOGLE_SITE_VERIFICATION=swiKtIlCYqBLq6_JHdVnFUvAzMU4Pc4pt_L3qSslGtU`
   - `ADMIN_EMAILS` and `VITE_ADMIN_EMAILS` should list your admin email(s)

2. Seed the database:
   - Run the `DROP TABLE...` block (optional clean).
   - Run the full `supabase/schema.sql` script to create tables, policies, triggers, and seeded hackathons/resources/blogs.

3. Install & start:
   ```
   npm install
   npm run dev
   ```
   - Backend: Express serves API + sitemap/robots/external endpoints.
   - Frontend: Vite handles routing and auth gate. Log in via Supabase to access `/dashboard`/`/admin`.

## Admin Panel

- Protected routes under `/admin/*` require admin email (from env).
- AdminLayout uses sidebar+topbar matching the site’s theme.
- `/api/admin/*` endpoints guard via Supabase tokens + email/role whitelist.
- Hackathons table supports create/edit/delete; other modules list data for upcoming features.

## Deployment

1. Build the project:
   ```
   npm run build
   ```

2. Host the server + static assets on your preferred host (Render, Vercel, Fly, etc.). Make sure:
   - Environment variables match `.env`.
   - Supabase keys point to your production project.
   - Domain `codeuppath.online` is added in Supabase/Auth redirect URLs.
   - Google Analytics & Search Console tokens are updated per `.env`.

3. Optional: configure Play Store listing, footer links, and policy compliance based on the earlier content drafts.

## Analytics & Verification

- GA4 measurement ID: `G-2GYDEK0VC1`
- Search Console token: `swiKtIlCYqBLq6_JHdVnFUvAzMU4Pc4pt_L3qSslGtU`

These feed into the rendered `<head>` via Vite’s env system (used by `client/src/components/RouteSeo.tsx`).

## Maintenance

- Keep `supabase/schema.sql` up to date as the schema evolves.
- Run `npm run lint` / `npm run test` (if added) before deployments.
- Monitor `/admin/overview`, `/sitemap.xml`, `/robots.txt` endpoints after deploy.

Let me know if you want me to add a GitHub Actions workflow, Dockerfile, or hosting-specific config.