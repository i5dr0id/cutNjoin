# CUT&JOIN Studios

Website for CUT&JOIN Studios, a post-production house in Lagos, Nigeria — editing, colour grading,
sound design and video production.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Sanity · React Hook Form · Zod ·
Resend · Vercel

## Getting started

Requires Node 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The site runs at http://localhost:3000 and the Sanity Studio at http://localhost:3000/studio.
Add `http://localhost:3000` as a CORS origin (with credentials) in the Sanity project settings.

## Environment variables

| Variable                         | Purpose                                                   |
| -------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical site URL, used for metadata, robots and sitemap |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project ID                                         |
| `NEXT_PUBLIC_SANITY_DATASET`     | Sanity dataset, `production` by default                   |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date                                   |
| `RESEND_API_KEY`                 | Resend API key for the quote form                         |
| `CONTACT_TO_EMAIL`               | Inbox that receives quote requests                        |
| `CONTACT_FROM_EMAIL`             | Sender address for quote request emails                   |

## Scripts

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Start the development server            |
| `pnpm build`     | Production build                        |
| `pnpm start`     | Serve the production build              |
| `pnpm lint`      | ESLint                                  |
| `pnpm typecheck` | Generate route types and run TypeScript |
| `pnpm format`    | Format with Prettier                    |
| `pnpm check`     | Typecheck, lint and build               |

## Project structure

```
sanity.config.ts              Sanity Studio configuration
src/
  app/
    layout.tsx                root layout, fonts, base metadata
    globals.css               design tokens and base styles
    (site)/                   public site with header and footer
      page.tsx                homepage
      projects/ footage/ updates/ store/ profile/
    studio/[[...tool]]/       embedded Sanity Studio
    api/contact/route.ts      quote form endpoint
    robots.ts sitemap.ts not-found.tsx
    icon.png apple-icon.png favicon.ico
  components/
    primitives/               Container, Section, SectionEyebrow, SectionHeading, Button,
                              TimecodeBar, SectionDivider, SprocketRail
    layout/                   SiteShell, SiteHeader, MainNav, SiteFooter, Logo, BackgroundTexture
    sections/                 homepage sections and QuoteForm
  lib/
    site.ts                   routes, navigation, section anchors
    format.ts                 naira, timecode and date formatting
    validation/contact.ts     quote form schema shared by client and server
    env.ts                    server environment variables
  sanity/
    env.ts client.ts image.ts queries.ts structure.ts
    schemaTypes/              siteSettings, service, project, client, post, footageAsset, product
  assets/
    brand/                    white logo
    textures/                 background icon-grid tile
```

## Conventions

- **Design tokens** live in `src/app/globals.css`. Use the token utilities — `bg-bg`, `text-fg`,
  `bg-accent`, `bg-card`, `bg-card-2`, `bg-strip`, `text-heading`, `eyebrow`, `max-w-site` — never
  raw hex values.
- **Accent green** is reserved for primary calls to action, the active nav item, filled hearts and
  the Download, Submit and Contact actions.
- **Spacing** uses 8, 16, 24, 32, 48, 64, 96 and 128px only (`2 4 6 8 12 16 24 32`).
- **No rounded corners.**
- **Timecodes** (`HH:MM:SS:FF`) are prefixed `TC`. Never on stats, prices, dates or durations.
- **Server components by default**; `"use client"` only where there is interaction.
- **Looping animations** (timecode ticks, sprocket rail, hero pulse and play ring) are pure CSS
  keyframes. The tick bar runs at 16s and the sprocket rail at 14s so they never sync up.
- **Images:** Sanity images use `urlFor()` with `Image` from `next-sanity/image`; local images use
  `next/image`.
- **No code comments.** Names and structure should make the code self-explanatory.
