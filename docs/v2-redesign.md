# Redizajn v2 (KEY TOWERS pristup)

Nova verzija sajta živi paralelno s postojećom i ne mijenja je:

| BS | EN |
|---|---|
| `/v2` | `/en/v2` |
| `/v2/stanovi` | `/en/v2/apartments` |
| `/v2/stanovi/[kod]` (63 stana) | `/en/v2/apartments/[code]` |

Sve v2 stranice su `noindex, nofollow` dok se redizajn ne odobri. Podaci dolaze iz istog izvora (Supabase `public_site_data()` + `lib/apartmentTypes.ts`), upiti idu na isti `/api/lead`.

## Sistem
- Boje: navy `#051836`, krem `#FAF1E8`, zlatna `#C49345` (izmjerena iz `public/brand/mark.png`). Za tekst na kremi koristi se tamnija nijansa iste zlatne `#9A6F2B` (kontrast); čista zlatna ide na navy podloge, linije, aktivne filtere i dugmad.
- Tipografija: Inter (monumentalni naslovi, tekst) + Playfair Display italic (riječ u kontrastu, `*riječ*` u CMS tekstu).
- Logo: originalni fajlovi iz `public/brand/` (wordmark u zaglavlju, stacked logo u podnožju), bez izmjena.
- CSS: `app/v2.css`, sve pod `.kt` (ili `body.kt-body` za panele postojećeg pregleda) — nema sudara s postojećim stilovima.

## Sekcije početne (`components/v2/Home.tsx`)
Hero (monumentalni naslov iz CMS-a „Život *uz rijeku*" u jednom redu od ivice do ivice — `FitTitle` ga skalira na tačnu širinu; ispod linija s podnaslovom, činjenicama i CTA; zatim render trenutne fasade, kadar 135° iz 360° seta, preko cijele širine) → uvodna izjava (manifest) i ključne činjenice → Svijet Riverine (3 kartice) → O projektu (tekst + 2×2 brojke + široki render) → Arhitektura i život (karusel) → tamni blok „Arhitektura" (360° render, redovi s izmjenom slike) → tipografska kompozicija „Moderno življenje uz rijeku" → Stanovi (pločice + izbor tlocrta) → Galerija (editorial mozaik + lightbox) → Lokacija (brand mapa Ilidže) → Kontakt (forma).

## Stanovi
- `components/v2/Catalog.tsx`: filteri (površina s dvije ručice, spavaće sobe, sprat, samo slobodni), sortiranje, mreža/lista; stanje filtera je u URL-u (`?beds=2&floor=3&view=list`).
- Tab „Odabir na zgradi" montira postojeći `components/Selector.tsx` (360° zgrada, spratovi, panel stana, usporedba, upit) u brand bojama. Linkovi `#rvs/r1/<kod>` otvaraju ga direktno.
- Stranica stana (`components/v2/Detail.tsx`): tlocrt (zoom), 3D tlocrt, položaj na spratu, prostorije, enterijer, slični stanovi, upit vezan za stan.

## Otvoreno (potreban materijal ili odluka vlasnika)
- TR jezik ne postoji u kodu (samo BS/EN); dodavanje po uputstvu u README.
- Telefon, e-mail i adresa prodaje nisu uneseni u CMS, pa se ne prikazuju.
- Udaljenosti i sadržaji u okolini nisu potvrđeni — namjerno nisu prikazani.
- Dio vizuala u CMS galeriji (`objekat-*`) prikazuje stariju varijantu fasade (vidi `docs/assets-inventory.md`).
