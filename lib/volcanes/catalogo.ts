import datos from "./catalogo.json";
import type { Volcan } from "./mapear";

// Our own list of volcanoes in Chile and nearby countries with a documented eruption. Seeded from Smithsonian GVP
// (`npm run volcanes:catalogo`) and maintained by hand with SERNAGEOMIN reports.
export type EntradaCatalogo = Pick<Volcan, "nombre" | "pais" | "lat" | "lng" | "alturaMsnm" | "tipo" | "ultimaErupcion">;

export const CATALOGO: EntradaCatalogo[] = datos;

// RNVV and GVP coordinates for the same volcano differ by a few km (summit vs. complex center).
const DISTANCIA_MAX_KM = 20;

function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function volcanesDelCatalogo(catalogo: EntradaCatalogo[] = CATALOGO): Volcan[] {
  return catalogo.map((e) => ({ ...e, region: null, nivel: null, rankingRiesgo: null, actualizado: null }));
}

function masCercano(v: Volcan, catalogo: EntradaCatalogo[]): EntradaCatalogo | null {
  let mejor: EntradaCatalogo | null = null;
  let mejorKm = DISTANCIA_MAX_KM;
  for (const e of catalogo) {
    const km = distanciaKm(v, e);
    if (km <= mejorKm) {
      mejor = e;
      mejorKm = km;
    }
  }
  return mejor;
}

// RNVV only covers Chile's monitored volcanoes. Adds the catalog ones it does not cover
// (neighbors such as Sabancaya or Payún Matrú) without an activity level.
export function combinarConCatalogo(volcanes: Volcan[], catalogo: EntradaCatalogo[] = CATALOGO): Volcan[] {
  const faltantes = catalogo.filter((e) => !volcanes.some((v) => distanciaKm(v, e) <= DISTANCIA_MAX_KM));
  return [...enriquecerConCatalogo(volcanes, catalogo), ...volcanesDelCatalogo(faltantes)];
}

// Fills the fields RNVV does not send (last eruption, and type/altitude if missing) from the
// nearest catalog entry. RNVV values win, except the country: the catalog knows which volcanoes
// are shared with Argentina or Bolivia.
export function enriquecerConCatalogo(volcanes: Volcan[], catalogo: EntradaCatalogo[] = CATALOGO): Volcan[] {
  return volcanes.map((v) => {
    const e = masCercano(v, catalogo);
    if (!e) return v;
    return {
      ...v,
      pais: e.pais ?? v.pais,
      alturaMsnm: v.alturaMsnm ?? e.alturaMsnm,
      tipo: v.tipo ?? e.tipo,
      ultimaErupcion: v.ultimaErupcion ?? e.ultimaErupcion,
    };
  });
}
