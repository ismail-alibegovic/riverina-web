# Plan redizajna: Riverina Residence (javni sajt po uzoru na Elicyon)

Status: **čeka potvrdu**. Ne pišem kod dok ne odobriš.

**Pristup:** stambeni projekat (luksuzni nekretninski brend) za kupce iz BiH i dijaspore. Mirna, editorijalna premium estetika: veliki serif, puno zraka, spori pokreti, navy/ivory sa zlatnim detaljem.
Postavke: raznolikost layouta 7 / pokret 5 / gustoća 3 (smireno, prostrano, pokret samo gdje nešto znači).

---

## 1. Šta sam zatekao (razlike u odnosu na brief)

| Brief | Stvarni kod / baza | Odluka |
|---|---|---|
| Upiti u tabeli `enquiries` | Tabela se zove **`leads`** (+ `submit_lead()`) | Zadržati `leads`, bez preimenovanja |
| Statusi Dostupno / Rezervisano / Prodano | 4 statusa: + **`unavailable`** („Nije u prodaji") | Zadržati sva 4 |
| Status jednim klikom | Padajući izbor statusa u svakom redu tabele | Ostaje, samo vizuelno dotjerati |
| „Upravljanje zgradama" | Dio taba „3 · Označi stanove" (zgrade, uglovi, spratovi, poligoni) | Ostaje |
| Fontovi Cormorant + Manrope | Isti fontovi, ali preko Google `<link>` | Prebaciti na `next/font` (self-host), **bez promjene fontova** |
| Paleta navy/ivory/gold | Već postoje tokeni u `:root` | Proširiti tokene, ne mijenjati boje |
| Zasebna stranica pregleda | Postoji `/stanovi`, `/en/stanovi`, `/embed` | Zadržati rute, redizajnirati okvir |
| Baza | Supabase „Riverina Residence": 63 stana (R1, svi slobodni, svi s tlocrtom i PDF-om), 33 slike, 1 zgrada („uskoro"), 0 upita | Ne dirati podatke |

Stack: Next.js 16 + React 19, čisti CSS (bez Tailwinda), CMS i selektor su vanilla JS. Nema animacijskih biblioteka.

## 2. Šta ostaje netaknuto

- Cijela baza i šema: `units`, `site_content`, `media`, `leads`, `admin_emails`, RLS, `is_admin()`, `public_site_data()`, `submit_lead()`, bucket `media`.
- CMS na `/admin`: login, Slike, Stanovi (unos, CSV uvoz/izvoz, status), Označi stanove (editor poligona, dodavanje stanova u editoru), Upiti, Postavke.
- Selektor (`lib/selector/selector.js`): masterplan → zgrada → sprat → stan, rotacija uglova, filteri, usporedba, forma s prefill porukom. **Ne piše se ispočetka.**
- `/api/lead` (Resend notifikacija), `/api/revalidate`.

## 3. Promjene u bazi

**Nema migracija.** Sav novi sadržaj (nove sekcije, redoslijed, podstranice) ide u postojeći JSON dokument `site_content.page`, koji `public_site_data()` već vraća u cjelini. Ako se kasnije pokaže da nešto ipak treba (npr. `alt` tekst po slici u tabeli `media`), javljam prije i šaljem migraciju na odobrenje.

## 4. Biblioteke (minimalno)

| Paket | Zašto |
|---|---|
| `gsap` (uključuje ScrollTrigger, SplitText; besplatan) | Pinned manifest, parallax kolaž, otkrivanje riječi |
| `lenis` | Mekani scroll (jedini smooth-scroll engine), isključen kod `prefers-reduced-motion` |
| `sharp` (dev) | Skripta za optimizaciju slika u AVIF/WebP |

Bez Tailwinda, bez UI kit-a, bez React Bits paketa: text i image reveal i marquee pišem sami u istom mirnom tonu.

## 5. Dizajn sistem (faza a)

- **Tokeni** u `:root`: navy `#14213a` / `#1d2d4b`, ivory `#f6f1e7`, paper `#fbf8f2`, gold `#b8955a` samo za akcent (fokus, tanke linije, aktivni link). Tipografska skala, razmaci (4–160px), easing `cubic-bezier(0.77,0,0.175,1)` i `cubic-bezier(0.23,1,0.32,1)`, trajanja 600–1200 ms.
- **Tipografija:** Cormorant Garamond za display (UPPERCASE/lowercase ritam u istom fontu, bez kurziva), Manrope za tekst i labele (UPPERCASE, tracking 0.15em). Oba preko `next/font`.
- **Header:** logo (pravi PNG, kasnije SVG) + „Meni" + „Kontakt"; preko hero slike svijetao, poslije scrolla na papirnoj podlozi.
- **Meni overlay:** full-screen navy, velike serif stavke sa stepenastim ulaskom, BS/EN prekidač, mreže i pravni linkovi dole. Fokus zarobljen u meniju, Esc zatvara.
- **Preloader:** kratka navy zavjesa s logom (≤1 s), samo pri prvom posjetu u sesiji; bez nje kod reduced motion.
- **Prijelazi stranica:** navy zavjesa preko View Transitions API-ja, s fallbackom na običnu navigaciju.
- **i18n osnova:** lista jezika i prevodi na jednom mjestu (`lib/i18n`), BS na `/`, EN na `/en/...`. Dodavanje TR i AR (RTL, `dir="rtl"`) kasnije je samo novi unos plus prevodi.

## 6. Početna (faza b) — svaka sekcija uređiva u CMS-u

Redoslijed i vidljivost sekcija biraju se u CMS-u (strelice gore/dole, prekidač prikaži/sakrij). Tekstovi su BS/EN, a sve slike se biraju iz biblioteke medija.

| # | Sekcija | Elicyon logika | Sadržaj |
|---|---|---|---|
| 1 | **Hero** | Full-bleed render, stepenasti naslov u 2–3 reda | Naš tekst (npr. „RIVERINA / uz rijeku / Ilidža"), CTA „Odaberite stan" → `/stanovi` |
| 2 | **Manifest** | Pinned paragraf, riječi se pale redom, kolaž 4–6 portreta u parallaxu | Tekst iz CMS-a s označenim riječima (`*riječ*` → UPPERCASE naglasak) |
| 3 | **O projektu** | Dvodijelni naslov „O / projektu" | Samo provjerene brojke iz baze: 63 stana u Riverini 1, 9 tipova, 46,44–110,92 m², prizemlje poslovno + 5 stambenih etaža; ostalo `[[TBD]]` |
| 4 | **Kategorije** | Velika slika, ogromna razmaknuta riječ, mali „Pogledaj" link | ZGRADE → `/stanovi`, ENTERIJER → galerija, LOKACIJA → `/lokacija` |
| 5 | **Zgrade / masterplan teaser** | Stepenaste portretne slike | Riverina 1 s brojem slobodnih stanova (živo iz baze); ostale „Uskoro" |
| 6 | **Detalji (slider)** | Horizontalni slider s centralnim fokusom | Enterijer i materijali, naziv + kratak opis po slajdu (swipe, tastatura, strelice) |
| 7 | **Lokacija** | Slika + tekst | Mapa Ilidže, tekst i udaljenosti iz CMS-a (`[[TBD]]` dok se ne unesu) |
| 8 | **Investitor** | „Leading the vision" blok | Logo i tekst investitora (ime `[[TBD]]`) |
| 9 | **CTA + forma** | Footer blok u boji brenda | Postojeća forma (honeypot, validacija, `leads` + e-mail) u novom izgledu, GDPR checkbox s linkom na politiku privatnosti |

## 7. Zasebna stranica pregleda stanova (faza c)

- Ruta ostaje `/stanovi` (EN: prijedlog `/en/apartments` s preusmjerenjem sa starog `/en/stanovi`).
- Full-screen iskustvo na navy podlozi: minimalni header (logo, BS/EN, „Nazad na sajt", Kontakt), selektor preko cijelog ekrana.
- Restilizacija `selector.css` na nove tokene: tooltip (naziv, status, sprat, sobe, m²), panel stana s tlocrtom, PDF-om i formom „Pošalji upit" (prefill već postoji).
- Mekani prijelazi između nivoa (crossfade 600 ms), rotacija uglova prevlačenjem i strelicama.
- Faza 1: samo Riverina 1 klikabilna, ostale zgrade na masterplanu „Uskoro dostupno" na hover (već podržano statusom `soon`).
- Masterplan, 360° uglove i poligone **unosiš ti** kroz CMS. Ja samo pazim da sve radi i lijepo izgleda s tvojim podacima.

## 8. CMS dotjerivanje (faza d)

- „Tekstovi sajta" → **„Stranice i sekcije"**: nove sekcije iz tačke 6, redoslijed, prikaži/sakrij, alt tekst za slike BS/EN, pregled kako izgleda naglasak u manifestu.
- Podstranice (Lokacija, O investitoru, Kontakt) kao zasebne grupe polja.
- Editor poligona: zadržati; dotjerati vizuelno i dodati „Poništi" (Ctrl+Z) i snap na prvu tačku za zatvaranje oblika, ako već ne postoji.
- Nakon svake faze: test toka admin → izmjena → javni sajt (revalidacija).

## 9. Ostale stranice (faza e)

`/lokacija`, `/o-investitoru`, `/kontakt` (+ EN `/en/location`, `/en/developer`, `/en/contact`), branded 404, politika privatnosti (tekst `[[TBD]]`).

## 10. i18n, SEO, performanse (faza f)

- `hreflang` za sve stranice, sitemap, kanonski URL-ovi, OG slike po stranici, JSON-LD (`ApartmentComplex` / `Residence`, samo s provjerenim podacima).
- `next/image` (AVIF/WebP, lazy, `sizes`), hero s `priority`; skripta `scripts/optimize-assets.mjs` za originale → `public/riverina/…` (teški originali se ne commitaju).
- Cilj: Lighthouse mobile ≥ 90 (performance, a11y, SEO); bez horizontalnog scrolla na 375/768/1440; `prefers-reduced-motion` gasi Lenis, pin i parallax.

## 11. Deploy (faza g)

Vercel projekat (provjeravam postoji li već), env varijable, preview deploy → tvoja potvrda → production. Domena `riverinaresidence.com` kasnije, ti je spajaš.

## 12. Način rada po fazi

Commit po fazi (bez pusha dok ne kažeš) → screenshot desktop + mobile → taste-skill pre-flight checklist + a11y pregled → test admin → javni sajt → kratka lista urađenog i šta fali.

## 13. Skillovi

Učitani i primjenjuju se: `frontend-design`, `design-taste-frontend` (taste-skill), `build-awwwards-quality-sites`, `apple-design`, `emil-design-eng`, `animation-on-scroll`, `landing-page-design`; `improve-animations` ide u završni prolaz.
**Ne postoje u okruženju:** `design-engine`, `impeccable`, `react-bits`, `pick-ui-library`. Zamjena: pre-flight checklist iz taste-skilla + `design:accessibility-review` + Lighthouse; react-bits efekte (text/image reveal, marquee) pišem sam.

Napomena: jedno pravilo iz `landing-page-design` (samo jedan font, bez serifa) je u sukobu s briefom. Brief ima prednost: serif + sans.
