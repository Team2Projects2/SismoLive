import { describe, expect, it } from "vitest";
import { cuentaRegresiva, estadoIngesta, intervaloSondeoMs } from "./estado";

const ultima = "2026-11-03T12:00:00Z";
const en = (min: number) => Date.parse(ultima) + min * 60_000;

describe("estadoIngesta", () => {
  it("is fresh within the 10 min window with a seconds countdown", () => {
    expect(estadoIngesta(ultima, en(4))).toEqual({
      tipo: "fresco",
      haceMin: 4,
      faltaSeg: 360,
      progreso: 0.4,
    });
  });

  it("rounds the remaining seconds up", () => {
    expect(estadoIngesta(ultima, en(3.5) + 400)).toMatchObject({ tipo: "fresco", haceMin: 3, faltaSeg: 390 });
  });

  it("is in progress from 10 min instead of a negative countdown", () => {
    expect(estadoIngesta(ultima, en(10))).toEqual({ tipo: "en-curso", haceMin: 10, progreso: 1 });
    expect(estadoIngesta(ultima, en(12))).toEqual({ tipo: "en-curso", haceMin: 12, progreso: 1 });
  });

  it("is delayed after 30 min", () => {
    expect(estadoIngesta(ultima, en(31))).toEqual({ tipo: "retrasado", haceMin: 31, progreso: 1 });
  });

  it("clamps clock skew to zero", () => {
    expect(estadoIngesta(ultima, en(-1))).toMatchObject({ tipo: "fresco", haceMin: 0, faltaSeg: 600 });
  });
});

describe("cuentaRegresiva", () => {
  it("formats mm:ss", () => {
    expect(cuentaRegresiva(402)).toBe("06:42");
    expect(cuentaRegresiva(600)).toBe("10:00");
    expect(cuentaRegresiva(5)).toBe("00:05");
    expect(cuentaRegresiva(-3)).toBe("00:00");
  });
});

describe("intervaloSondeoMs", () => {
  it("polls every minute while fresh and every 15 s once due", () => {
    expect(intervaloSondeoMs(ultima, en(4))).toBe(60_000);
    expect(intervaloSondeoMs(ultima, en(11))).toBe(15_000);
    expect(intervaloSondeoMs(null, en(0))).toBe(60_000);
  });
});
