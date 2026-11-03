import { useMemo } from "react";
import { agruparVolcanes, type GrupoVolcanes } from "@/lib/volcanes/agrupar";
import type { Volcan } from "@/lib/volcanes/mapear";
import GrupoVolcanMarker from "./GrupoVolcanMarker";
import VolcanMarker from "./VolcanMarker";

// Snapshot of the map projection, replaced on every load/moveend so grouping recomputes then.
export type Vista = { proyectar: (lng: number, lat: number) => { x: number; y: number } };

type Props = {
  volcanes: Volcan[];
  vista: Vista | null;
  onHoverVolcan: (volcan: Volcan | null) => void;
  onHoverGrupo: (grupo: GrupoVolcanes | null) => void;
  onClickGrupo: (grupo: GrupoVolcanes) => void;
};

function claveGrupo(g: GrupoVolcanes): string {
  return `grupo-${g.volcanes.map((v) => v.nombre).join("|")}`;
}

export default function VolcanesCapa({
  volcanes,
  vista,
  onHoverVolcan,
  onHoverGrupo,
  onClickGrupo,
}: Props) {
  const { sueltos, grupos } = useMemo(() => {
    // Before the map loads there is no projection; show every volcano on its own.
    if (!vista) return { sueltos: volcanes, grupos: [] };
    return agruparVolcanes(
      volcanes.map((v) => ({ ...vista.proyectar(v.lng, v.lat), volcan: v })),
    );
  }, [volcanes, vista]);

  return (
    <>
      {sueltos.map((v) => (
        <VolcanMarker key={`${v.nombre}-${v.lat}-${v.lng}`} volcan={v} onHover={onHoverVolcan} />
      ))}
      {grupos.map((g) => (
        <GrupoVolcanMarker
          key={claveGrupo(g)}
          grupo={g}
          onHover={onHoverGrupo}
          onClick={onClickGrupo}
        />
      ))}
    </>
  );
}
