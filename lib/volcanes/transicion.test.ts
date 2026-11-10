import { describe, expect, it } from "vitest";
import type { Agrupacion, GrupoVolcanes } from "./agrupar";
import type { Volcan } from "./mapear";
import { calcularTransicion, claveGrupo, claveVolcan } from "./transicion";

function volcan(nombre: string, lng: number): Volcan {
  return {
    nombre,
    region: null,
    pais: null,
    lat: 0,
    lng,
    nivel: null,
    rankingRiesgo: null,
    alturaMsnm: null,
    tipo: null,
    ultimaErupcion: null,
    actualizado: null,
  };
}

// 1 degree of longitude = 10 px, so the expected pixel offsets are easy to read.
const proyectar = (lng: number, lat: number) => ({ x: lng * 10, y: -lat * 10 });

const A = volcan("A", 0);
const B = volcan("B", 4);
const GRUPO: GrupoVolcanes = { nivel: null, volcanes: [A, B], lng: 2, lat: 0 };

const SUELTOS: Agrupacion = { sueltos: [A, B], grupos: [] };
const AGRUPADOS: Agrupacion = { sueltos: [], grupos: [GRUPO] };

describe("calcularTransicion", () => {
  it("slides loose volcanoes into a new group", () => {
    const t = calcularTransicion(SUELTOS, AGRUPADOS, proyectar);
    expect(t?.gruposNuevos).toEqual(new Set([claveGrupo(GRUPO)]));
    expect(t?.fantasmas).toEqual([
      { volcan: A, dx: 20, dy: 0 },
      { volcan: B, dx: -20, dy: 0 },
    ]);
    expect(t?.entradas.size).toBe(0);
  });

  it("slides volcanoes out of a group that split", () => {
    const t = calcularTransicion(AGRUPADOS, SUELTOS, proyectar);
    expect(t?.fantasmas).toEqual([]);
    expect(t?.entradas.get(claveVolcan(A))).toEqual({ dx: 20, dy: 0 });
    expect(t?.entradas.get(claveVolcan(B))).toEqual({ dx: -20, dy: 0 });
  });

  it("returns null when the grouping did not change", () => {
    expect(calcularTransicion(AGRUPADOS, { sueltos: [], grupos: [{ ...GRUPO }] }, proyectar)).toBeNull();
    expect(calcularTransicion(SUELTOS, { sueltos: [A, B], grupos: [] }, proyectar)).toBeNull();
  });
});
