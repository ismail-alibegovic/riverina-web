// Floor plans and apartment outlines generated from the architect's sales sheets (scripts/make-floor-plans.py).
// Used by the apartment viewer when a building has no floor plans of its own in the CMS ("Označi stanove").
import data from './floorPlans.json';

export type FloorPlan = { level: number; image: string; w: number; h: number; shapes: { unit: string; pts: [number, number][] }[] };

export const DEFAULT_FLOORS: Record<string, FloorPlan[]> = { r1: data.r1 as FloorPlan[] };
