import { REGION_CHILE } from "../region";
import type { Volcan } from "./mapear";

// Smithsonian Global Volcanism Program, Holocene volcanoes (WFS, no key). Catalog only: it has no
// activity level, so every volcano comes back with `nivel: null`.
// Same area as the "Chile y alrededores" tab, so neighbors (southern Peru, Argentina, Bolivia)
// are included. Filtered on the Latitude/Longitude attributes: WFS 2.0 BBOX flips the axis order.
// Only volcanoes with an observed or dated eruption are kept; "credible"/"uncertain" entries are
// mostly cones and hills.
const { latMin, latMax, lngMin, lngMax } = REGION_CHILE;
const FILTRO =
  `Latitude BETWEEN ${latMin} AND ${latMax} AND Longitude BETWEEN ${lngMin} AND ${lngMax}` +
  " AND Evidence_Category IN ('Eruption Observed','Eruption Dated')";
const GVP_URL =
  "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=2.0.0" +
  "&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes" +
  "&outputFormat=application/json" +
  "&propertyName=Volcano_Name,Country,Latitude,Longitude,Elevation,Primary_Volcano_Type,Last_Eruption_Year" +
  `&CQL_FILTER=${encodeURIComponent(FILTRO)}`;
const TIMEOUT_MS = 10_000;

const TIPOS: Record<string, string> = {
  stratovolcano: "Estratovolcán",
  caldera: "Caldera",
  complex: "Complejo volcánico",
  "volcanic field": "Campo volcánico",
  "lava dome": "Domo de lava",
  "pyroclastic cone": "Cono piroclástico",
  "lava cone": "Cono de lava",
  shield: "Volcán escudo",
  maar: "Maar",
};

// GVP spells Chilean names without accents and in English for some fields and complexes.
const PALABRAS: Record<string, string> = {
  Chillan: "Chillán",
  Lascar: "Láscar",
  Lanin: "Lanín",
  Chaiten: "Chaitén",
  Longavi: "Longaví",
  Quetrupillan: "Quetrupillán",
  Hornopiren: "Hornopirén",
  Carran: "Carrán",
  Jose: "José",
  Planchon: "Planchón",
  Cordon: "Cordón",
  Vigueria: "Viguería",
  Payun: "Payún",
  Matru: "Matrú",
};

const PAISES: Record<string, string> = {
  Chile: "Chile",
  Argentina: "Argentina",
  Bolivia: "Bolivia",
  Peru: "Perú",
  Antarctica: "Antártica",
};

function aNumero(valor: unknown): number | null {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : null;
}

// "Chillan, Nevados de" -> "Nevados de Chillán"; "Pali-Aike Volcanic Field" -> "Campo volcánico Pali-Aike".
export function nombreEs(nombre: string): string {
  let n = nombre.trim();
  const invertido = n.match(/^(.+),\s*(.+)$/);
  if (invertido) n = `${invertido[2]} ${invertido[1]}`;
  n = n
    .replace(/^(.+) Volcanic Field$/, "Campo volcánico $1")
    .replace(/^(.+) Volcanic Complex$/, "Complejo volcánico $1")
    .replace(/^(.+) Volcanic Plateau$/, "Meseta volcánica $1")
    .replace(/^(.+) Group$/, "Grupo $1");
  return n.replace(/\p{L}+/gu, (palabra) => PALABRAS[palabra] ?? palabra);
}

// "Stratovolcano(es)" -> "Estratovolcán"; "Pyroclastic cone(s)" -> "Cono piroclástico".
export function tipoEs(tipo: unknown): string | null {
  if (typeof tipo !== "string") return null;
  const clave = tipo.replace(/\(.*\)/, "").trim().toLowerCase();
  return TIPOS[clave] ?? null;
}

// "Chile-Argentina" -> "Chile / Argentina"; "Peru" -> "Perú".
export function paisEs(pais: unknown): string | null {
  if (typeof pais !== "string" || pais.trim() === "") return null;
  return pais
    .split("-")
    .map((p) => PAISES[p.trim()] ?? p.trim())
    .join(" / ");
}

export function featureAVolcan(feature: unknown): Volcan | null {
  if (typeof feature !== "object" || feature === null) return null;
  const props = (feature as { properties?: unknown }).properties;
  if (typeof props !== "object" || props === null) return null;
  const p = props as Record<string, unknown>;

  const nombre = typeof p.Volcano_Name === "string" ? p.Volcano_Name.trim() : "";
  const lat = aNumero(p.Latitude);
  const lng = aNumero(p.Longitude);
  if (!nombre || lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    nombre: nombreEs(nombre),
    region: null,
    pais: paisEs(p.Country),
    lat,
    lng,
    nivel: null,
    rankingRiesgo: null,
    alturaMsnm: aNumero(p.Elevation),
    tipo: tipoEs(p.Primary_Volcano_Type),
    ultimaErupcion: aNumero(p.Last_Eruption_Year),
    actualizado: null,
  };
}

export function mapearGvp(datos: unknown): Volcan[] {
  if (typeof datos !== "object" || datos === null) return [];
  const features = (datos as { features?: unknown }).features;
  if (!Array.isArray(features)) return [];
  return features.map(featureAVolcan).filter((v): v is Volcan => v !== null);
}

export async function obtenerVolcanesGvp(): Promise<Volcan[]> {
  const res = await fetch(GVP_URL, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
  if (!res.ok) throw new Error(`GVP responded ${res.status}`);
  const volcanes = mapearGvp(await res.json());
  if (volcanes.length === 0) throw new Error("GVP returned no volcanoes");
  return volcanes;
}
