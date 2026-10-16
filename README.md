# Riverina Residence — web + CMS

Next.js 16 (App Router) + Supabase. Javni sajt (BS `/`, EN `/en`) s interaktivnim pregledom zgrada i stanova, i vlastiti CMS na `/admin`.

## Struktura
- `app/` — stranice (`page.tsx`, `en/page.tsx`), `admin/` (CMS), `api/lead` (upiti), `api/revalidate` (osvježavanje nakon spremanja)
- `components/` — sekcije sajta, `Selector.tsx` montira interaktivni pregled
- `lib/selector/selector.js` + `app/selector.css` — pregled masterplan → zgrada → sprat → stan (vanilla JS)
- `lib/admin/app.js` + `app/admin/admin.css` — CMS (sadržaj, mediji, stanovi, scene + editor poligona, upiti, postavke)
- `lib/content.ts` — model sadržaja, zadani tekstovi, učitavanje podataka
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

## Sigurnost
Posjetioci ne čitaju tabele direktno: sav javni sadržaj dolazi iz funkcije `public_site_data()` (bez skrivenih stanova i bez cijena kad su isključene ili je stan prodan). Upisi idu samo preko `submit_lead()` (validacija + ograničenje broja upita). Sve ostalo zahtijeva prijavljenog admina (RLS + `is_admin()`), uključujući upload u Storage bucket `media`.
