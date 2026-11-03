import { Layer, Source } from "react-map-gl/mapbox";
import { COLOR_PLACA_DEFECTO, PLACAS_INFO } from "@/lib/placas";

export const PLACAS_SOURCE = "placas";
export const PLACAS_FILL = "placas-fill";

const entradas = Object.entries(PLACAS_INFO);
const colorPlaca = [
  "match",
  ["get", "Code"],
  ...entradas.flatMap(([code, p]) => [code, p.color]),
  COLOR_PLACA_DEFECTO,
] as unknown as string;
const nombrePlaca = [
  "match",
  ["get", "Code"],
  ...entradas.flatMap(([code, p]) => [code, p.nombre]),
  ["get", "PlateName"],
] as unknown as string;

type Props = { visible: boolean };

export default function PlacasLayer({ visible }: Props) {
  const visibility = visible ? "visible" : "none";
  return (
    <Source id={PLACAS_SOURCE} type="geojson" data="/data/pb2002-plates.json" generateId>
      <Layer
        id={PLACAS_FILL}
        type="fill"
        layout={{ visibility }}
        paint={{
          "fill-color": colorPlaca,
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.32, 0.14],
        }}
      />
      {/* Soft glow + thin core line with round joins for a smoother edge. */}
      <Layer
        id="placas-glow"
        type="line"
        layout={{ visibility, "line-join": "round", "line-cap": "round" }}
        paint={{ "line-color": colorPlaca, "line-width": 8, "line-blur": 6, "line-opacity": 0.45 }}
      />
      <Layer
        id="placas-line"
        type="line"
        layout={{ visibility, "line-join": "round", "line-cap": "round" }}
        paint={{ "line-color": colorPlaca, "line-width": 1.2, "line-opacity": 0.9 }}
      />
      <Layer
        id="placas-nombres"
        type="symbol"
        layout={{
          visibility,
          "text-field": nombrePlaca,
          "text-size": 12,
          "text-letter-spacing": 0.08,
          "text-transform": "uppercase",
        }}
        paint={{
          "text-color": "#e2e8f0",
          "text-halo-color": "#0b1220",
          "text-halo-width": 1.5,
          "text-opacity": 0.8,
        }}
      />
    </Source>
  );
}
