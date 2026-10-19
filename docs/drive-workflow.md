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

| Folder / fajl | Sadržaj | Upotreba na sajtu |
|---|---|---|
| `Riverina-Objekat-1/Without/` | Brošura zgrade 1 (BS, EN, TR, AR), 6. 10. 2026 | **Izvor tipova stanova A–I**: površine, spavaće sobe, lođe/terase, spratovi, prostorije (`lib/apartmentTypes.ts`) |
| `Riverina-Objekat-1/AlYasin/` | Ista brošura s ALYASIN brendom | Za preuzimanje / prodaju; tekst isti kao gore |
| `Katalog/`, `Katalog AlYasin/` | Katalog kompleksa (BS, EN, TR, AR), 52 str., samo slike (bez teksta) | Još nije korišten |
| `1-skice prodaja sve+/` | AutoCAD prodajne skice (RAR, 18 MB) | Već na sajtu kao `public/riverina/pdf/*.pdf` i `plans/*.webp`; iz njih su i tlocrti spratova i obrisi stanova (`scripts/make-floor-plans.py`) i isječci tlocrta (`scripts/make-type-plans.mjs`) |
| `2-stanovi 3d osnova/SKICE 3D/I` i `/II` | **3D tlocrti**: `I/stan 1–14` = stanovi 1–14 na 1.–4. spratu, `II/STAN 1–7` = stanovi 1–7 na 5. spratu (PNG ~2 MB, AI) | Na sajtu (19. 10.): `public/riverina/3d/` (21 WebP, 2,7 MB), svih 63 stana; pregled stana (prva kartica), tooltip na tlocrtu sprata, kartice tipova. Provjereno: 3D odgovara AutoCAD skici istog stana |
| `Riverina Residence - ESU AG spo IDEJNI.pdf` | Idejni projekat (13 MB): situacija, osnove etaža, presjeci, fasade | Još nije korišten (prizemlje / poslovni prostor) |
| `3-stanovi enterijer/`, `4-slike objekta+/`, `5-slike naselja+/` | Enterijeri, zgrada, naselje (AI vizuali) | Već na sajtu (`public/riverina/enterijer`, `objekat`, `naselje`) |
| `01_REFERENCE/` | Tuđe brošure (inspiracija) | Ne koristi se |
| `Riverina-logo/`, `AlYasin Logo/`, `Riverina-logo.png` | Logotipi | Već u `public/brand/` i `public/riverina/investitor/` |

### Kako fajlovi s Drivea dolaze u ovo okruženje
Cloud okruženje u kojem radi Claude **nema mrežni pristup `drive.google.com`** (politika mreže). Drive konektor ipak vraća fajl kao base64; kad je odgovor velik, Claude Code ga sprema u fajl, odakle se dekodira u `assets-src/` (tako su preuzeti 3D tlocrti). Za veće količine fajlova, druge mogućnosti:
1. U postavkama okruženja (Network access) dodati `drive.google.com` i `drive.usercontent.google.com`, a fajlove podijeliti s „Anyone with the link"; ili
2. postaviti potrebne fajlove u repo u `assets-src/` (npr. `assets-src/3d/I/`, `assets-src/3d/II/`); taj folder se ne objavljuje, skripte iz njega prave optimizirane verzije.

## Otvoreno

- Katalozi (52 str.) su samo slike; tekst iz njih nije moguće automatski pročitati. Ako sadrže podatke o lokaciji, sadržajima kompleksa ili rokovima, treba ih izvesti kao tekst (ili poslati Word/Google Doc verziju) da bi se popunili `[[TBD]]` dijelovi.
- PDF brošure zgrade 1 (EN/BS, ~9,5 MB) mogu se ponuditi za preuzimanje na sajtu kad vlasnik potvrdi koju verziju (s ili bez ALYASIN).
