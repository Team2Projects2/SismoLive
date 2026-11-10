import { Marker } from "react-map-gl/mapbox";
import type { GrupoVolcanes } from "@/lib/volcanes/agrupar";
import GrupoVolcanIcon from "./GrupoVolcanIcon";

type Props = {
  grupo: GrupoVolcanes;
  // True on the first frames of a group that just formed: it pops in.
  entra: boolean;
  onHover: (grupo: GrupoVolcanes | null) => void;
  onClick: (grupo: GrupoVolcanes) => void;
};

export default function GrupoVolcanMarker({ grupo, entra, onHover, onClick }: Props) {
  return (
    <Marker
      longitude={grupo.lng}
      latitude={grupo.lat}
      anchor="bottom"
      // Above single calm volcanoes (1), below active ones (10 + nivel).
      style={{ zIndex: 5 }}
    >
      <div
        className={entra ? "volcan-grupo-entra cursor-pointer" : "cursor-pointer"}
        onMouseEnter={() => onHover(grupo)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(grupo)}
      >
        <GrupoVolcanIcon nivel={grupo.nivel} cantidad={grupo.volcanes.length} ancho={44} />
      </div>
    </Marker>
  );
}
