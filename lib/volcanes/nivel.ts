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

export const NIVEL_COLOR: Record<NivelVolcan, string> = {
  0: "#22c55e",
  1: "#eab308",
  2: "#f97316",
  3: "#ef4444",
  4: "#dc2626",
  5: "#991b1b",
};
