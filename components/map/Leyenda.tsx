import { LEYENDA_MAGNITUD } from "@/lib/magnitud";
import CerrarBoton from "./CerrarBoton";
import { NIVEL_ETIQUETA } from "@/lib/volcanes/nivel";
import VolcanIcon from "./VolcanIcon";

const NIVELES_LEYENDA = [0, 1, 2, 3] as const;

type Props = { onClose?: () => void };

export default function Leyenda({ onClose }: Props) {
  return (
    <div className="panel px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="label">Leyenda</h3>
        {onClose && <CerrarBoton onClick={onClose} label="Cerrar leyenda" />}
      </div>

      <h4
        className="label mt-3 text-[10px] normal-case"
        title="Mw es la magnitud de momento reportada por USGS. El valor Richter entre paréntesis es una estimación referencial."
      >
        Magnitud · Mw
      </h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {LEYENDA_MAGNITUD.map((m) => (
          <li key={m.color} className="flex items-center gap-2 text-[12px] leading-tight text-ink-soft">
            <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: m.color }} />
            {m.etiqueta}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-[9.5px] leading-snug text-muted">
        Richter entre paréntesis: estimación referencial.
      </p>

      <h4 className="label mt-4 border-t border-line pt-3 text-[10px]">Volcanes · EAV</h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {NIVELES_LEYENDA.map((n) => (
          <li key={n} className="flex items-center gap-2 text-[12px] leading-tight text-ink-soft">
            <VolcanIcon nivel={n} ancho={24} />
            {n === 3 ? "3–5 · Erupción" : `${n} · ${NIVEL_ETIQUETA[n]}`}
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-line pt-2 text-[10px] leading-snug text-muted">
        Estado de Actividad Volcánica · SERNAGEOMIN
      </p>
    </div>
  );
}
