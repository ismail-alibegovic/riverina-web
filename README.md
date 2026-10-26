# Riverina Residence — website and CMS

**A bilingual marketing site for a multi-building residential development in Ilidža, Sarajevo, with an interactive apartment selector and a purpose-built CMS.** Buyers move from the masterplan to a building, a floor and a single apartment; the sales team edits content, availability, prices and the clickable building outlines themselves.

**Demo:** [riverina-web.vercel.app](https://riverina-web.vercel.app) · renders shown on the demo are illustrative.

---

## Highlights

- **Interactive selector** — masterplan → building → floor → apartment, drawn as SVG polygons over architectural renders. Labels are placed at a polygon's centroid, or along the widest chord for L-shaped units. Written in dependency-free JavaScript (`lib/selector/selector.js`), keyboard- and touch-friendly, respects `prefers-reduced-motion`.
- **Custom CMS at `/admin`** — content in every language, media library, apartments and availability, scenes with a **polygon editor** (snap to corners, 90° straightening, shape correction), lead inbox and settings. Saving triggers on-demand revalidation of the public pages.
- **Floor plans generated from source drawings** — scripts extract floor outlines and per-apartment plans from the architect's PDF/AutoCAD exports, so the selector does not depend on hand-traced shapes.
- **Secure by construction** — visitors never read tables directly. Public content comes from one `public_site_data()` function that hides unpublished units and withheld prices; enquiries go only through `submit_lead()` with validation and throttling; everything else requires an admin (RLS + `is_admin()`), including Storage uploads.
- **Internationalisation** — Bosnian at `/`, English at `/en`, with typed translation keys and route maps; the structure is ready for Turkish and right-to-left Arabic.
- **SEO** — per-page metadata from the CMS, canonical URLs and `hreflang` (including `x-default`), JSON-LD for the organisation and apartment complex; preview deployments are `noindex`.
- **Motion with restraint** — GSAP and Lenis are loaded lazily; scroll reveals, a pinned horizontal showcase on desktop and a scroll-snap fallback on touch and reduced-motion devices.

## Tech stack

Next.js 16 (App Router) · React · TypeScript · Supabase (PostgreSQL, Auth, Storage, RLS) · GSAP · Lenis · Swiper · Resend (optional e-mail notifications) · Node test runner

## Structure

```text
app/(bs), app/(en)     public pages per language
app/(admin)            CMS shell
app/api/lead           enquiry endpoint
app/api/revalidate     cache revalidation after CMS saves
components/            page sections, selector mount, gallery, contact form
lib/selector/          interactive selector
lib/admin/             CMS application
lib/i18n.ts            locales, routes and UI strings
supabase/migrations/   schema, RLS policies and public functions
scripts/               asset optimisation, floor-plan extraction, data tests
```

## Running locally

```bash
npm install
cp .env.example .env.local   # Supabase URL and publishable key
npm run dev                  # http://localhost:3000 · CMS at /admin
npm test                     # apartment-type and floor-plan data checks
```

Admin setup, environment variables, adding a language, SEO and animation conventions are documented in Bosnian in [`docs/README.bs.md`](docs/README.bs.md).

## Author

Designed and built by [Ismail Alibegović](https://github.com/ismail-alibegovic) — Sarajevo, Bosnia and Herzegovina.
