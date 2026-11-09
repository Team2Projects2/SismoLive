import type { Volcan } from "./mapear";

// Smithsonian Global Volcanism Program, Holocene volcanoes (WFS, no key). Catalog only: it has no
// activity level, so every volcano comes back with `nivel: null`.
// Country values include "Chile", "Chile-Argentina" and "Chile-Bolivia".
const GVP_URL =
  "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=2.0.0" +
  "&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes" +
  "&outputFormat=application/json&propertyName=Volcano_Name,Latitude,Longitude,Elevation,Country" +
  "&CQL_FILTER=" +
  encodeURIComponent("Country LIKE '%Chile%'");
const TIMEOUT_MS = 10_000;

function aNumero(valor: unknown): number | null {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : null;
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
    nombre,
    region: null,
    lat,
    lng,
    nivel: null,
    rankingRiesgo: null,
    alturaMsnm: aNumero(p.Elevation),
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
