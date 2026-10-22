// Buildings with status "draft" are work in progress in the CMS: they never reach the public site.

type Scenes = { masterplan?: any; buildings?: any[] };
type Unit = { building?: string };

/** Scenes and units without draft buildings (and without the units of those buildings). */
export function withoutDrafts<S extends Scenes, U extends Unit>(scenes: S, units: U[]): { scenes: S; units: U[] } {
  const buildings = scenes.buildings || [];
  const draft = new Set(buildings.filter((b) => b && b.status === 'draft').map((b) => b.id));
  if (!draft.size) return { scenes, units };
  return {
    scenes: { ...scenes, buildings: buildings.filter((b) => !draft.has(b.id)) },
    units: units.filter((u) => !draft.has(u.building)),
  };
}
