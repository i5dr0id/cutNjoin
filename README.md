# CUT&JOIN Studios

Website for CUT&JOIN Studios, a post-production house in Lagos, Nigeria — editing, colour grading,
sound design and video production.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Sanity · React Hook Form · Zod ·
Resend · Paystack · Cloudflare R2 · Vercel

## Services

Third-party accounts the site depends on. Every key is set through the environment variables below —
none are hardcoded.

| Service                      | Used for                                                                            | Keys                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Vercel**                   | Hosting, builds and preview deployments; production follows `main`                  | Linked through the GitHub integration                      |
| **GitHub**                   | Source control; pull requests trigger preview deployments                           | —                                                          |
| **Sanity**                   | Content for every page, plus products and orders; Studio at `/studio`               | `NEXT_PUBLIC_SANITY_*`, `NEXT_SANITY_API_WRITE_TOKEN`      |
| **Cloudflare R2**            | Free footage files and the hero showreel; uploaded from the Studio                  | `R2_*`, `NEXT_PUBLIC_R2_PUBLIC_URL`                        |
| **Cloudflare Turnstile**     | Bot check on the quote form                                                         | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`   |
| **Resend**                   | Quote form emails and store order emails                                            | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |
| **Cloudflare Web Analytics** | Page views, referrers, countries and Core Web Vitals; no cookies, no consent banner | `NEXT_PUBLIC_CF_BEACON_TOKEN`                              |
| **Google Analytics 4**       | Visitor and traffic reporting; needs a cookie consent banner in the EU/UK           | `NEXT_PUBLIC_GA_MEASUREMENT_ID`                            |
| **Paystack**                 | Store checkout and payment confirmation webhook                                     | `PAYSTACK_SECRET_KEY`                                      |

Notes:

- **Sanity image CDN** serves every image; **Google Fonts** supplies Poppins, downloaded at build time
  by `next/font` and served from our own domain, so no request reaches Google at runtime.
- **Resend needs a verified sending domain.** Addresses on unverified domains (including any
  `gmail.com` address) are rejected. Use `onboarding@resend.dev` until `cutandjoinstudios.com` is verified.
- **Paystack** must use the live secret key and a live webhook URL (`/api/paystack/webhook`) before the
  store opens for real customers.
- **Turnstile** hostnames must list every domain the form runs on; production excludes `localhost`.
- Adding any new third-party origin also means updating the content security policy in `next.config.ts`.

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

| Variable                         | Purpose                                                               |
| -------------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical site URL, used for metadata, robots and sitemap             |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project ID                                                     |
| `NEXT_PUBLIC_SANITY_DATASET`     | Sanity dataset, `production` by default                               |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date                                               |
| `NEXT_SANITY_API_WRITE_TOKEN`    | Sanity token with write access, server-only                           |
| `R2_ACCOUNT_ID`                  | Cloudflare account ID for R2                                          |
| `R2_ACCESS_KEY_ID`               | R2 API token access key (server-only)                                 |
| `R2_SECRET_ACCESS_KEY`           | R2 API token secret (server-only)                                     |
| `R2_BUCKET`                      | R2 bucket holding footage files                                       |
| `NEXT_PUBLIC_R2_PUBLIC_URL`      | Public URL of the bucket (custom domain or r2.dev)                    |
| `RESEND_API_KEY`                 | Resend API key for the quote form                                     |
| `CONTACT_TO_EMAIL`               | Inbox that receives quote requests                                    |
| `CONTACT_FROM_EMAIL`             | Sender address; its domain must be verified in Resend                 |
| `PAYSTACK_SECRET_KEY`            | Paystack secret key (server-only), test or live                       |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`  | Google Analytics 4 measurement ID; analytics stays off when unset     |
| `NEXT_PUBLIC_CF_BEACON_TOKEN`    | Cloudflare Web Analytics beacon token; analytics stays off when unset |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key for the quote form widget                          |
| `TURNSTILE_SECRET_KEY`           | Turnstile secret key, server-only                                     |
| `TURNSTILE_HOSTNAMES`            | Comma-separated hostnames Turnstile tokens may come from              |

## Scripts

| Command          | Description                                        |
| ---------------- | -------------------------------------------------- |
| `pnpm dev`       | Start the development server                       |
| `pnpm build`     | Production build                                   |
| `pnpm start`     | Serve the production build                         |
| `pnpm lint`      | ESLint                                             |
| `pnpm typecheck` | Generate route types and run TypeScript            |
| `pnpm format`    | Format with Prettier                               |
| `pnpm check`     | Typecheck, lint and build                          |
| `pnpm typegen`   | Extract the Sanity schema and generate query types |

## Project structure

```
sanity.config.ts              Sanity Studio configuration
src/
  app/
    layout.tsx                root layout, fonts, base metadata
    globals.css               design tokens and base styles
    (site)/                   public site with header and footer
      page.tsx                homepage
      footage/                free footage library (search, filters, masonry) and licence page
      projects/ updates/ store/ profile/
    studio/[[...tool]]/       embedded Sanity Studio
    api/contact/route.ts      quote form endpoint
    api/store/checkout/       prices the cart, creates the order, starts a Paystack payment
    api/paystack/webhook/     confirms payments from Paystack
    (site)/opengraph-image.tsx  generated social share card
    robots.ts sitemap.ts not-found.tsx
    icon.png apple-icon.png favicon.ico
  components/
    footage/                  FootageSearch, FootageGrid
    store/                    CartButton, CartDrawer, AddToCart, CheckoutForm, ProductCard
    icons/                    SocialIcon, PlayIcon
    primitives/               Container, Section, SectionEyebrow, SectionHeading, Button,
                              TimecodeBar, SectionDivider, SprocketRail, RevealGroup
    layout/                   SiteShell, SiteHeader, HeaderFrame, MainNav, SocialLinks, SiteFooter,
                              Logo, BackgroundTexture, MobileNav, MotionProvider, CustomCursor,
                              SmoothScroll
    sections/                 Hero, HeroHeadline, HeroAmbientVideo, Services, Projects, Clients,
                              Updates, FreeFootage, Merch, StartProject, QuoteForm, LazyQuoteForm,
                              TurnstileField, ProjectsCarousel, FavouriteButton
  lib/
    site.ts                   routes, navigation, section anchors
    format.ts                 naira, timecode and date formatting
    validation/contact.ts     quote form schema shared by client and server
    contact/                  brief email builder, Turnstile verification
    footage/                  footage file rules
    store/                    cart, checkout schema, shipping quotes, pricing, orders, Paystack, order emails
    r2.ts rateLimit.ts        R2 signed URLs, shared rate limiter
    seo/                      LocalBusiness structured data
    heroVideo.ts maps.ts      hero showreel source, map link helper
    env.ts                    server environment variables
  sanity/
    env.ts client.ts image.ts queries.ts fetch.ts structure.ts
    types.ts                  generated by `pnpm typegen` — do not edit
    schemaTypes/              homePage, siteSettings, sectionIntro, service, project, client, post,
                              footageAsset, product, storeSettings, order
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
- **Looping animations** are pure CSS keyframes defined in `globals.css` (`animate-reel-timecode` 16s,
  `animate-reel-sprocket` 14s, `animate-pulse-dot`, `animate-play-ring`). The two reel speeds differ on
  purpose so they never sync up. Motion is only for interaction: the mobile menu and the quote form.
- **Reduced motion** is honoured globally in CSS and for Motion through `MotionProvider`.
- **Images:** Sanity images use `urlFor()` with `Image` from `next-sanity/image`; local images use
  `next/image`.
- **Text contrast:** readable text uses at least `text-fg/48` (4.5:1 on every dark surface). Purely
  decorative labels (timecodes, frame numbers) use `DecorativeText`, which renders through CSS
  `content` so it stays out of the accessibility tree and contrast audits.
- **Contact endpoint** (`/api/contact`) rejects cross-origin posts, bodies over 16KB and more than
  5 requests per 10 minutes per IP (in-memory, per server instance). Bots are silently accepted
  when the hidden `company` field is filled or the form is submitted within 3 seconds.
- **SEO:** homepage title, description and share photo are edited in Sanity (Homepage → SEO & sharing).
  Placeholder pages are `noindex` and left out of the sitemap until they are built.
- **Security headers:** `next.config.ts` sets a strict CSP for the site and a relaxed one for `/studio`.
  Add any new third-party origin there before using it.
- **Free footage files** live in Cloudflare R2. Editors upload originals (≤5 GB) and 720p preview
  clips (≤100 MB) from the Studio; the Studio asks `/api/footage/upload-url` for a signed URL (editor
  role required, verified against Sanity) and uploads straight to R2. Downloads go through
  `/api/footage/[id]/download`, which requires licence acceptance, rate-limits and redirects to a
  short-lived signed link. The Studio uses token login so the upload field can authenticate.
- **No code comments.** Names and structure should make the code self-explanatory.
- **Store:** prices, sizes, stock, delivery fees and the returns policy are all edited in Sanity
  (Store → Store settings / Products). The store stays in "coming soon" mode until **Store settings → Open**
  is on; the cart only appears in the header while it is open. Nigerian delivery is priced per state;
  other countries use an international zone or the rest-of-world fee, and a location with no fee can't
  check out. The server re-prices every checkout from Sanity, so the browser cart is never trusted.
- **Orders** are stored as private Sanity documents (`orders.<reference>`, hidden from the public API) and
  listed in Studio under Store → Orders by status. A payment is confirmed by the Paystack webhook or when
  the customer returns to `/store/checkout/complete`, whichever comes first; confirming marks the order
  paid, reduces stock and emails the customer and the studio (Store settings → Order notification email,
  else `CONTACT_TO_EMAIL`). Set the Paystack webhook URL to `<site>/api/paystack/webhook`.
