import { unstable_cache } from "next/cache";
import { obtenerVolcanes } from "@/lib/volcanes/rnvv";

// Only successful results are cached; a failed upstream call is retried on the next request.
const volcanesEnCache = unstable_cache(obtenerVolcanes, ["rnvv-volcanes"], {
  revalidate: 600,
});

export async function GET() {
  try {
    const volcanes = await volcanesEnCache();
    return Response.json(volcanes, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("Volcano upstream failed:", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "Datos de volcanes no disponibles" }, { status: 502 });
  }
}
