import { describe, expect, it } from "vitest";
import { featureAVolcan, mapearGvp } from "./gvp";

function feature(props: Record<string, unknown> = {}) {
  return {
    type: "Feature",
    properties: {
      Volcano_Name: "Villarrica",
      Latitude: -39.42,
      Longitude: -71.93,
      Elevation: 2847,
      Country: "Chile",
      ...props,
    },
  };
}

describe("featureAVolcan", () => {
  it("maps a GVP feature to a volcano without activity level", () => {
    expect(featureAVolcan(feature())).toEqual({
      nombre: "Villarrica",
      region: null,
      lat: -39.42,
      lng: -71.93,
      nivel: null,
      rankingRiesgo: null,
      alturaMsnm: 2847,
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

  it("keeps the volcano when elevation is missing", () => {
    expect(featureAVolcan(feature({ Elevation: null }))?.alturaMsnm).toBeNull();
  });
});

describe("mapearGvp", () => {
  it("drops invalid features and ignores non-collections", () => {
    expect(mapearGvp({ features: [feature(), null, feature({ Latitude: null })] })).toHaveLength(1);
    expect(mapearGvp([])).toEqual([]);
    expect(mapearGvp(null)).toEqual([]);
  });
});
