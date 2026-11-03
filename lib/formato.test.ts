import { describe, expect, it } from "vitest";
import { fechaHora, haceTiempo, lugarEs } from "./formato";

describe("fechaHora", () => {
  it("shows the date and 24h time in Chile's time zone", () => {
    // 2026-11-03T01:41Z is 22:41 on 2 Nov in Chile (UTC-3 in summer time).
    const texto = fechaHora("2026-11-03T01:41:27Z");
    expect(texto).toMatch(/2 nov/);
    expect(texto).toMatch(/2026/);
    expect(texto).toMatch(/22:41/);
    expect(texto).toMatch(/hora de Chile/);
  });
});

describe("lugarEs", () => {
  it("writes bearings as plain words", () => {
    expect(lugarEs("29 km SSW of Melipilla, Chile")).toBe("29 km al sur de Melipilla, Chile");
    expect(lugarEs("45 km WSW of Valparaíso, Chile")).toBe("45 km al oeste de Valparaíso, Chile");
    expect(lugarEs("73 km SW of Calama, Chile")).toBe("73 km al suroeste de Calama, Chile");
    expect(lugarEs("10 km W of Ovalle, Chile")).toBe("10 km al oeste de Ovalle, Chile");
  });

  it("maps all 16 bearings to the 8 plain directions", () => {
    const esperado: Record<string, string> = {
      N: "norte", NNE: "norte", NE: "noreste", ENE: "este", E: "este", ESE: "este",
      SE: "sureste", SSE: "sur", S: "sur", SSW: "sur", SW: "suroeste", WSW: "oeste",
      W: "oeste", WNW: "oeste", NW: "noroeste", NNW: "norte",
    };
    for (const [rumbo, palabra] of Object.entries(esperado)) {
      expect(lugarEs(`5 km ${rumbo} of X`)).toBe(`5 km al ${palabra} de X`);
    }
  });

  it("translates coastal prefixes", () => {
    expect(lugarEs("offshore Coquimbo, Chile")).toBe("frente a la costa de Coquimbo, Chile");
    expect(lugarEs("off the coast of Aisen, Chile")).toBe("frente a la costa de Aisen, Chile");
    expect(lugarEs("near the coast of Tarapaca, Chile")).toBe("cerca de la costa de Tarapaca, Chile");
  });

  it("leaves other places untouched", () => {
    expect(lugarEs("Tarapaca, Chile")).toBe("Tarapaca, Chile");
  });
});

describe("haceTiempo", () => {
  const ahora = Date.parse("2026-11-03T12:00:00Z");

  it("uses minutes under an hour", () => {
    expect(haceTiempo("2026-11-03T11:55:00Z", ahora)).toBe("hace 5 min");
  });

  it("uses hours under a day", () => {
    expect(haceTiempo("2026-11-03T09:00:00Z", ahora)).toBe("hace 3 h");
  });

  it("uses days with plural", () => {
    expect(haceTiempo("2026-11-01T12:00:00Z", ahora)).toBe("hace 2 días");
    expect(haceTiempo("2026-11-02T12:00:00Z", ahora)).toBe("hace 1 día");
  });

  it("never returns negative values", () => {
    expect(haceTiempo("2026-11-03T12:01:00Z", ahora)).toBe("hace 0 min");
  });
});
