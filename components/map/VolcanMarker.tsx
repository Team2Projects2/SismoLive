import { Marker } from "react-map-gl/mapbox";
import type { Volcan } from "@/lib/volcanes/mapear";
import { estiloDesplazamiento, type Desplazamiento } from "@/lib/volcanes/transicion";
import VolcanIcon from "./VolcanIcon";

type Props = {
  volcan: Volcan;
  onHover: (volcan: Volcan | null) => void;
  // Set when the volcano just left a group: it slides out from the group by this offset.
  desde?: Desplazamiento;
  // Close zooms show the name under the cone (the base map's own volcano labels are hidden).
  conNombre: boolean;
};

export default function VolcanMarker({ volcan, onHover, desde, conNombre }: Props) {
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
        className={desde ? "volcan-separa relative cursor-pointer" : "relative cursor-pointer"}
        style={desde && estiloDesplazamiento(desde)}
        onMouseEnter={() => onHover(volcan)}
        onMouseLeave={() => onHover(null)}
      >
        <VolcanIcon nivel={volcan.nivel} ancho={activo ? 40 : 24} />
        {/* Out of flow, so the bottom anchor stays on the cone base. */}
        {conNombre && (
          <span className="volcan-nombre pointer-events-none absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap font-display text-[11.5px] italic leading-none text-ink-soft">
            {volcan.nombre}
          </span>
        )}
      </div>
    </Marker>
  );
}
