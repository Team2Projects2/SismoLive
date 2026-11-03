// "Chile y alrededores" tab: Chile plus nearby areas, not the whole world.
export const REGION_CHILE = { latMin: -60, latMax: -15, lngMin: -82, lngMax: -62 } as const;

export function esChile(lugar: string): boolean {
  return /chile/i.test(lugar);
}
