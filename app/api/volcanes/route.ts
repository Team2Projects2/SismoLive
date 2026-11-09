import { unstable_cache } from "next/cache";
import { obtenerDatosVolcanes } from "@/lib/volcanes/fuente";
import { obtenerVolcanesGvp } from "@/lib/volcanes/gvp";
import { obtenerVolcanes } from "@/lib/volcanes/rnvv";

function registrarFallo(error: unknown) {
  console.warn("RNVV unavailable, using GVP catalog:", error instanceof Error ? error.message : "unknown error");
}

// Only successful results are cached; a failed call is retried on the next request.
// A fallback result (conActividad: false) is cached too, so RNVV is retried every 10 minutes.
const volcanesEnCache = unstable_cache(
  () => obtenerDatosVolcanes(obtenerVolcanes, obtenerVolcanesGvp, registrarFallo),
  ["volcanes-v2"],
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
