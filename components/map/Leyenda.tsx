import { LEYENDA_MAGNITUD } from "@/lib/magnitud";
import { NIVEL_ETIQUETA } from "@/lib/volcanes/nivel";
import VolcanIcon from "./VolcanIcon";

const NIVELES_LEYENDA = [0, 1, 2, 3] as const;

export default function Leyenda() {
  return (
    <div className="map-overlay bottom-20 left-3 max-h-[calc(100%-156px)] max-w-[250px] overflow-y-auto">
      <h4 className="mb-2 text-xs font-semibold text-muted">Magnitud</h4>
      {LEYENDA_MAGNITUD.map((m) => (
        <div key={m.color} className="my-0.5 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
          {m.etiqueta}
        </div>
      ))}
      <h4 className="mb-2 mt-2.5 text-xs font-semibold text-muted">
        Volcanes · Estado de Actividad (SERNAGEOMIN)
      </h4>
      {NIVELES_LEYENDA.map((n) => (
        <div key={n} className="my-0.5 flex items-center gap-2">
          <VolcanIcon nivel={n} ancho={26} />
          {n === 3 ? "3–5 · Erupción" : `${n} · ${NIVEL_ETIQUETA[n]}`}
        </div>
      ))}
    </div>
  );
}
