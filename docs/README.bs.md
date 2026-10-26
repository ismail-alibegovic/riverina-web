# Riverina Residence — web + CMS

Next.js 16 (App Router) + Supabase. Javni sajt (BS `/`, EN `/en`) s interaktivnim pregledom zgrada i stanova, i vlastiti CMS na `/admin`.

## Struktura
- `app/` — stranice (`page.tsx`, `en/page.tsx`), `admin/` (CMS), `api/lead` (upiti), `api/revalidate` (osvježavanje nakon spremanja)
- `components/` — sekcije sajta, `Selector.tsx` montira interaktivni pregled
- `lib/selector/selector.js` + `app/selector.css` — pregled masterplan → zgrada → sprat → stan (vanilla JS)
- `lib/admin/app.js` + `app/admin/admin.css` — CMS (sadržaj, mediji, stanovi, scene + editor poligona, upiti, postavke)
- `lib/content.ts` — model sadržaja, zadani tekstovi, učitavanje podataka
- `lib/apartmentTypes.ts` — tipovi stanova A–I iz prodajne brošure (Google Drive); sekcija `components/home/Types.tsx`
- `docs/drive-workflow.md` — kako se materijali s Google Drivea unose u repo
- `supabase/migrations/0001_init.sql` — šema baze (već primijenjena na projekat „Riverina Residence")
- `public/demo/` — demo renderi i podaci za dugme „Učitaj demo podatke"

## Pokretanje lokalno
```bash
npm install
cp .env.example .env.local   # upišite Supabase URL i publishable key
npm run dev                  # http://localhost:3000  (CMS: /admin)
```

## Prvi admin
1. Supabase → Authentication → Users → **Add user** (e-mail + lozinka, „Auto Confirm User").
2. E-mail mora biti u tabeli `admin_emails` (prvi admin je već dodan). Ostale admine dodajete u CMS-u → Postavke.
3. Preporuka: Authentication → Sign In / Providers → isključite „Allow new users to sign up".
4. Authentication → URL Configuration → Site URL = adresa sajta (za link „Zaboravljena lozinka").

## Varijable okruženja (Vercel → Settings → Environment Variables)
| Ključ | Opis |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase projekta |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable (javni) ključ |
| `NEXT_PUBLIC_SITE_URL` | npr. `https://riverinaresidence.com` |
| `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL` | opcionalno: e-mail obavijest za nove upite (resend.com) |

## Jezici (BS, EN; spremno za TR i AR)
Svi prevodi interfejsa, rute po jeziku i postavke jezika su u `lib/i18n.ts`. BS je na `/` bez prefiksa, ostali jezici na `/<jezik>/...`, svaki u svom folderu (`app/(bs)`, `app/(en)`).
Dodavanje jezika (npr. `tr`):
1. `lib/i18n.ts`: dodati `'tr'` u `Lang` i `LOCALES` (za `ar`: `dir: 'rtl'`), putanje u `ROUTES`, blok prevoda u `UI` (TypeScript javlja svaki ključ koji fali) i po želji `SELECTOR_UI.tr` za pregled stanova.
2. Kopirati tanke fajlove iz `app/(en)` u `app/(tr)` (layout + stranice) i zamijeniti `'en'` sa `'tr'`.
3. `lib/admin/app.js`: dodati `'tr'` u `CMS_LANGS` da se u CMS-u pojave polja za taj jezik.
Tekst koji nije preveden pada na `LOCALES[lang].fallback` (EN → BS).

## SEO
- Metadata svih stranica: `lib/meta.ts` (`buildMetadata`). Redoslijed: CMS „Google i dijeljenje linka" za tu stranicu i jezik → naslov/tekst/slika same stranice → zadano (`public/og/riverina.jpg`).
- Kanonski URL i `hreflang` (uključujući `x-default`) na svakoj stranici i u `sitemap.xml`; JSON-LD (`Organization`, `WebSite`, `ApartmentComplex`, `BreadcrumbList`) u `components/JsonLd.tsx`, samo s podacima koji su već na sajtu.
- Vercel preview deploy je `noindex` (i `robots.txt` zabranjuje sve); indeksira se samo production.
- `NEXT_PUBLIC_SITE_URL` mora biti stvarna adresa sajta (kanonski URL-ovi, sitemap, OG slike).

## Animacije
- Ulazak sadržaja pri scrollu (jednom): atribut `data-reveal="up" | "clip" | "fade"` na elementu, stepenasto sa `style="--i: n"`. Keyframes su u `app/home.css`, okidač u `components/site/SmoothScroll.tsx`.
- `data-count` (broji do vrijednosti), `data-parallax="8"` (slika klizi ±8 %, samo desktop, GSAP se učitava tek na prvi scroll), `data-parallax-out` (hero sadržaj blijedi), `data-magnetic` (dugme prati miš): `components/site/scrollFx.ts`.
- Naslovi sekcija dobijaju redni broj i zlatnu liniju (`Heading index`). Oznaka „Ilustracija / idejni prikaz" na renderima se uključuje/isključuje i mijenja u CMS-u (Tekstovi sajta → Oznaka na vizualima).
- Uz `prefers-reduced-motion` sve je odmah vidljivo i mirno; bez JavaScripta sadržaj je takođe vidljiv.
- `data-reveal="clip"` (slike koje se otvaraju odozdo) prati se po poziciji na skrolu, ne IntersectionObserverom: Chromium računa `clip-path`, pa potpuno odsječen element nikad ne bi „ušao" u ekran i ostao bi skriven.
- „Život uz rijeku" (`components/home/Showcase.tsx`): na desktopu GSAP pin + horizontalni pomak uz Lenis; na dodir, uz reduced motion i bez JS obična traka sa scroll-snap.

## Skripte
- `node scripts/make-brand-assets.mjs` — zadana OG slika, WebP logotipi, favicon i apple ikona iz `public/brand/`.
- `node scripts/optimize-assets.mjs` — originali rendera → `public/riverina/`.
- `node scripts/make-type-plans.mjs` — isječci tlocrta iz AutoCAD skica: po stanu (`public/riverina/units/`, pregled stana) i po tipu (`public/riverina/types/`, „Kolekcija stanova").
- `python3 scripts/make-floor-plans.py` — tlocrti spratova i obrisi svih stanova iz bloka „Pozicija stana u objektu" na PDF skicama (`public/riverina/floors/`, `lib/floorPlans.json`). Pregled stanova ih koristi dok u CMS-u („Označi stanove") zgrada nema svoje tlocrte spratova.
- `node scripts/make-3d-plans.mjs` — 3D tlocrti s Drivea (`assets-src/3d/I`, `II`) → `public/riverina/3d/` i `lib/plans3d.json`.
- CMS → „Označi stanove" → zgrada → **Učitaj tlocrte iz skica**: kopira generisane tlocrte spratova u CMS da se linije mogu popravljati (editor: „Prave linije (90°)", „Lijepi na uglove", „Ispravi oblik / sve"). Nakon spremanja sajt koristi verziju iz CMS-a.
- `npm test` — provjera podataka o tipovima stanova (`lib/apartmentTypes.ts`): prostorije daju ukupnu površinu, 63 stana, slike postoje.
- Lokalni test bez pristupa Supabaseu: `SITE_DATA_FILE=put/do/public_site_data.json npm run build && npm start` (JSON koji vraća `public_site_data()`). Na Vercelu se ne postavlja.

## Sigurnost
Posjetioci ne čitaju tabele direktno: sav javni sadržaj dolazi iz funkcije `public_site_data()` (bez skrivenih stanova i bez cijena kad su isključene ili je stan prodan). Upisi idu samo preko `submit_lead()` (validacija + ograničenje broja upita). Sve ostalo zahtijeva prijavljenog admina (RLS + `is_admin()`), uključujući upload u Storage bucket `media`.
