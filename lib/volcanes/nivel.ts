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
