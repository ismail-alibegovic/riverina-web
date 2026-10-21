# Riverina Residence: creative direction correction

Status: **direction approved 21 Oct 2026 with refinements (below).** Phase 1 (hero, manifesto, architectural presentation) is built on `feat/editorial-direction` and waiting for review. Sections 4–8 wait for that review.
Inspected 21 Oct 2026 in the built-in Chromium at 1440×900 and 375×812: elicyon.com (live) and riverina-web.vercel.app (live, `main` @ 2651716).

---

## 1. Elicyon, section by section (verified live)

Page height about 13,960 px on desktop. Stack: Next.js, Tailwind, Lenis, GSAP ScrollTrigger.

| # | Section | Composition | Motion | What it actually does |
|---|---|---|---|---|
| 0 | Preloader | Periwinkle field with the logotype centred | Logotype letters arrive, curtain lifts | Sets the one brand colour before any photograph appears |
| 1 | Hero (900 px) | Full-bleed **interior** photo. Three words ("TIMELESS / TAILORED / SPACES") stepped left → right → centre, about 108 px, white | Words arrive one by one | Nothing else sits on top: no button, no subtitle, no badge. Header is just links, logo and Contact at 14 px |
| 2 | Manifest (pinned, about 3,400 px of scroll) | Paper background. A centred paragraph at about 48 px, mixing UPPERCASE and lowercase **inside one sentence**. Four small photos (about 220 px wide) are placed off-grid at the four corners | Words fade from grey to black in reading order. Each photo drifts at its own speed | The first large type on paper is a **sentence**, not a heading. The photos are small, so the type dominates |
| 3 | Projects (about 3,900 px) | Small two-line title ("OUR / PROJECTS") on paper, then three full-bleed project photos that stack (sticky). Each carries one giant word (RESIDENTIAL, DEVELOPMENT …) and a small serif project name bottom-right with "view project" | The giant word's letters start scattered vertically and gather into the word as you scroll | The giant type is a **category name** set over a calm, centred room photo with a lot of wall space. The caption is editorial: name plus link, never a badge |
| 4 | Services | Two-line title left. A 14 px paragraph in a narrow column. **Three small portrait photos in a stepped row** (the middle one lower), each labelled in small caps over the image. A second narrow paragraph at bottom-right | Gentle reveal | A sudden drop in scale: after full-bleed photos comes a page of small images and small text. **This contrast is the core of the rhythm** |
| 5 | Leading the Vision | Dimmed full-bleed background photo with one framed portrait centred and the title stepped across its top edge. Text under the portrait | Parallax on the background | A frame inside a frame (photo on photo) |
| 6 | World of Elicyon | Two-line title, link at right, three press cards (image, category, title, "read more") | None notable | The only card grid on the page, and it is the least important content |
| 7 | Objects of Desire | Centred title. Five images in a row; the centre one is larger and **matted in terracotta**. Name and description centred under it | Carousel | Product focus: one object at a time |
| 8 | Get in touch | Full-bleed photo. An **ivory passe-partout card** whose inner window is cut out to show the same photo behind it. Text above and below the window | Background parallax | The CTA is a framing device, not a button bar |
| 9 | Footer (900 px) | Periwinkle field: two-line title plus a newsletter form with underline inputs, a list of links, social links. The logotype spans the full width at the bottom | Letters rise | The brand colour appears again, closing the loop with the preloader |

**Mobile (375 px):** the same three hero words stack over the full height. The manifest keeps one or two small photos with the sentence centred. Project panels become full-height portrait photos with the name bottom-left and dot pagination. Header is MENU / logo / CONTACT.
**Not verified today:** the mobile menu overlay did not open from emulated clicks (it seems to need a real touch event). The notes in `docs/reference-elicyon.md` (16 Oct) describe it as a full-screen overlay in the accent colour; I did not re-check that today.

### The design thinking underneath (what to take, not what to copy)

1. **One big gesture per screen, and the next screen answers it in the opposite scale.** Full-bleed is followed by small; giant type is followed by 14 px text.
2. **Type and image never fight.** Giant words appear only where the photo has quiet space (walls, sky), and the photos are calm, centred interiors.
3. **Captions are editorial.** A small serif name and a link sit in the corner. There is no UI chrome on photos.
4. **Each section has its own device:** stepped words, a lit-up sentence, gathering letters, a stepped triptych, a frame within a frame, a matted object, a passe-partout. None repeats.
5. **One brand colour, used only at the beginning and the end** (preloader, menu, footer). The photography carries everything in between.
6. **The content drives the device.** Elicyon is an interior studio, so the page moves through rooms, people and objects.

---

## 2. Why Riverina falls short today

Seen on the live site at 1440 and 375:

1. **It traces Elicyon instead of translating it.** The sections map one to one: stepped hero → pinned manifest with four floating photos → sticky panels with giant letters (ARHITEKTURA / ENTERIJER / LOKACIJA) → dimmed background with a framed portrait ("Moderno življenje uz rijeku") → centre-focus carousel with a terracotta mat → "Svijet Riverine" cards → closing statement → coloured footer with a giant wordmark. Without Elicyon's reasons behind them, these read as a template.
2. **It took Elicyon's brand colour.** The footer is `--river: #8497c2` (`app/home.css:373`), a periwinkle very close to Elicyon's `rgb(110 137 200)`. Riverina's own colours (navy `#14213a` and the gold ribbon of the R mark) barely appear. Gold is almost absent from the page.
3. **The devices suit interiors, and Riverina's imagery is architecture.** Our renders are wide, busy and blue-hour, with cars, balconies and many window lines. Giant spaced letters over a facade collide with the balcony grid ("ARHITEKTURA" across the top storeys). Elicyon puts its giant words over plain walls.
4. **Six full-screen renders and almost no change of scale:** hero, three sticky panels, the vision background and the statement background. There is never a page of small images and small text to rest on, so the big moments cancel each other out. This is exactly the "repetitive full-screen hero sections" the brief forbids.
5. **The hero is crowded:** a huge two-line wordmark over a busy facade, plus an "ILUSTRACIJA / IDEJNI PRIKAZ" badge, a subtitle, a filled button and a link. Elicyon's hero has three words and nothing else.
6. **The core product is a generic card grid.** "Kolekcija stanova" is nine identical cards in three columns with filter chips. On mobile that is about nine screens of near-identical cards (mobile page height 15,173 px). The thing people come to buy gets the least art direction.
7. **The illustration badge is UI chrome.** A dark pill sits on top of every render. We have to label renders, but the label can be a quiet caption line, the way Elicyon captions projects.
8. **Generic motion:** almost every block uses the same clip or rise reveal. Only the manifest and the category letters do something specific to their content.
9. **Observed defects:** in a scroll pass at 1440, the "Svijet Riverine" section showed a large blank band before its cards appeared. On mobile, the first screen shows the logo and the building but no hero title.
10. **The brand idea is unused.** The logo is a navy R wrapped in a gold, river-like ribbon and leaf. Nothing on the page draws on the river, the ribbon or the building's own architecture (rhythm of floors, ground-floor retail, a 24-frame turntable already in the CMS).

---

## 3. New homepage structure

Concept: **"Aperture & Ribbon."** Architecture is framing, and Riverina is named after the river.
- **Aperture:** rectangular windows in the paper or navy field that open, crop and frame the renders. This replaces the full-bleed-after-full-bleed rhythm.
- **Ribbon:** one fine gold line taken from the R mark's ribbon. It threads through the page, draws itself as you scroll and connects the chapters, then resolves into the R mark in the footer. It is Riverina's own signature move, not a borrowed one.

Story: river → building → homes → interiors → place → people behind it → you.

| # | Chapter (CMS key) | Composition | Signature device |
|---|---|---|---|
| 0 | Intro | Navy field. The R mark is revealed by a gold mask wipe, then the wordmark appears; under 1.6 s, once per session | Navy plus gold from frame one (no periwinkle) |
| 1 | **Hero: Aperture** (`hero`) | Navy field. The render sits in a tall **inset window** (about 46% wide, right of centre). The title is set in two stepped lines that **cross the window edge**: part on navy, part on the image. Eyebrow "Ilidža · Sarajevo" at top-left, a small caption bottom-right ("Riverina 1 · ilustracija"), one text link. No pill, no filled button | On scroll the window grows to full-bleed while the title drifts up and fades: one controlled full-bleed moment instead of six |
| 2 | **Manifest: Ribbon** (`manifest`) | Paper field. The sentence is **left-aligned** across 8 of 12 columns (not centred), with UPPERCASE emphasis kept. **Two** images only: a tall portrait at the right edge and a small one low-left. Under the sentence is a strip of **verified figures** in small labels and large serif numerals: 63 stanova · 9 tipova · 46,44–110,92 m² · P+5 | Words light up in reading order (kept). The gold ribbon enters from the hero and underlines the sentence |
| 3 | **The building** (`categories` → becomes "Zgrada") | Pinned. On the left, a narrow column with "Riverina 1", short text, and a hairline floor list that lights up in sync (Prizemlje: poslovni prostor · 1.–4. sprat: 14 stanova · 5. sprat: 7 stanova, all from the database). On the right, the building **turns** as you scroll, using the CMS 360° views already used by the selector | Scroll-scrubbed turntable. It replaces the three giant-letter panels and exists only because Riverina has these frames |
| 4 | **Homes: Index** (`types`) | An **architectural catalogue index** instead of nine cards: rows A–I with the type letter, area in large serif numerals, bedrooms, outdoor area and live availability. On desktop, a sticky frame at the right shows the 3D plan of the row you hover or focus. On mobile, tapping a row opens it with the plan inline. Filters stay as quiet text tabs | Plan crossfade inside a fixed aperture. About 1.5 screens in place of about 9 on mobile |
| 5 | **Interiors: Triptych** (`details`) | Change of scale: a two-line title left and a narrow 15 px paragraph. **Three portrait interiors in a stepped row** (middle one lower) that becomes a horizontal track when there are more than three; captions sit under each image as a number and name | Horizontal scrub on desktop, swipe on mobile |
| 6 | **Place** (`vision` → becomes "Ilidža / Lokacija") | The aerial render in a **landscape aperture** framed by paper on all sides, with the gold ribbon drawn along the river. To the right, an editorial list of location points from the CMS (left empty, not invented, where the CMS has none) | The ribbon traces the river: the brand mark meets the real place |
| 7 | **Closing: Passe-partout** (`statement`) | Dusk facade render. An ivory card with a cut-out window shows the render, with the CTA line ("Odaberite stan") plus phone and e-mail from the CMS | Frame within frame. This is the only borrowed device, recoloured into Riverina's palette |
| 8 | **Footer** | **Navy**, not periwinkle. The existing lead form with underline inputs and GDPR checkbox, nav, contact. At the bottom, the R mark drawn as a gold hairline instead of a giant wordmark | The ribbon ends here |

`world` (the cards) is hidden by default and its links move to the menu and footer. `gallery`, `location`, `investor` and `contact` stay switchable in the CMS with the new styling. Section keys don't change, so CMS ordering and visibility keep working.

---

## 4. Visual and motion direction

**Palette:** navy `#14213a` for the large surfaces (intro, hero field, menu, footer). Paper `#fbf8f2` and ivory `#f6f1e7` for the reading chapters. Gold `#b8955a` only for the ribbon, hairlines, numerals and focus. `--river` is removed.
**Type:** Cormorant Garamond (display, numerals) and Manrope (labels and body), as now. New rule: **only one display size above 64 px per screen.** Body text drops to 15–16 px in narrow 36–44ch columns. Labels are 11–12 px uppercase with 0.16em tracking.
**Grid:** 12 columns, 32 px gutter on desktop and 20 px on mobile. Compositions deliberately sit off-centre (columns 2–9, 7–12 and so on). No centred hero.
**Captions:** the "Ilustracija / idejni prikaz" notice becomes an 11 px caption line under or beside each aperture. It stays visible, which keeps the legal point, but it is no longer a pill.
**Motion:** three signature moves (aperture growth, ribbon draw, building turntable) plus one shared reveal: a mask wipe at 900 ms `cubic-bezier(.77,0,.175,1)` with 60 ms stagger. No bounce and no fades on every element. Lenis stays the only scroll engine.
**Reduced motion:** apertures render at their final size, the ribbon is shown already drawn, the turntable shows its default angle with prev/next buttons, nothing is pinned, and the intro is skipped.
**Performance:** the turntable frames lazy-load near the viewport and are drawn into a single `<img>` with a preloaded queue. The ribbon is inline SVG (no canvas, no WebGL). The hero image keeps `priority`.

---

## 5. Implementation plan

**Redesign** (presentation only):
- `components/home/Hero.tsx`: aperture hero
- `components/home/Manifest.tsx`: left-aligned, two images, verified figures strip
- `components/home/Categories.tsx` → new `Building.tsx` (turntable chapter); the categories key renders it
- `components/home/Types.tsx`: catalogue index with sticky plan frame (same data and the same `typeCards()` output)
- `components/home/Details.tsx` → `Triptych`
- `components/home/Vision.tsx` → `Place` with the ribbon over the aerial render
- `components/home/Statement.tsx`: passe-partout
- `components/site/Footer.tsx`, `Header.tsx`: navy, R-mark ribbon, header states
- new `components/home/Ribbon.tsx` (SVG path, scroll-drawn)
- `app/home.css`: rewritten; `app/globals.css`: token cleanup (drop `--river`, add the caption style)

**Preserve unchanged:** `lib/content.ts` and all Supabase data (units, prices, statuses, scenes), the section order and visibility mechanism, `/stanovi` and the selector (`lib/selector`, `selector.css`), `/api/lead`, `ContactForm` logic, the i18n routes `/` and `/en/...`, the subpages (`components/pages`), the gallery page, JSON-LD and metadata, the CMS at `/admin`, Lenis and `lib/motion.ts`.
**No data changes:** no migrations and no edits to `site_content`. Where a new layout needs a field that doesn't exist yet (for example, a location point list), it renders nothing until the CMS fills it.
**Verification:** a local build, then screenshots at 1440, 768 and 375 of every chapter, placed next to the matching Elicyon screens. Checks for reduced motion, keyboard navigation through the index and turntable, Lighthouse mobile, and that the BS and EN home pages and `/stanovi` still work. Work goes on a branch, `feat/editorial-direction`, with a Vercel preview before anything reaches `main`.

---

## 6. Owner refinements (21 Oct 2026) and phase 1 as built

Refinements: an exceptional cinematic hero; a distinct composition, image treatment and transition for every section; floor plans stay visually prominent in an interactive catalogue (not a text list), with prices and availability only as the existing system allows (`show_price` is currently off); premium, purpose-driven motion; mobile designed in its own right; no changes to data, CMS, routes or integrations. Build and review the first three experiences before continuing; nothing reaches `main` without approval.

| Chapter | Built | Files |
|---|---|---|
| Hero: aperture | Navy field with a 13-line drafting grid. A gold edge is drawn, the window swings open from it, the picture settles from 1.32×, and the title rises line by line: ivory on navy, navy inside the window (two copies, one clipped). The gold ribbon draws in. On scroll the window opens to the full screen (one `--o` progress variable), the title parts, the ribbon flows into the window, and a veil keeps the header legible. On portrait screens the window is a wide frame under the title; the picture sits lower while it is closed (`--shift`), so the window frames the floors. The intro curtain is shortened to 1.4 s and hands over on the same navy | `components/home/Hero.tsx`, `app/editorial.css` |
| Manifesto: paper sheet | Slides over the held hero picture (−60svh overlap). The first figure rides over the sheet's top edge. The sentence lights up in reading order and emphasised words get a gold rule. Figures with numbered captions open upwards, then drift inside their frames. Key figures come live from the unit table (`unitFacts`) on drawn hairlines. The ribbon is scroll-drawn through the margins | `components/home/Manifest.tsx` |
| Architectural presentation | Pinned for 360svh. The CMS 360° views (24 frames) stream in near the section and are drawn on a canvas, making one full turn per scroll. A dial (degrees and ticks), drag-to-turn and arrow buttons with a live readout. The frame opens like shutters, with crop marks. The floor section (5 → P) climbs as the building turns, and each floor links into the apartment finder (`#rvs/r1/floor-N`). It replaces the category panels whenever a building has 360° views | `components/home/Building.tsx`, `components/Site.tsx` |

The header turns solid when the paper sheet reaches it (`[data-hdr-until]`). New UI strings (BS/EN) are in `lib/i18n.ts`. Cormorant italic was added for the second title line. No database, CMS, route or API changes.
