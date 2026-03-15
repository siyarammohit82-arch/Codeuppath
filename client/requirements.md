## Packages
framer-motion | Essential for the 3D floating animations and complex layout transitions requested
react-hook-form | Form state management for the waitlist
@hookform/resolvers | Zod validation resolver for the waitlist form
clsx | Class merging for UI components
tailwind-merge | Utility class conflict resolution

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
  mono: ["var(--font-mono)"],
}

The API has a single POST endpoint at `/api/waitlist` for joining the waitlist.
Using Replit Replit Postgres for storage.
The frontend uses a dark 3D glassmorphism aesthetic with heavy use of backdrop-filter and custom glows.
