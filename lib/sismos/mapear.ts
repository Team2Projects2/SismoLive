import type { Sismo } from "../types";

export type FeatureUsgs = {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    url: string | null;
  };
  geometry: {
    // GeoJSON order: [longitude, latitude, depth in km]
    coordinates: [number, number, number];
  };
};

function esFinito(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function urlHttps(url: unknown): string | null {
  if (typeof url !== "string") return null;
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

// The feed is external input: validate every field we store instead of trusting the type.
export function featureASismo(feature: FeatureUsgs): Sismo | null {
  const id = feature?.id;
  if (typeof id !== "string" || id.trim() === "") return null;

  const { mag, place, time, url } = feature.properties ?? {};
  const [lng, lat, profundidad] = feature.geometry?.coordinates ?? [];

  if (
    !esFinito(mag) ||
    !esFinito(time) ||
    !esFinito(lng) ||
    !esFinito(lat) ||
    !esFinito(profundidad)
  ) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    id,
    magnitud: mag,
    lugar: typeof place === "string" && place.trim() !== "" ? place : "Ubicación sin nombre",
    fecha: new Date(time).toISOString(),
    lat,
    lng,
    profundidad,
    url: urlHttps(url),
  };
}
