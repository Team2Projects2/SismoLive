import { Marker } from "react-map-gl/mapbox";
import type { GrupoVolcanes } from "@/lib/volcanes/agrupar";
import GrupoVolcanIcon from "./GrupoVolcanIcon";

type Props = {
  grupo: GrupoVolcanes;
  onHover: (grupo: GrupoVolcanes | null) => void;
  onClick: (grupo: GrupoVolcanes) => void;
};

export default function GrupoVolcanMarker({ grupo, onHover, onClick }: Props) {
  return (
    <Marker
      longitude={grupo.lng}
      latitude={grupo.lat}
      anchor="bottom"
      // Above single calm volcanoes (1), below active ones (10 + nivel).
      style={{ zIndex: 5 }}
    >
      <div
        className="cursor-pointer"
        onMouseEnter={() => onHover(grupo)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(grupo)}
      >
        <GrupoVolcanIcon nivel={grupo.nivel} cantidad={grupo.volcanes.length} ancho={34} />
      </div>
    </Marker>
  );
}
