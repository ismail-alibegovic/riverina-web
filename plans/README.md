# Animacije i premium utisak: plan (audit 19. 10. 2026)

Audit: `improve-animations` (Emil Kowalski pristup), vizuelni pregled cijele početne + provjera u kodu.
Polazni commit: `0131059`.

| # | Ozbiljnost | Šta | Gdje | Status |
|---|---|---|---|---|
| 1 | VISOKA | `[[TBD: …]]` bilješke se vide posjetiocima | `components/home/text.tsx` (`Paras`) | DONE |
| 2 | VISOKA | Uvod bez pravog logotipa | `components/site/SiteChrome.tsx`, `app/globals.css` (`.intro`) | DONE |
| 3 | VISOKA | Isti reveal za sve (56 px + blur 8 px), bez hijerarhije | `app/home.css` (`rv-up`, `rv-clip`) | DONE |
| 4 | VISOKA | Galerija kao foto-album (13 slika, auto-pakovanje, opisi preko slika) | `components/Gallery.tsx`, `app/home.css` | DONE |
| 5 | SREDNJA | Isti renderi se ponavljaju (hero = završni blok, `objekat-6` 2×, …) | `lib/content.ts` (DEFAULT_PAGE) | DONE |
| 6 | SREDNJA | Kolaž manifesta: sitne, rasute sličice | `app/home.css` (`.mf-img-*`) | DONE |
| 7 | SREDNJA | Prodani tip: skriveni 2D tlocrt proviri preko 3D | `app/home.css` (`.type.is-sold`) | DONE |
| 8 | NISKA | Isti obrazac naslova u svakoj sekciji | `components/home/text.tsx` (`Heading`) | DJELIMIČNO (novi rasporedi u #9/#10; sam `Heading` nepromijenjen) |
| 9 | (zahtjev) | „O projektu": novi urednički raspored | `components/home/About.tsx` | DONE |
| 10 | (zahtjev) | „Život uz rijeku": novi raspored i pokret | `components/home/Showcase.tsx` | DONE |

## Odluke (vrijednosti)

- Easing: ulazi `cubic-bezier(.23, 1, .32, 1)` (`--ease-out`), maske/zavjese `cubic-bezier(.77, 0, .175, 1)` (`--ease-io`). Bez ease-in na ulazima.
- Hijerarhija reveala: naslovi = linije iz maske (postojeće); tekst = opacity + 16 px, 0,9 s, bez blura; velike slike = otvaranje odozdo 1,4 s + slijeganje 1,08 → 1; male slike = samo opacity 0,9 s.
- Uvod: pravi znak (R s listovima, `public/brand/mark-light.webp`) se otvara odozdo, wordmark (`wordmark-light`) slijeva, zatim zavjesa; ukupno ~2,6 s, jednom po sesiji, bez JS i uz reduced motion se ne prikazuje.
- Svaka slika na jednom mjestu na početnoj (raspodjela u `lib/content.ts`).
- Reduced motion: sve odmah u konačnom stanju, bez pinovanja.

## Provjera (19. 10. 2026)

- Desktop 1440: svi `[data-reveal]` elementi se otkriju (0 skrivenih), bez grešaka u konzoli; „Život uz rijeku" se pinuje, brojač 02 → 04 → 05 prati kadar u sredini.
- Reduced motion: uvod se ne prikazuje, bez pinovanja i raspršivanja slova.
- Mobilni 390: bez horizontalnog skrola; „O projektu" slike jedna ispod druge, činjenice 2 × 2; galerija naizmjenično.
- `npx tsc --noEmit`, `npm test` prolaze.

## Preuređenje po Elicyonu (19. 10. 2026, poslije povratne informacije)

Početna je skraćena na Elicyonov ritam: naslovna → vizija („Moderno življenje uz rijeku", zatamnjen render, slika i tekst u uskoj koloni) → kategorije preko cijelog ekrana koje se slažu jedna preko druge (ARHITEKTURA / ENTERIJER / LOKACIJA) → tipovi stanova (nepromijenjeno) → enterijer karusel sa središnjom slikom u okviru → „Svijet Riverine" (tri kartice prema podstranicama) → footer.

- Footer: jedna kompaktna plava traka (naslov, forma za upit, meni, kontakt, pravna linija). Veliki natpis preko cijele širine je uklonjen na zahtjev; znak R je sada u navbaru iznad natpisa (na vrhu stranice), a pri skrolanju se sklopi.
- Redoslijed početne prati elicyon.com: naslovna → manifest → kategorije → tipovi stanova → vizija → enterijer karusel → Svijet Riverine → završna slika s pozivom → footer. Svi naslovi sekcija iste veličine i stila, bez crtica i brojeva.
- `/galerija`: coverflow karusel (Swiper) sa svim renderima i filterima Zgrada / Naselje / Enterijer; srednja slika u istom okviru kao karusel na početnoj, klik otvara punu sliku.
- Isključene po defaultu (`DEFAULT_HIDDEN`), tekstovi ostaju u CMS-u: o projektu, traka, zgrade, galerija, lokacija, investitor, kontakt.
