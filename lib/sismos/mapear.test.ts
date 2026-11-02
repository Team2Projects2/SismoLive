import { describe, expect, it } from "vitest";
import { featureASismo, type FeatureUsgs } from "./mapear";

function feature(overrides: Partial<FeatureUsgs["properties"]> = {}): FeatureUsgs {
  return {
    id: "us7000abcd",
    properties: {
      mag: 5.4,
      place: "45 km W of Valparaíso, Chile",
      time: 1700000000000,
      url: "https://earthquake.usgs.gov/earthquakes/eventpage/us7000abcd",
      ...overrides,
    },
    geometry: { coordinates: [-71.6, -33.0, 35] },
  };
}

describe("featureASismo", () => {
  it("discards features without magnitude", () => {
    expect(featureASismo(feature({ mag: null }))).toBeNull();
  });

  it("uses a fallback lugar when place is null", () => {
    expect(featureASismo(feature({ place: null }))?.lugar).toBe(
      "Ubicación sin nombre",
    );
  });

  it("maps coordinates in GeoJSON order [lng, lat, depth]", () => {
    const sismo = featureASismo(feature());
    expect(sismo?.lng).toBe(-71.6);
    expect(sismo?.lat).toBe(-33.0);
    expect(sismo?.profundidad).toBe(35);
  });

  it("converts time in ms to an ISO string", () => {
    expect(featureASismo(feature())?.fecha).toBe("2023-11-14T22:13:20.000Z");
  });

  it("copies id, url and magnitud as-is", () => {
    const sismo = featureASismo(feature());
    expect(sismo?.id).toBe("us7000abcd");
    expect(sismo?.url).toBe(
      "https://earthquake.usgs.gov/earthquakes/eventpage/us7000abcd",
    );
    expect(sismo?.magnitud).toBe(5.4);
  });
});
