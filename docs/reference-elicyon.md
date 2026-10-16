# Referenca: elicyon.com — analiza dizajn jezika

Pregledano 16. 10. 2026, desktop 1440×900 i mobile 375×812. Uzimamo **jezik dizajna**, ne sadržaj: nikakve slike, tekstovi, logo, fontovi ni kod se ne prenose.

## 1. Grid i ritam

- Tailwind-bazirano, 12-kolonski grid (`md:grid-cols-12`), bočni padding 20px mobile / 32px desktop.
- Sekcije razdvojene velikim vertikalnim razmakom: `pt-100` / `lg:pt-160` px, plus cijele sekcije visine ekrana (`h-screen min-h-[830px]`).
- Ukupna visina početne ~14.000 px na desktopu: malo sadržaja, puno zraka, dugi „pinned" dijelovi.
- Kompozicija je asimetrična: tekst centriran ili pomaknut, slike razbacane po rubovima (kolaž), nikad klasična mreža kartica osim u „Insights".

## 2. Tipografija

| Uloga | Font | Veličina (desktop) | Detalji |
|---|---|---|---|
| Hero naslov | vlastiti display serif („Elicyon") | 108px / 1.15 | 3 riječi u 3 reda, svaki red horizontalno pomaknut (stepenasto) |
| Manifest | isti display serif | 48px / 1.2 | Miješanje VELIKIH i malih riječi u istoj rečenici; naglašene riječi su UPPERCASE |
| Naslovi sekcija | display serif | 48px | Dvodijelni: „OUR / SERVICES", „LEADING / the VISION", „The WORLD / of ELICYON". Drugi red uvučen udesno |
| Ogromne riječi preko slike | display serif | ~158px | Slova široko razmaknuta (I N T E R I O R), otkrivaju se pri scrollu |
| Navigacija, labele | sans („Antique Legacy") | 14px | UPPERCASE, tracking 0.15em (2.1px) |
| Tekst / forma | sans | 14–16px | normalan tracking, mala kontrast-hijerarhija |
| Pravni sitni tekst | sans | 10px | UPPERCASE, 50% opacity |

Zaključak: **dva fonta** — jedan dekorativni serif za sve što je veliko, jedan miran sans za sve sitno. Bez kurziva i bez bold-a; hijerarhija se gradi samo veličinom i UPPERCASE ritmom. Kod nas: Cormorant Garamond (display) + Manrope (tekst) daju istu logiku.

## 3. Paleta

- Pozadina: topla papirna `rgb(244 242 238)`.
- Tekst: crna.
- Jedan zasićeni akcent: periwinkle plava `rgb(110 137 200)`, korišten **samo** za preloader, meni overlay, cookie banner i footer. To je cijela „boja" brenda.
- Fotografije nose svu ostalu boju.

Kod nas: ivory/papir pozadina + navy kao velika površina (preloader, meni, footer) + zlatna samo kao tanak akcent (linkovi, fokus, crtice).

## 4. Meni

- Desktop: minimalni header — linkovi lijevo, logo centrirano, „CONTACT US" desno; bijeli tekst preko hero slike.
- Mobile: „MENU" lijevo, logo u sredini, „CONTACT" desno.
- Klik na Menu → **full-screen overlay u akcent boji**, centrirane velike serif stavke (≈40px), dole lijevo društvene mreže, desno pravni linkovi, sasvim dole sitni copyright. „MENU" se pretvara u „CLOSE".

## 5. Preloader i prijelazi stranica

- Pri učitavanju cijeli ekran prekriva akcent-plava zavjesa, zatim se podiže i otkriva hero (≈1–2 s).
- Hero riječi ulaze jedna po jedna (stepenasto).
- Izmjerene tranzicije: `cubic-bezier(0.77, 0, 0.175, 1)` 0.5–0.8 s za velike pokrete; `cubic-bezier(0.4, 0, 0.2, 1)` 0.2–0.3 s za hover/opacity. Bez bounce-a.

## 6. Scroll animacije

1. **Manifest (pinned, ~3400px scrolla):** paragraf stoji, riječi se pale/gase redom kako se scrolla, a oko njega 4–6 portretnih fotografija pluta različitim brzinama (parallax kolaž).
2. **Kategorije:** full-screen slika, preko nje ogromna riječ razmaknutih slova koja se otkriva slovo po slovo; mali „VIEW PROJECTS" link pri vrhu.
3. **Usluge:** dvodijelni naslov + 3 portretne slike stepenasto (srednja niža), naziv usluge preko slike.
4. **„Leading the vision":** pozadinska fotografija s portretnom slikom tima u sredini i tekstom ispod.
5. **„Objects of desire":** horizontalni slider, centralna slika veća i uokvirena, bočne manje; ispod naziv (UPPERCASE sans) i kratki opis.
6. **Insights:** mreža 3 kartice s naslovom i kategorijom.

## 7. Hover na slikama

- Spori zoom slike unutar fiksnog okvira i blaga promjena opacity labele (0.25–0.5 s, ease-out). Ništa ne skače, nema sjena.

## 8. Footer

- Iznad footera: velika slika s centriranim blokom „REFINED VISION MEETS / EXTRAORDINARY EXECUTION".
- Footer u akcent boji: lijevo dvodijelni naslov + newsletter forma (ime, prezime, e-mail, GDPR checkbox s linkom na privacy policy, tekstualno dugme „SUBMIT FORM" podvučeno), sredina navigacija, desno mreže.
- Inputi: samo donja linija, bez okvira, bez zaobljenja.

## 9. Mobile

- Isti jezik; hero naslov ide u 3 reda preko cijele visine slike.
- Header uvijek 3 elementa (Menu / logo / Contact).
- Kolaž se pojednostavljuje na manje slika; slider postaje swipe.

## 10. Šta prenosimo, a šta ne

| Prenosimo (jezik) | Ne prenosimo |
|---|---|
| Full-bleed hero, stepenasti serifni naslov u miješanom UPPERCASE/lowercase ritmu | Njihove slike, tekstove, logo |
| Manifest paragraf s naglašenim riječima + parallax kolaž portreta | Njihove fontove (Elicyon, Antique Legacy su licencirani) |
| Dvodijelni naslovi sekcija | Njihov kod i tačne izmjere sekcija |
| Velike slike kategorija s overlay naslovom i diskretnim linkom | Periwinkle plavu (naš akcent je navy, zlatna samo kao detalj) |
| Horizontalni slider detalja s centralnim fokusom | Newsletter (kod nas forma za upit) |
| Full-screen meni overlay, minimalni header | |
| Footer blok u boji brenda s formom i GDPR checkboxom | |
| Spori ease-out prijelazi 600–1200 ms, bez bounce-a | |
