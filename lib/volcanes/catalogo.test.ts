import { describe, expect, it } from "vitest";
import { CATALOGO, combinarConCatalogo, enriquecerConCatalogo, type EntradaCatalogo, volcanesDelCatalogo } from "./catalogo";
import type { Volcan } from "./mapear";

const VILLARRICA: EntradaCatalogo = {
  nombre: "Villarrica",
  pais: "Chile",
  lat: -39.42,
  lng: -71.93,
  alturaMsnm: 2847,
  tipo: "Estratovolcán",
  ultimaErupcion: 2025,
};

function deRnvv(overrides: Partial<Volcan> = {}): Volcan {
  return {
    nombre: "Volcán Villarrica",
    region: "La Araucanía",
    pais: "Chile",
    lat: -39.421,
    lng: -71.939,
    nivel: 2,
    rankingRiesgo: 1,
    alturaMsnm: 2847,
    tipo: null,
    ultimaErupcion: null,
    actualizado: null,
    ...overrides,
  };
}

describe("committed catalog", () => {
  it("has valid entries", () => {
    expect(CATALOGO.length).toBeGreaterThan(40);
    for (const e of CATALOGO) {
      expect(e.nombre).not.toBe("");
      expect(e.lat).toBeGreaterThanOrEqual(-90);
      expect(e.lat).toBeLessThanOrEqual(-15);
      expect(e.pais).not.toBeNull();
    }
  });
});

describe("volcanesDelCatalogo", () => {
  it("returns catalog volcanoes without activity level", () => {
    expect(volcanesDelCatalogo([VILLARRICA])).toEqual([
      { ...VILLARRICA, region: null, nivel: null, rankingRiesgo: null, actualizado: null },
    ]);
  });
});

describe("combinarConCatalogo", () => {
  it("adds catalog volcanoes RNVV does not cover, without level", () => {
    const sabancaya: EntradaCatalogo = { ...VILLARRICA, nombre: "Sabancaya", pais: "Perú", lat: -15.787, lng: -71.857 };
    const resultado = combinarConCatalogo([deRnvv()], [VILLARRICA, sabancaya]);
    expect(resultado.map((v) => [v.nombre, v.nivel])).toEqual([
      ["Volcán Villarrica", 2],
      ["Sabancaya", null],
    ]);
  });
});

describe("enriquecerConCatalogo", () => {
  it("adds the last eruption and type from the nearest catalog entry", () => {
    const [v] = enriquecerConCatalogo([deRnvv()], [VILLARRICA]);
    expect(v).toMatchObject({ nombre: "Volcán Villarrica", nivel: 2, ultimaErupcion: 2025, tipo: "Estratovolcán" });
  });

  it("takes the country from the catalog for shared border volcanoes", () => {
    const [v] = enriquecerConCatalogo([deRnvv()], [{ ...VILLARRICA, pais: "Chile / Argentina" }]);
    expect(v.pais).toBe("Chile / Argentina");
  });

  it("keeps RNVV values over catalog ones", () => {
    const [v] = enriquecerConCatalogo([deRnvv({ tipo: "Estratovolcán compuesto", alturaMsnm: 2860 })], [VILLARRICA]);
    expect(v).toMatchObject({ tipo: "Estratovolcán compuesto", alturaMsnm: 2860 });
  });

  it("leaves volcanoes untouched when no catalog entry is close", () => {
    const lejos = deRnvv({ lat: -45, lng: -73 });
    expect(enriquecerConCatalogo([lejos], [VILLARRICA])).toEqual([lejos]);
  });
});
