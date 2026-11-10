import { useEffect, useMemo, useState } from "react";
import { Marker } from "react-map-gl/mapbox";
import { type Agrupacion, agruparVolcanes, radioPorZoom, type GrupoVolcanes } from "@/lib/volcanes/agrupar";
import type { Volcan } from "@/lib/volcanes/mapear";
import {
  calcularTransicion,
  claveGrupo,
  claveVolcan,
  estiloDesplazamiento,
  type Transicion,
} from "@/lib/volcanes/transicion";
import GrupoVolcanMarker from "./GrupoVolcanMarker";
import VolcanIcon from "./VolcanIcon";
import VolcanMarker from "./VolcanMarker";
import VolcanesNombresReserva from "./VolcanesNombresReserva";

// Snapshot of the map projection, replaced on every load/moveend so grouping recomputes then.
export type Vista = {
  proyectar: (lng: number, lat: number) => { x: number; y: number };
  ancho: number;
  zoom: number;
};

type Props = {
  volcanes: Volcan[];
  vista: Vista | null;
  onHoverVolcan: (volcan: Volcan | null) => void;
  onHoverGrupo: (grupo: GrupoVolcanes | null) => void;
  onClickGrupo: (grupo: GrupoVolcanes) => void;
};

// From here on volcanoes are mostly loose and there is room to name them.
const ZOOM_NOMBRES = 7;

// Must cover the longest animation in globals.css (group pop-in: 200 ms delay + 520 ms).
const DURACION_TRANSICION_MS = 750;

export default function VolcanesCapa({
  volcanes,
  vista,
  onHoverVolcan,
  onHoverGrupo,
  onClickGrupo,
}: Props) {
  const agrupacion = useMemo<Agrupacion>(() => {
    // Before the map loads there is no projection; show every volcano on its own.
    if (!vista) return { sueltos: volcanes, grupos: [] };
    return agruparVolcanes(
      volcanes.map((v) => ({ ...vista.proyectar(v.lng, v.lat), volcan: v })),
      radioPorZoom(vista.zoom),
    );
  }, [volcanes, vista]);

  // Diff against the previous grouping during render (React's "store previous state" pattern),
  // so the very first frame of a new grouping already carries its animation.
  const [anterior, setAnterior] = useState(agrupacion);
  const [transicion, setTransicion] = useState<Transicion | null>(null);
  if (agrupacion !== anterior) {
    setAnterior(agrupacion);
    // A plain pan returns null; keep a running animation instead of cutting it.
    const nueva = vista ? calcularTransicion(anterior, agrupacion, vista.proyectar) : null;
    if (nueva) setTransicion(nueva);
  }

  useEffect(() => {
    if (!transicion) return;
    const t = setTimeout(() => setTransicion(null), DURACION_TRANSICION_MS);
    return () => clearTimeout(t);
  }, [transicion]);

  return (
    <>
      <VolcanesNombresReserva volcanes={agrupacion.sueltos} minZoom={ZOOM_NOMBRES} />
      {agrupacion.sueltos.map((v) => {
        const clave = claveVolcan(v);
        return (
          <VolcanMarker
            key={clave}
            volcan={v}
            onHover={onHoverVolcan}
            desde={transicion?.entradas.get(clave)}
            conNombre={(vista?.zoom ?? 0) >= ZOOM_NOMBRES}
          />
        );
      })}
      {agrupacion.grupos.map((g) => {
        const clave = claveGrupo(g);
        return (
          <GrupoVolcanMarker
            key={clave}
            grupo={g}
            entra={transicion?.gruposNuevos.has(clave) ?? false}
            onHover={onHoverGrupo}
            onClick={onClickGrupo}
          />
        );
      })}
      {/* Copies of the volcanoes that just joined a group, sliding into it. Not interactive. */}
      {transicion?.fantasmas.map(({ volcan, dx, dy }) => (
        <Marker
          key={`fantasma-${claveVolcan(volcan)}`}
          longitude={volcan.lng}
          latitude={volcan.lat}
          anchor="bottom"
          style={{ zIndex: 4, pointerEvents: "none" }}
        >
          <div className="volcan-fusion" style={estiloDesplazamiento({ dx, dy })} aria-hidden="true">
            <VolcanIcon nivel={volcan.nivel} ancho={24} />
          </div>
        </Marker>
      ))}
    </>
  );
}
