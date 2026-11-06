import { fechaHoraCorta, lugarEs } from "@/lib/formato";
import { colorPorMagnitud, richterEstimado } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";
import CerrarBoton from "./CerrarBoton";

type Props = {
  sismo: Sismo;
  onCerrar: () => void;
};

// Pinned detail for a clicked quake. Mirrors the newest-quake callout, but with
// the extra fields needed to read the event at leisure.
export default function DetalleSismo({ sismo, onCerrar }: Props) {
  const color = colorPorMagnitud(sismo.magnitud);

  return (
    <div className="bg-surface p-3" style={{ borderLeft: `3px solid ${color}` }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="label">Sismo</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-[30px] leading-none tracking-[-0.02em] tabular-nums">
              {sismo.magnitud.toFixed(1)}
            </span>
            <span className="text-[9px] font-semibold tracking-[0.14em] text-muted">
              Mw
            </span>
            <span className="text-[9px] text-muted">({richterEstimado(sismo.magnitud)})</span>
          </p>
        </div>
        <CerrarBoton onClick={onCerrar} label="Cerrar información del sismo" />
      </div>

      <p className="mt-2 text-[13px] leading-snug text-ink-soft">{lugarEs(sismo.lugar)}</p>

      <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-2.5">
        <div>
          <dt className="label text-[10px]">Profundidad</dt>
          <dd className="mt-1 text-[12px] tabular-nums">
            {sismo.profundidad === null ? "Desconocida" : `${Math.round(sismo.profundidad)} km`}
          </dd>
        </div>
        <div>
          <dt className="label text-[10px]">Hora · Chile</dt>
          <dd className="mt-1 text-[12px] tabular-nums">{fechaHoraCorta(sismo.fecha)}</dd>
        </div>
      </dl>

      {sismo.url?.startsWith("https://") && (
        <a
          href={sismo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-accent transition-colors hover:text-ink"
        >
          Ver detalle en USGS <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
