import { unstable_cache } from "next/cache";
import { combinarConCatalogo, volcanesDelCatalogo } from "@/lib/volcanes/catalogo";
import { obtenerDatosVolcanes } from "@/lib/volcanes/fuente";
import { obtenerVolcanes } from "@/lib/volcanes/rnvv";

function registrarFallo(error: unknown) {
  console.warn("RNVV unavailable, using local catalog:", error instanceof Error ? error.message : "unknown error");
}

// SERNAGEOMIN (RNVV) first: it gives the activity level, and our committed catalog adds the last
// eruption and the neighbor-country volcanoes. If RNVV fails (or RNVV_API_KEY is missing) the
// catalog alone is served, flagged conActividad: false. That result is cached too, so RNVV is
// retried every 10 minutes.
const volcanesEnCache = unstable_cache(
  () =>
    obtenerDatosVolcanes(
      async () => combinarConCatalogo(await obtenerVolcanes()),
      async () => volcanesDelCatalogo(),
      registrarFallo,
    ),
  ["volcanes-v6"],
  { revalidate: 600 },
);

export async function GET() {
  try {
    const datos = await volcanesEnCache();
    return Response.json(datos, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("Volcano sources failed:", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "Datos de volcanes no disponibles" }, { status: 502 });
  }
}
