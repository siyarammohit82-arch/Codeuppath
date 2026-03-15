## SEO, Analytics, and Vercel Deployment

This project is now wired for:

- public SEO-friendly metadata on indexable routes
- dynamic `robots.txt`
- dynamic `sitemap.xml`
- Google Search Console verification via env var
- Google Analytics page tracking via GA4 measurement ID
- Vercel deployment using the root `server.ts` Express entry
- production domain: `https://codeuppath.site`

### 1. Required environment variables

Set these in local `.env` and in your Vercel project settings:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_URL=https://codeuppath.site
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_SITE_VERIFICATION=your-google-verification-code
VITE_SITE_OG_IMAGE=/favicon.png
ADMIN_EMAILS=founder@codeuppath.site
```

Notes:

- `VITE_SITE_URL` must be your final production domain.
- `VITE_GOOGLE_SITE_VERIFICATION` is only the code, not the full meta tag.
- `VITE_SITE_OG_IMAGE` can be an absolute URL or a path like `/social-share.png`.
- `ADMIN_EMAILS` should list comma-separated addresses that can access the admin editor (e.g., `founder@codeuppath.site`).

### 2. Deploy to Vercel

1. Push the project to GitHub.
2. In Vercel, click `Add New Project`.
3. Import this repository.
4. Leave the framework preset as detected by Vercel.
5. Add all environment variables from the list above.
6. Deploy.
7. After the first deploy, connect `codeuppath.site` to the Vercel project (plus `www.codeuppath.site` if you need it).
8. Update `VITE_SITE_URL` to `https://codeuppath.site` inside Vercel if it changed (or to whichever custom domain you end up publishing) and redeploy once.
9. Redeploy once after the final domain is set.

Implementation details already handled in code:

- Vercel builds the client into the root `public/` directory.
- The Express app is exported from [server.ts](/c:/Users/Tanu%20Raj/Downloads/Futuristic-Tech-Design/Futuristic-Tech-Design/server.ts).
- Local production still serves the client from `dist/public`.

### 3. Google Analytics setup

1. Create a GA4 property in Google Analytics.
2. Create a Web Data Stream for your production domain.
3. Copy the Measurement ID, which looks like `G-XXXXXXXXXX`.
4. Set it as `VITE_GA_MEASUREMENT_ID` in Vercel.
5. Redeploy.

The app will then send page views automatically on route changes.

### 4. Google Search Console setup

1. Open Google Search Console.
2. Add `https://codeuppath.site` as a `URL prefix` property (or your canonical domain) inside Search Console.
3. Choose the `HTML tag` verification method.
4. Copy the verification code from the `content` field.
5. Set that value as `VITE_GOOGLE_SITE_VERIFICATION` in Vercel.
6. Redeploy.
7. In Search Console, click `Verify`.

After verification:

1. Open `https://codeuppath.site/robots.txt`
2. Open `https://codeuppath.site/sitemap.xml`
3. Submit `https://codeuppath.site/sitemap.xml` inside Search Console

### 5. Indexable vs private routes

These routes are intended for indexing:

- `/`
- `/hackathons`
- `/hackathons/:slug`
- `/learning-resources`
- `/learning-resources/:slug`
- `/blog`
- `/blog/:slug`
- `/contact`

These routes are marked `noindex`:

- `/login`
- `/profile`
- `/dashboard`
- `/ai-roadmap`

### 6. Post-deploy checks

Verify all of these after deployment:

- the homepage source contains the Google verification meta tag
- route source HTML shows the correct title and description on direct load
- `robots.txt` includes the sitemap URL
- `sitemap.xml` lists your published blog, hackathon, and learning resource URLs
- Google Analytics realtime view shows page visits
