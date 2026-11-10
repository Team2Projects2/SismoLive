import { describe, expect, it } from "vitest";
import { mapearVolcanes, registroAVolcan } from "./mapear";

function registro(overrides: Record<string, unknown> = {}) {
  return {
    id: 7,
    nombre: "Campo Volcánico Carrán-Los Venados",
    region: "Los Ríos",
    altura_msnm: 1114,
    latitud: "-40.3660000",
    longitud: "-72.0730000",
    tipo_volcan: "Campo Volcánico",
    ranking_riesgo: 6,
    nivel: 0,
    updated_at: "2026-11-03T12:00:15.977Z",
    ...overrides,
  };
}

describe("registroAVolcan", () => {
  it("maps a valid record to the clean shape", () => {
    expect(registroAVolcan(registro())).toEqual({
      nombre: "Campo Volcánico Carrán-Los Venados",
      region: "Los Ríos",
      pais: "Chile",
      lat: -40.366,
      lng: -72.073,
      nivel: 0,
      rankingRiesgo: 6,
      alturaMsnm: 1114,
      tipo: "Campo Volcánico",
      ultimaErupcion: null,
      actualizado: "2026-11-03T12:00:15.977Z",
    });
  });

  it("accepts numeric coordinates", () => {
    const volcan = registroAVolcan(registro({ latitud: -39.42, longitud: -71.93 }));
    expect(volcan?.lat).toBe(-39.42);
    expect(volcan?.lng).toBe(-71.93);
  });

  it.each([
    ["missing nombre", { nombre: undefined }],
    ["empty nombre", { nombre: "  " }],
    ["non-numeric latitud", { latitud: "abc" }],
    ["empty longitud", { longitud: "" }],
    ["latitud out of range", { latitud: "-91" }],
    ["longitud out of range", { longitud: "181" }],
    ["nivel above 5", { nivel: 6 }],
    ["negative nivel", { nivel: -1 }],
    ["fractional nivel", { nivel: 1.5 }],
    ["nivel as string", { nivel: "2" }],
  ])("discards records with %s", (_, overrides) => {
    expect(registroAVolcan(registro(overrides))).toBeNull();
  });

  it("discards non-object values", () => {
    expect(registroAVolcan(null)).toBeNull();
    expect(registroAVolcan("volcan")).toBeNull();
  });

  it("uses null for invalid optional fields", () => {
    const volcan = registroAVolcan(
      registro({ region: 3, ranking_riesgo: "n/a", altura_msnm: null, updated_at: "nope" }),
    );
    expect(volcan).toMatchObject({
      region: null,
      rankingRiesgo: null,
      alturaMsnm: null,
      actualizado: null,
    });
  });
});

describe("mapearVolcanes", () => {
  it("drops invalid rows and keeps valid ones", () => {
    const volcanes = mapearVolcanes([registro(), registro({ nivel: 9 }), null]);
    expect(volcanes).toHaveLength(1);
  });

  it("returns an empty list when the payload is not an array", () => {
    expect(mapearVolcanes({ error: "x" })).toEqual([]);
  });
});
