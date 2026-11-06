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

## Sekcije početne (`components/v2/Home.tsx`), redoslijed KEY TOWERS reference
Hero → Svijet Riverine (naslov lijevo + tekst desno, 3 kartice; ref. „Everything you need") → O projektu (izjava + 2×2 brojke; ref. „KEY TOWERS is a unique…") → široki render → Arhitektura i život (karusel sa staklenim oznakama; ref. „Features of the complex") → „O PROJEKTU" preko enterijera (ref. „About THE PROJECT") → izjava + 63 stana → centrirani redovi sa slikom (ref. „The epitome of style…") → „Od ulice do terase", 4 numerisane kolone (ref. „Comfort begins with the first steps") → Stanovi (pločice + izbor tlocrta) → tipografska kompozicija „Moderno življenje uz rijeku" (ref. „Cozy Evenings…") → Galerija → Lokacija kao panel s mapom (ref. „Proximity") → Kontakt.
Sekcije reference bez potvrđenih podataka (parking, ostave, udaljenosti škola/vrtića) namjerno su izostavljene.

## Hero slike
Renderi nemaju neba iznad krova, pa `scripts/make-hero-plate.py` od kadra 135° iz 360° seta pravi `public/riverina/hero/plate.webp` (nebo produženo prema gore iz boja samog rendera) i `building.webp` (zgrada izrezana po obrisu, prozirna pozadina). Stranica slaže: plate → naslov → zgrada. Uspravni ekrani dobijaju posebnu verziju s više neba (`plate-m.webp`, `building-m.webp`: `python3 scripts/make-hero-plate.py <kadar> 620 -m`), pa na telefonu stane veći dio zgrade uz puni izvor od 1672 px. Za drugi kadar treba ponovo ucrtati obris (`BUILDING` u skripti).

## Stanovi
- `components/v2/Catalog.tsx`: filteri (površina s dvije ručice, spavaće sobe, sprat, samo slobodni), sortiranje, mreža/lista; stanje filtera je u URL-u (`?beds=2&floor=3&view=list`).
- Tab „Odabir na zgradi" montira postojeći `components/Selector.tsx` (360° zgrada, spratovi, panel stana, usporedba, upit) u brand bojama. Linkovi `#rvs/r1/<kod>` otvaraju ga direktno.
- Stranica stana (`components/v2/Detail.tsx`): tlocrt (zoom), 3D tlocrt, položaj na spratu, prostorije, enterijer, slični stanovi, upit vezan za stan.

## Otvoreno (potreban materijal ili odluka vlasnika)
- TR jezik ne postoji u kodu (samo BS/EN); dodavanje po uputstvu u README.
- Telefon, e-mail i adresa prodaje nisu uneseni u CMS, pa se ne prikazuju.
- Udaljenosti i sadržaji u okolini nisu potvrđeni — namjerno nisu prikazani.
- Dio vizuala u CMS galeriji (`objekat-*`) prikazuje stariju varijantu fasade (vidi `docs/assets-inventory.md`).
