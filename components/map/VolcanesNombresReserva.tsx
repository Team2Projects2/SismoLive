import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import type { Volcan } from "@/lib/volcanes/mapear";

type Props = { volcanes: Volcan[]; minZoom: number };

// The visible volcano names are HTML (VolcanMarker), which Mapbox's label collision ignores.
// This invisible symbol layer, added on top of the style, claims the same box under each cone:
// Mapbox places labels from the top layer down, so basemap labels that would overlap a volcano
// name are hidden instead of drawn under it.
export default function VolcanesNombresReserva({ volcanes, minZoom }: Props) {
  const datos = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: volcanes.map((v) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [v.lng, v.lat] },
        properties: { nombre: v.nombre },
      })),
    }),
    [volcanes],
  );

  return (
    <Source id="volcanes-nombres" type="geojson" data={datos}>
      <Layer
        id="volcanes-nombres-reserva"
        type="symbol"
        minzoom={minZoom}
        layout={{
          "text-field": ["get", "nombre"],
          "text-size": 11.5,
          "text-anchor": "top",
          "text-offset": [0, 0.2],
          // A little extra room: the HTML name uses a different (serif italic) font.
          "text-padding": 4,
          // Never hide our own reservation, but still keep other labels out of its box.
          "text-allow-overlap": true,
          "text-ignore-placement": false,
        }}
        paint={{ "text-opacity": 0 }}
      />
    </Source>
  );
}
