# Google Drive → GitHub: radni tok

**Google Drive** je izvor projektne dokumentacije i materijala (katalozi, brošure, logotipi, renderi).
**GitHub** (`ismail-alibegovic/riverina-web`) je izvor koda sajta i jedino mjesto gdje se mijenja sajt.

Drive folder: <https://drive.google.com/drive/folders/1QWDt-I1Vd8RESKdetMHw7pwmLBiUGXEq>

## Pravila

1. Originali ostaju na Driveu i ne mijenjaju se. U repo ide samo ono što sajt stvarno prikazuje, optimizirano (WebP, širina po potrebi), pod `public/riverina/<tema>/` s imenima bez razmaka i dijakritika.
2. Na sajtu nema linkova na Drive (preview linkovi nisu za produkciju).
3. Činjenice (površine, broj soba, sadržaji, adrese, cijene) idu na sajt samo ako postoje u dokumentu na Driveu ili u bazi. Svaki takav podatak u kodu ima komentar s izvorom (npr. `lib/apartmentTypes.ts`).
4. Ako se dva izvora ne slažu, vrijedi noviji dokument; razlika se upisuje u `docs/content-todo.md`.
5. Slike se obrađuju skriptama u `scripts/` (ponovljivo), ne ručno.

## Kad se na Drive doda nešto novo

1. Pregledati folder i upisati novi materijal u `docs/assets-inventory.md` (odjeljak „Google Drive").
2. Odlučiti gdje se koristi na sajtu; ako zamjenjuje stari materijal, provjeriti datum izmjene.
3. Preuzeti, optimizirati skriptom, staviti u `public/riverina/…` ili u CMS (Supabase Storage → „Slike").
4. Nova grana, `npm test`, `npm run build`, provjera stranice, commit s navedenim izvorom, pull request.

## Stanje Drive foldera (19. 10. 2026)

| Folder | Sadržaj | Upotreba na sajtu |
|---|---|---|
| `Riverina-Objekat-1/Without/` | Brošura zgrade 1 (BS, EN, TR, AR), 6. 10. 2026 | **Izvor tipova stanova A–I**: površine, spavaće sobe, lođe/terase, spratovi, prostorije (`lib/apartmentTypes.ts`) |
| `Riverina-Objekat-1/AlYasin/` | Ista brošura s ALYASIN brendom (BS, EN, TR, AR) | Za preuzimanje / prodaju; tekst isti kao gore |
| `Katalog/` | Katalog kompleksa bez ALYASIN (BS, EN, TR, AR), ~28 MB, 52 str., samo slike (bez teksta) | Još nije korišten (vidi niže) |
| `Katalog AlYasin/` | Isti katalog s ALYASIN brendom | Još nije korišten |
| `Riverina-logo/` | `Riverina-logo.png`, `logo-transparent.PNG` | Već u `public/brand/` |
| `AlYasin Logo/` | `ALYASINGROUP2.pdf` (vektor), `AlYasin.jpeg` | Već u `public/riverina/investitor/` |

Renderi, enterijeri i AutoCAD skice nisu u ovom Drive folderu; na sajtu su već (vidi `docs/assets-inventory.md`).

## Otvoreno

- Katalozi (52 str.) su samo slike; tekst iz njih nije moguće automatski pročitati. Ako sadrže podatke o lokaciji, sadržajima kompleksa ili rokovima, treba ih izvesti kao tekst (ili poslati Word/Google Doc verziju) da bi se popunili `[[TBD]]` dijelovi.
- PDF brošure zgrade 1 (EN/BS, ~9,5 MB) mogu se ponuditi za preuzimanje na sajtu kad vlasnik potvrdi koju verziju (s ili bez ALYASIN).
