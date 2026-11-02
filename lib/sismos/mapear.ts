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

export function featureASismo(feature: FeatureUsgs): Sismo | null {
  const { mag, place, time, url } = feature.properties;
  if (mag === null) return null;

  const [lng, lat, profundidad] = feature.geometry.coordinates;

  return {
    id: feature.id,
    magnitud: mag,
    lugar: place ?? "Ubicación sin nombre",
    fecha: new Date(time).toISOString(),
    lat,
    lng,
    profundidad,
    url,
  };
}
