# Riverina Residence — inventar materijala

Stanje: 16. 10. 2026. Izvor: `Riverina residence/` (glavni folder). Ništa od originala nije mijenjano ni premještano.

Metoda: pregled foldera, dimenzije i hash slika, čitanje C2PA (Content Credentials) metapodataka, metapodaci PDF-ova, vizuelni pregled uzoraka.

> **Ključni nalaz:** gotovo svi „renderi“ (zgrada, naselje, enterijer, 3D tlocrti) nose C2PA potpis
> `OpenAI Media Service API` s `digitalSourceType = trainedAlgorithmicMedia` i datumom 24.–30. 9. 2026.
> To znači da su generisani ili ponovo generisani u ChatGPT-u (moguće iz arhitektovog materijala, ali piksele je napravio AI).
>
> **Odluka vlasnika (16. 10. 2026):** AI vizuali su odobreni izvori i smiju se koristiti na sajtu.
> Masterplan i 360° pregled (označavanje zgrada i stanova) vlasnik priprema sam, odvojeno, kroz CMS.

---

## 1. Razlike u odnosu na brief

| Brief | Stvarno stanje |
|---|---|
| `katalog-reference-assets/`, `prevodi/`, `3-stanovi enterijer/`, `4-slike objekta+/` u korijenu | Nalaze se u podfolderu `Riverina residence/Riverina residence/` |
| `riverina_types.json` | Ne postoji. Ekvivalent: `katalog-output/apartments.json` (63 stana) i `_export/riverina-assets.zip → units.json` (63 stana + prostorije s površinama) |
| `logo-transparent.PNG` u korijenu | `Riverina-logo/logo-transparent.PNG` |
| `riverina-web-main/` je git repo | Nije — to je ZIP s GitHuba. **Radni repo je sada klon `riverina-web/`** (`ismail-alibegovic/riverina-web`, identičan ZIP-u). `riverina-web-main/` ostaje netaknut |

## 2. Pouzdano pravi materijali (arhitekt / AutoCAD)

| Materijal | Lokacija | Napomena |
|---|---|---|
| Prodajne skice stanova, 63 PDF-a (`{sprat}-{stan}.pdf`) | `Riverina residence/1-skice prodaja sve+/PDF prodaja/` | Creator: AutoCAD 2025, izvor `Skice riverina.dwg`, 21. 9. 2026. **Glavni izvor istine za površine.** |
| Isto, arhiva | `1-skice prodaja sve+/PDF prodaja SVE SKICE - TEHNICKE.rar` (17 MB) | |
| Regulacioni plan | `Riverina residence/1-regulacioni plan riverina sastavci.pdf` | AutoCAD 2025 |
| Idejni projekat, 26 str. | `Riverina Residence - ESU AG spo IDEJNI.pdf` (13 MB) + raster stranica u `katalog-output/assets/idejni/` | Investitor naveden kao **ESU AGENCY d.o.o.**, Općina Ilidža, 9/2026. Sadrži situaciju, osnove svih etaža, presjeke, fasade. Str. 1, 25, 26 imaju 3D prikaze — **porijeklo tih prikaza nije moguće utvrditi iz PDF-a** (metapodaci skinuti, Producer: iLovePDF) |
| Prevodi skica (EN, TR), 63 PDF-a po jeziku | `prevodi/EN/PDF`, `prevodi/TR/PDF` | Generisani skriptom `build_translated_plans.py` iz AutoCAD skica |
| Optimizirani tlocrti (WebP) | `_export/riverina-assets.zip → plans/`, već u `riverina-web-main/public/riverina/plans/` | Raster iz AutoCAD PDF-ova |
| Mapa lokacije | `riverina-location-catalog-map.png`, `katalog-reference-assets/location-map.png`, `lokacija.svg` | Bez AI potpisa; izvor podloge nepoznat (provjeriti licencu ako je izvedena iz Google/Apple mapa) |
| Katalozi (BS/EN/TR/AR, sa i bez ALYASIN) | `Katalog/`, `Katalog AlYasin/`, `Riverina-Objekat-1/` | Gotovi PDF-ovi; koriste iste AI slike kao gore. Ne diramo |

## 3. Podaci o stanovima (Riverina 1)

Iz `apartments.json` / `units.json` (izvedeno iz AutoCAD skica):

- **63 stana**: spratovi 1–4 po 14 stanova, sprat 5 sa 7 stanova. Prizemlje je poslovni prostor (osnova u idejnom projektu).
- **9 tipova** (neto površina, broj spavaćih soba, broj stanova):

| Površina m² | Spavaće | Kom. | Tlocrt/ikona u `katalog-reference-assets` |
|---|---|---|---|
| 46,44 | 1 | 8 | `s-p46.png`, `i-r46.jpeg` |
| 49,55 | 1 | 28 | `s-p49.png`, `i-r49.jpeg` |
| 66,15 | 2 | 16 | `s-p66.png`, `i-r66.jpeg` |
| 73,93 | 2 | 4 | `s-p73.png`, `i-r73.jpeg` |
| 86,37 | 1 | 2 | `s-p86.png`, `i-r86.jpeg` |
| 88,36 | 1 | 1 | `s-p88.png`, `i-r88.jpeg` |
| 96,64 | 2 | 2 | `s-p96.png`, `i-r96.jpeg` |
| 104,35 | 0 (?) | 1 | `s-p104.png`, `i-r104.jpeg` |
| 110,92 | 2 | 1 | `s-p110.png`, `i-r110.jpeg` |

- `units.json` ima i listu prostorija po stanu (naziv + m²). Pojedini nazivi su pogrešno parsirani (npr. „Lođa 4,42/3,31m² Ostava“) — treba čišćenje prije uvoza.
- Stan 104,35 m² ima `spavace: 0` — vjerovatno greška parsiranja. **Provjeriti na skici.**

## 4. AI-generisano (C2PA: OpenAI, `trainedAlgorithmicMedia`) — odobreno za sajt

| Folder | Šta | Kom. |
|---|---|---|
| `Riverina residence/4-slike objekta+/` | Vanjski prikazi zgrade (`objekat 1–8.png`) | 8 |
| `Riverina residence/5-slike naselja+/` | Naselje, zračni, noćni, bazen, ulice | 23 (7.png i 8.png su identični) |
| `Riverina residence/3-stanovi enterijer/` | Enterijeri | 10 |
| `Riverina residence/2-stanovi 3d osnova/SKICE 3D/` + `prevodi/*/3D/` | 3D tlocrti stanova (21 + prevodi) | 21 × 3 |
| `Riverina residence/` korijen: `2-materijalizacija`, `3-koncept`, `4/5/6-nocni prikaz naselje`, `7-poslovni ugostiteljstvo`, `8/9-poslovni kancelarije` | Koncept/materijali/poslovni | 8 |
| `KADROVI-ZA-VIDEO/`, `KADROVI-v2/` (+ `REZERVA`) | Kadrovi za video (kopije gornjih + novi) | ~28 |
| `katalog-output/assets/images`, `katalog-redesign/assets/images` | Kopije gornjih slika | — |
| `katalog-reference-assets/i-obj*, i-nas*, i-noc*, i-in*, i-pos*, i-r*` | Smanjene kopije gornjih (metapodaci skinuti pri obradi, ali isti sadržaj) | — |
| `riverina-web-main/public/riverina/objekat/`, `.../naselje/` | **Već commitano u GitHub repo** (commit `49e98d9`) | 31 |

Napomena: C2PA `trainedAlgorithmicMedia` znači da je slika izašla iz generativnog modela; ChatGPT isti potpis daje i kad se uploada pravi render pa „doradi“. Zato iz metapodataka ne mogu reći je li to (a) potpuno izmišljen koncept ili (b) AI-doradjen arhitektov render. Vizuelno, `objekat 1.png` vrlo liči na prikaz sa naslovnice idejnog projekta, ali nije isti piksel-po-piksel.

Zračni prikaz naselja (`5-slike naselja+/1.png`) pokazuje ~10 zgrada uz rijeku — to je **AI interpretacija**, ne masterplan. Za interaktivni masterplan vlasnik priprema vlastitu podlogu i oznake.

## 5. Ostalo / upitno

| Materijal | Status |
|---|---|
| `AI-kadrovi/zgrada1-referenca-1..4.jpg` | Ime foldera kaže AI; C2PA ima samo Claude „opened“ zapis. Isti hash kao `KADROVI-v2/04,05`. **Tretirati kao AI** |
| `Riverina-dron-3D-30s.mp4`, `Riverina-video-30s.mp4` | Napravljeni iz AI kadrova (folderi `KADROVI-*`). Metapodaci ne otkrivaju alat. **Tretirati kao AI** dok se ne potvrdi |
| `Social media/naselje.jpg`, `obj_int.jpg` | Bez C2PA; sadržaj vjerovatno iz istih AI slika. Upitno |
| **Logo** `Riverina-logo/Riverina-logo.png` | **C2PA: OpenAI** — logo je generisan u ChatGPT-u. `logo-transparent.PNG` (bez potpisa) je izveden iz njega. `katalog-reference-assets/i-logo_*.png`, `i-mark*.png` su obrađene verzije. Ovo je zvanični logo po briefu, ali vlasnik treba znati porijeklo (pitanje zaštite žiga / vektorske verzije) |
| `logo ideas/` | AI varijante logoa — ne koristiti |
| `AlYasin Logo/ALYASINGROUP2.pdf`, `AlYasin.jpeg` | Logo investitora. PDF je vjerovatno vektor — koristiti njega |
| `Reference/` (Chelsea, Rise, Safa Gate, SkyHills, Wadi Hills brošure) | Tuđi materijali, samo inspiracija. Ne koristiti na sajtu |
| `riverina-web-main/public/demo/` | Shematski demo crteži (generisani za testiranje editora), nisu projekat |
| `katalog-reference-assets/i-sw_*`, `i-tex_night`, `i-ph_*` | Uzorci materijala/teksture, izvedeni iz AI slika materijalizacije. Upitno |

## 6. Šta fali za sajt

- [ ] Masterplan, 360° uglovi i poligoni — **radi vlasnik kroz CMS** (sajt mora samo podržati upload i editor)
- [ ] Osnove spratova Riverine 1 kao čiste slike (postoje u idejnom PDF-u, str. 13–18 — mogu se izvesti iz PDF-a)
- [ ] Vektorski logo Riverina (SVG/PDF) i potvrda finalne verzije
- [ ] Odnos investitora: idejni projekat kaže **ESU AGENCY d.o.o.**, brief kaže **ALYASIN Group** — koje ime ide na sajt i u kakvom odnosu su
- [ ] Cijene, rokovi izgradnje, sadržaji kompleksa (bazen, wellness, igralište vide se samo na AI slikama — nisu potvrđeni u tehničkoj dokumentaciji)
- [ ] Tačna adresa / lokacija parcele, udaljenosti (ništa od ovoga ne izmišljamo)
- [ ] Kontakt podaci prodaje (telefon, e-mail, radno vrijeme)

## 7. Šta ide na sajt

1. Tlocrti iz AutoCAD skica (`public/riverina/plans/*.webp`) i PDF-ovi skica (BS/EN) — za stranicu stana.
2. Podaci o 63 stana iz `units.json` (nakon čišćenja) — uvoz kroz postojeći CSV import u CMS-u.
3. Logo (`logo-transparent.PNG` / `i-logo_light.png`) uz napomenu o porijeklu.
4. AI vizuali (zgrada, naselje, enterijer, 3D tlocrti) — odobreni; idu u Supabase Storage / `public/` kao WebP/AVIF, uređivi kroz CMS.
