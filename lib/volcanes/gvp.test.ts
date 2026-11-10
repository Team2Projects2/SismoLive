import { describe, expect, it } from "vitest";
import { featureAVolcan, mapearGvp, nombreEs, paisEs, tipoEs } from "./gvp";

function feature(props: Record<string, unknown> = {}) {
  return {
    type: "Feature",
    properties: {
      Volcano_Name: "Villarrica",
      Country: "Chile",
      Latitude: -39.42,
      Longitude: -71.93,
      Elevation: 2847,
      Primary_Volcano_Type: "Stratovolcano",
      Last_Eruption_Year: 2025,
      ...props,
    },
  };
}

describe("featureAVolcan", () => {
  it("maps a GVP feature to a volcano without activity level", () => {
    expect(featureAVolcan(feature())).toEqual({
      nombre: "Villarrica",
      region: null,
      pais: "Chile",
      lat: -39.42,
      lng: -71.93,
      nivel: null,
      rankingRiesgo: null,
      alturaMsnm: 2847,
      tipo: "Estratovolcán",
      ultimaErupcion: 2025,
      actualizado: null,
    });
  });

  it.each([
    ["missing name", { Volcano_Name: "" }],
    ["string latitude", { Latitude: "-39.42" }],
    ["out-of-range longitude", { Longitude: 200 }],
  ])("rejects a feature with %s", (_, props) => {
    expect(featureAVolcan(feature(props))).toBeNull();
  });

  it("keeps the volcano when optional fields are missing", () => {
    const volcan = featureAVolcan(feature({ Elevation: null, Last_Eruption_Year: null, Primary_Volcano_Type: "Unknown" }));
    expect(volcan).toMatchObject({ alturaMsnm: null, ultimaErupcion: null, tipo: null });
  });
});

describe("nombreEs", () => {
  it.each([
    ["Chillan, Nevados de", "Nevados de Chillán"],
    ["Hudson, Cerro", "Cerro Hudson"],
    ["Pali-Aike Volcanic Field", "Campo volcánico Pali-Aike"],
    ["Antillanca Volcanic Complex", "Complejo volcánico Antillanca"],
    ["Puyehue-Cordon Caulle", "Puyehue-Cordón Caulle"],
    ["Lascar", "Láscar"],
    ["Osorno", "Osorno"],
    ["Misti, El", "El Misti"],
    ["Payun Matru", "Payún Matrú"],
    ["Tromen Volcanic Plateau", "Meseta volcánica Tromen"],
    ["Huanquihue Group", "Grupo Huanquihue"],
  ])("%s -> %s", (gvp, es) => {
    expect(nombreEs(gvp)).toBe(es);
  });
});

describe("paisEs", () => {
  it("translates single and shared countries", () => {
    expect(paisEs("Peru")).toBe("Perú");
    expect(paisEs("Chile-Argentina")).toBe("Chile / Argentina");
    expect(paisEs("")).toBeNull();
  });
});

describe("tipoEs", () => {
  it("translates singular and plural GVP types", () => {
    expect(tipoEs("Stratovolcano(es)")).toBe("Estratovolcán");
    expect(tipoEs("Pyroclastic cone(s)")).toBe("Cono piroclástico");
    expect(tipoEs("Lava dome(s)")).toBe("Domo de lava");
  });

  it("returns null for unknown or missing types", () => {
    expect(tipoEs("Submarine")).toBeNull();
    expect(tipoEs(undefined)).toBeNull();
  });
});

describe("mapearGvp", () => {
  it("drops invalid features and ignores non-collections", () => {
    expect(mapearGvp({ features: [feature(), null, feature({ Latitude: null })] })).toHaveLength(1);
    expect(mapearGvp([])).toEqual([]);
    expect(mapearGvp(null)).toEqual([]);
  });
});
