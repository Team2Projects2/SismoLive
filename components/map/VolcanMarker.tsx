import { Marker } from "react-map-gl/mapbox";
import type { Volcan } from "@/lib/volcanes/mapear";
import VolcanIcon from "./VolcanIcon";

type Props = {
  volcan: Volcan;
  onHover: (volcan: Volcan | null) => void;
};

export default function VolcanMarker({ volcan, onHover }: Props) {
  const nivel = volcan.nivel ?? 0;
  const activo = nivel >= 2;
  return (
    <Marker
      longitude={volcan.lng}
      latitude={volcan.lat}
      // Bottom anchor keeps the cone base on the real location at every zoom.
      anchor="bottom"
      // Higher activity is drawn above calmer volcanoes and earthquake dots.
      style={{ zIndex: activo ? 10 + nivel : 1 }}
    >
      <div
        className="cursor-pointer"
        onMouseEnter={() => onHover(volcan)}
        onMouseLeave={() => onHover(null)}
      >
        <VolcanIcon nivel={volcan.nivel} ancho={activo ? 40 : 24} />
      </div>
    </Marker>
  );
}
