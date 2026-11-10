import { describe, expect, it } from "vitest";
import { altitudTexto, anioTexto, colorNivel, COLOR_SIN_NIVEL, NIVEL_COLOR } from "./nivel";

describe("nivel helpers", () => {
  it("formats altitude with Chilean thousands separator", () => {
    expect(altitudTexto(2847)).toBe("2.847 m");
    expect(altitudTexto(812.6)).toBe("813 m");
  });

  it("formats BCE years", () => {
    expect(anioTexto(2025)).toBe("2025");
    expect(anioTexto(-320)).toBe("320 a. C.");
  });

  it("uses the basalt color when the level is unknown", () => {
    expect(colorNivel(null)).toBe(COLOR_SIN_NIVEL);
    expect(colorNivel(3)).toBe(NIVEL_COLOR[3]);
  });
});
