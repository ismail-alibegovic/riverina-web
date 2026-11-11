# Riverina Residence: the visitor journey (Nov 2026)

Reference: KEY TOWERS corporate website (Behance). Taken from it: two voices in the type (light grotesque plus an italic serif accent), hairline grids for figures, plans on soft tinted panels, round controls, a translucent fact card in the hero and an apartment catalogue with filters. Not taken: its colours (Riverina stays navy, ivory and paper with gold as an accent), its feature claims (Riverina shows only confirmed facts, see `content-todo.md`) and its marketing filler (mockups, social posts).

## One journey, one question per step

| Step | Visitor's question | Where | What answers it |
|---|---|---|---|
| Discover | Where is it, what is it? | Home hero | The river at sunset (the place before the building), "Riverina *Residence*", a fact card: building and units, sizes, sales status |
| Understand | How big, how many? | Intro | One sentence, the project text, four live figures (63 / 9 / 5 / 46–111 m²) from `lib/units.ts` |
| Explore | Which floor, what's free? | Home "Istražite zgradu" → `/stanovi` | The facade with one zone per floor (`lib/facade.ts`); hover shows units and sizes; a click opens the explorer **on that floor** |
| Compare | Which layout suits me? | Home "Devet rasporeda" | Types A–I as a catalogue: plan on sand, 3D on hover, filter by bedrooms; each card opens the explorer list filtered to that type |
| Imagine | How does it feel? | "Moderno življenje *uz rijeku*", interiors | A headline with small pictures between its words, a river panorama, the interiors carousel |
| Locate | Where exactly? | Location | Map and link to `/lokacija` (address and distances wait for confirmed data) |
| Decide | What next? | Statement, footer | The building at evening ("Prostor za vaš *novi početak*"), the enquiry form |

## The explorer (`/stanovi`)

Building → floor → apartment, plus a filterable list, as one client component (`components/explorer/Explorer.tsx`). Moving between the steps is a transition, not a page load: the stage zooms into the chosen floor or apartment, then the next step settles in. Every step has its own URL, which the server renders directly:

| URL | Step |
|---|---|
| `/stanovi` | Building: facade zones and the floor list |
| `/stanovi?sprat=3` (`/en/apartments?floor=3`) | Floor: the architect's floor plate with each apartment outlined by status, a floor rail, the floor's apartments |
| `/stanovi/3-7` (`/en/apartments/3-7`) | Apartment: 2D plan and 3D view (switch, zoom, slight tilt), facts, rooms and areas, key plan (floor plate and building section), interior atmosphere, similar apartments, enquiry sheet tied to the apartment (lead saved with `unit` and `building`), PDF, share link |
| `/stanovi?prikaz=lista`, `?tip=C` | List: filters (bedrooms, floor, type, available only), sorting, cards |

Old links from the previous viewer (`/stanovi#rvs/r1/3-7`) still open the apartment. `/embed` keeps the previous viewer for existing iframes.

## Data

`lib/units.ts` builds one apartment list for the whole site:
1. the unit table in the CMS (status, price, orientation, uploads, hidden units),
2. else the AutoCAD sheets (`lib/sheetAreas.ts`, area printed on each sheet), with the status **"Na upit"**. The site never shows availability it has not read from the database,
3. bedrooms, rooms and the loggia or terrace from the brochure types (`lib/apartmentTypes.ts`).

Orientation and price appear only when the CMS has them (and prices only when switched on).

## Replacing images later

- **Hero, panorama, small pictures, statement:** CMS → Tekstovi sajta (Naslovna, Život, Završna poruka). The layouts crop with `object-fit`, so any wide render works.
- **Building render with floor zones:** `lib/facade.ts`. Change `image`, `w`, `h` and the three columns of floor heights (near corner, side corner, far end). `npm test` checks that the zones stay in order.
- **Floor plates:** CMS → Označi stanove (floor plans saved there replace the generated ones).
- **Plans and 3D views per apartment:** `public/riverina/units/`, `public/riverina/3d/` (scripts in `scripts/`), or a plan upload per apartment in the CMS.
