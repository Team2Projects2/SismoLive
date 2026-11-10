import { describe, expect, it } from "vitest";
import { agruparVolcanes, RADIO_GRUPO_PX, radioPorZoom, type PuntoProyectado } from "./agrupar";
import type { NivelVolcan, Volcan } from "./mapear";

function volcan(nombre: string, nivel: NivelVolcan, lng = -70, lat = -30): Volcan {
  return {
    nombre,
    region: null,
    pais: null,
    lat,
    lng,
    nivel,
    rankingRiesgo: null,
    alturaMsnm: null,
    tipo: null,
    ultimaErupcion: null,
    actualizado: null,
  };
}

function punto(x: number, y: number, v: Volcan): PuntoProyectado {
  return { x, y, volcan: v };
}

describe("agruparVolcanes", () => {
  it("groups close volcanoes of the same calm level at their centroid", () => {
    const { grupos, sueltos } = agruparVolcanes([
      punto(0, 0, volcan("A", 0, -70, -30)),
      punto(20, 10, volcan("B", 0, -72, -32)),
    ]);
    expect(sueltos).toEqual([]);
    expect(grupos).toHaveLength(1);
    expect(grupos[0].nivel).toBe(0);
    expect(grupos[0].volcanes.map((v) => v.nombre)).toEqual(["A", "B"]);
    expect(grupos[0].lng).toBe(-71);
    expect(grupos[0].lat).toBe(-31);
  });

  it("does not group close volcanoes with different levels", () => {
    const { grupos, sueltos } = agruparVolcanes([
      punto(0, 0, volcan("A", 0)),
      punto(5, 5, volcan("B", 1)),
    ]);
    expect(grupos).toEqual([]);
    expect(sueltos.map((v) => v.nombre)).toEqual(["A", "B"]);
  });

  it("never groups volcanoes with level 2 or higher", () => {
    const { grupos, sueltos } = agruparVolcanes([
      punto(0, 0, volcan("A", 2)),
      punto(1, 1, volcan("B", 2)),
      punto(2, 2, volcan("C", 3)),
      punto(3, 3, volcan("D", 3)),
    ]);
    expect(grupos).toEqual([]);
    expect(sueltos).toHaveLength(4);
  });

  it("does not group volcanoes farther apart than the radius", () => {
    const { grupos, sueltos } = agruparVolcanes([
      punto(0, 0, volcan("A", 1)),
      punto(41, 0, volcan("B", 1)),
    ]);
    expect(grupos).toEqual([]);
    expect(sueltos).toHaveLength(2);
  });
});

describe("radioPorZoom", () => {
  it("groups more when zoomed out and settles at the base radius up close", () => {
    expect(radioPorZoom(3)).toBe(110);
    expect(radioPorZoom(4)).toBe(110);
    expect(radioPorZoom(5.5)).toBe(75);
    expect(radioPorZoom(7)).toBe(RADIO_GRUPO_PX);
    expect(radioPorZoom(12)).toBe(RADIO_GRUPO_PX);
  });
});
