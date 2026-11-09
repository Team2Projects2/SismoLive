import type { NivelVolcan } from "./mapear";

// Estado de Actividad Volcánica (EAV), SERNAGEOMIN.
export const NIVEL_ETIQUETA: Record<NivelVolcan, string> = {
  0: "Estado base",
  1: "Inestabilidad menor",
  2: "Inestabilidad mayor",
  3: "Erupción menor",
  4: "Erupción moderada",
  5: "Erupción mayor",
};

// Muted enough to sit on the paper map without competing with the earthquake dots.
export const NIVEL_COLOR: Record<NivelVolcan, string> = {
  0: "#3f6b4f",
  1: "#8a5a12",
  2: "#c2410c",
  3: "#b42318",
  4: "#991b1b",
  5: "#7f1d1d",
};

// Neutral badge for volcanoes whose activity level is unknown.
export const COLOR_SIN_NIVEL = "#78716c";

export function colorNivel(nivel: NivelVolcan | null): string {
  return nivel === null ? COLOR_SIN_NIVEL : NIVEL_COLOR[nivel];
}

export function etiquetaNivel(nivel: NivelVolcan | null): string {
  return nivel === null ? "Sin dato de actividad" : `EAV ${nivel}: ${NIVEL_ETIQUETA[nivel]}`;
}
