import { describe, expect, it, vi } from "vitest";
import { obtenerDatosVolcanes } from "./fuente";
import type { Volcan } from "./mapear";

function volcan(nombre: string, nivel: Volcan["nivel"]): Volcan {
  return { nombre, region: null, pais: null, lat: -39, lng: -72, nivel, rankingRiesgo: null, alturaMsnm: null, tipo: null, ultimaErupcion: null, actualizado: null };
}

describe("obtenerDatosVolcanes", () => {
  it("uses the activity source when it works", async () => {
    const catalogo = vi.fn();
    const datos = await obtenerDatosVolcanes(async () => [volcan("Villarrica", 2)], catalogo);
    expect(datos).toEqual({ volcanes: [volcan("Villarrica", 2)], conActividad: true });
    expect(catalogo).not.toHaveBeenCalled();
  });

  it("falls back to the catalog without activity when the activity source fails", async () => {
    const onFallo = vi.fn();
    const datos = await obtenerDatosVolcanes(
      async () => {
        throw new Error("401");
      },
      async () => [volcan("Villarrica", null)],
      onFallo,
    );
    expect(datos).toEqual({ volcanes: [volcan("Villarrica", null)], conActividad: false });
    expect(onFallo).toHaveBeenCalledOnce();
  });

  it("throws when both sources fail", async () => {
    const falla = async (): Promise<Volcan[]> => {
      throw new Error("down");
    };
    await expect(obtenerDatosVolcanes(falla, falla)).rejects.toThrow("down");
  });
});
