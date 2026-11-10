import { writeFile } from "node:fs/promises";
import { obtenerVolcanesGvp } from "../lib/volcanes/gvp";
import type { EntradaCatalogo } from "../lib/volcanes/catalogo";

// Regenerates lib/volcanes/catalogo.json from the Smithsonian GVP catalog.
// The JSON is committed and edited by hand afterwards (e.g. new eruptions reported by SERNAGEOMIN),
// so review the diff before committing: running this overwrites manual edits.
const DESTINO = new URL("../lib/volcanes/catalogo.json", import.meta.url);

async function main() {
  const volcanes = await obtenerVolcanesGvp();
  const catalogo: EntradaCatalogo[] = volcanes
    .map(({ nombre, pais, lat, lng, alturaMsnm, tipo, ultimaErupcion }) => ({
      nombre,
      pais,
      lat,
      lng,
      alturaMsnm,
      tipo,
      ultimaErupcion,
    }))
    // North to south, the way Chile reads.
    .sort((a, b) => b.lat - a.lat);
  await writeFile(DESTINO, `${JSON.stringify(catalogo, null, 2)}\n`, "utf8");
  console.log(`Wrote ${catalogo.length} volcanoes to lib/volcanes/catalogo.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
