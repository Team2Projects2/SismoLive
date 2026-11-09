import type { Volcan } from "./mapear";

export type DatosVolcanes = {
  volcanes: Volcan[];
  // false when the activity source (SERNAGEOMIN) failed and the catalog fallback is shown.
  conActividad: boolean;
};

type Fuente = () => Promise<Volcan[]>;

// Prefers the source with activity levels; falls back to a catalog without them.
// Throws only when both sources fail.
export async function obtenerDatosVolcanes(
  conNivel: Fuente,
  catalogo: Fuente,
  onFallo: (error: unknown) => void = () => {},
): Promise<DatosVolcanes> {
  try {
    return { volcanes: await conNivel(), conActividad: true };
  } catch (error) {
    onFallo(error);
    return { volcanes: await catalogo(), conActividad: false };
  }
}
