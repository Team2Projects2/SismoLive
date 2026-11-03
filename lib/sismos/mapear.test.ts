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

  it.each([
    ["an empty id", { id: "" }],
    ["a non-string id", { id: 42 as unknown as string }],
  ])("discards features with %s", (_, overrides) => {
    expect(featureASismo({ ...feature(), ...overrides })).toBeNull();
  });

  it.each([
    ["NaN magnitude", { mag: Number.NaN }],
    ["infinite time", { time: Number.POSITIVE_INFINITY }],
  ])("discards features with %s", (_, overrides) => {
    expect(featureASismo(feature(overrides))).toBeNull();
  });

  it.each([
    ["latitude above 90", [-71.6, 91, 35]],
    ["latitude below -90", [-71.6, -91, 35]],
    ["longitude above 180", [181, -33, 35]],
    ["longitude below -180", [-181, -33, 35]],
    ["non-finite depth", [-71.6, -33, Number.NaN]],
    ["missing depth", [-71.6, -33]],
  ])("discards features with %s", (_, coordinates) => {
    const f = feature();
    f.geometry.coordinates = coordinates as FeatureUsgs["geometry"]["coordinates"];
    expect(featureASismo(f)).toBeNull();
  });

  it.each([
    ["http", "http://earthquake.usgs.gov/x"],
    ["javascript", "javascript:alert(1)"],
    ["invalid", "not a url"],
  ])("drops %s urls", (_, url) => {
    expect(featureASismo(feature({ url }))?.url).toBeNull();
  });

  it("keeps a null url as null", () => {
    expect(featureASismo(feature({ url: null }))?.url).toBeNull();
  });
});
