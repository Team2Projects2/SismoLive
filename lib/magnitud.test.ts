import { describe, expect, it } from "vitest";
import { magnitudMw, richterEstimado } from "./magnitud";

describe("magnitudMw", () => {
  it("keeps one decimal and uses the moment-magnitude label", () => {
    expect(magnitudMw(6.24)).toBe("6.2 Mw");
    expect(magnitudMw(5)).toBe("5.0 Mw");
    expect(magnitudMw(3.06)).toBe("3.1 Mw");
  });
});

describe("richterEstimado", () => {
  it("labels the approximate Richter value", () => {
    expect(richterEstimado(6.24)).toBe("≈ 6.2 Richter");
    expect(richterEstimado(5)).toBe("≈ 5.0 Richter");
  });
});
