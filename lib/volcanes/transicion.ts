import type { CSSProperties } from "react";
import type { Agrupacion, GrupoVolcanes } from "./agrupar";
import type { Volcan } from "./mapear";

export type Desplazamiento = { dx: number; dy: number };
export type Proyectar = (lng: number, lat: number) => { x: number; y: number };

// What changed between two groupings, so the layer can animate it instead of jumping:
// - fantasmas: volcanoes that were on their own and now sit inside a group. They are drawn once
//   more where they were and slide (dx, dy) into the group before fading out.
// - gruposNuevos: groups that did not exist before; they pop in.
// - entradas: volcanoes that left a group; they slide out from the group (dx, dy) to their place.
export type Transicion = {
  fantasmas: (Desplazamiento & { volcan: Volcan })[];
  gruposNuevos: Set<string>;
  entradas: Map<string, Desplazamiento>;
};

// CSS custom properties read by the volcan-fusion / volcan-separa keyframes in globals.css.
export function estiloDesplazamiento({ dx, dy }: Desplazamiento): CSSProperties {
  return { "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties;
}

export function claveVolcan(v: Volcan): string {
  return `${v.nombre}-${v.lat}-${v.lng}`;
}

export function claveGrupo(g: GrupoVolcanes): string {
  return `grupo-${g.volcanes.map((v) => v.nombre).join("|")}`;
}

function desplazamiento(desde: Volcan | GrupoVolcanes, hasta: Volcan | GrupoVolcanes, proyectar: Proyectar): Desplazamiento {
  const a = proyectar(desde.lng, desde.lat);
  const b = proyectar(hasta.lng, hasta.lat);
  return { dx: Math.round(b.x - a.x), dy: Math.round(b.y - a.y) };
}

// Returns null when nothing grouped or split (e.g. a plain pan), so nothing re-animates.
export function calcularTransicion(antes: Agrupacion, ahora: Agrupacion, proyectar: Proyectar): Transicion | null {
  const sueltosAntes = new Set(antes.sueltos.map(claveVolcan));
  const grupoAntes = new Map<string, GrupoVolcanes>();
  for (const g of antes.grupos) for (const v of g.volcanes) grupoAntes.set(claveVolcan(v), g);
  const clavesGruposAntes = new Set(antes.grupos.map(claveGrupo));

  const fantasmas: Transicion["fantasmas"] = [];
  const gruposNuevos = new Set<string>();
  for (const g of ahora.grupos) {
    const clave = claveGrupo(g);
    if (clavesGruposAntes.has(clave)) continue;
    gruposNuevos.add(clave);
    for (const v of g.volcanes) {
      if (sueltosAntes.has(claveVolcan(v))) fantasmas.push({ volcan: v, ...desplazamiento(v, g, proyectar) });
    }
  }

  const entradas = new Map<string, Desplazamiento>();
  for (const v of ahora.sueltos) {
    const g = grupoAntes.get(claveVolcan(v));
    if (g) entradas.set(claveVolcan(v), desplazamiento(v, g, proyectar));
  }

  if (fantasmas.length === 0 && gruposNuevos.size === 0 && entradas.size === 0) return null;
  return { fantasmas, gruposNuevos, entradas };
}
