import type { NivelVolcan, Volcan } from "./mapear";

export type PuntoProyectado = { x: number; y: number; volcan: Volcan };

export type GrupoVolcanes = {
  nivel: NivelVolcan | null;
  volcanes: Volcan[];
  lng: number;
  lat: number;
};

export type Agrupacion = { sueltos: Volcan[]; grupos: GrupoVolcanes[] };

// Only calm volcanoes (EAV 0-1) and those without a level are grouped; active ones must always
// stay visible on their own.
export const NIVEL_MAX_AGRUPABLE = 1;
export const RADIO_GRUPO_PX = 40;

// Zoomed out, the whole country fits on screen and the cones pile up: group much more
// aggressively there, and relax to RADIO_GRUPO_PX once the view is regional.
const RADIO_LEJOS_PX = 110;
const ZOOM_LEJOS = 4;
const ZOOM_CERCA = 7;

export function radioPorZoom(zoom: number): number {
  const t = Math.min(1, Math.max(0, (zoom - ZOOM_LEJOS) / (ZOOM_CERCA - ZOOM_LEJOS)));
  return Math.round(RADIO_LEJOS_PX + (RADIO_GRUPO_PX - RADIO_LEJOS_PX) * t);
}

function cerca(a: PuntoProyectado, b: PuntoProyectado, radio: number): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= radio;
}

function crearGrupo(volcanes: Volcan[]): GrupoVolcanes {
  const n = volcanes.length;
  return {
    nivel: volcanes[0].nivel,
    volcanes,
    lng: volcanes.reduce((s, v) => s + v.lng, 0) / n,
    lat: volcanes.reduce((s, v) => s + v.lat, 0) / n,
  };
}

export type Limites = [[oeste: number, sur: number], [este: number, norte: number]];

export function limitesGrupo(grupo: GrupoVolcanes): Limites {
  const lngs = grupo.volcanes.map((v) => v.lng);
  const lats = grupo.volcanes.map((v) => v.lat);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

// Greedy screen-space clustering: each unassigned point seeds a group and absorbs every other
// unassigned point of the same level within `radio` pixels of the seed.
export function agruparVolcanes(puntos: PuntoProyectado[], radio = RADIO_GRUPO_PX): Agrupacion {
  const sueltos: Volcan[] = [];
  const grupos: GrupoVolcanes[] = [];
  const asignado = new Array<boolean>(puntos.length).fill(false);

  puntos.forEach((semilla, i) => {
    if (asignado[i]) return;
    asignado[i] = true;
    if ((semilla.volcan.nivel ?? 0) > NIVEL_MAX_AGRUPABLE) {
      sueltos.push(semilla.volcan);
      return;
    }
    const miembros = [semilla.volcan];
    for (let j = i + 1; j < puntos.length; j++) {
      const otro = puntos[j];
      if (asignado[j] || otro.volcan.nivel !== semilla.volcan.nivel) continue;
      if (!cerca(semilla, otro, radio)) continue;
      asignado[j] = true;
      miembros.push(otro.volcan);
    }
    if (miembros.length > 1) grupos.push(crearGrupo(miembros));
    else sueltos.push(semilla.volcan);
  });

  return { sueltos, grupos };
}
