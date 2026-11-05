import { fechaHoraCorta, haceTiempo, lugarEs } from "@/lib/formato";
import { colorPorMagnitud } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";

type Props = { sismo: Sismo | null; ahora: number | null; mensaje: string | null };

export default function UltimoSismo({ sismo, ahora, mensaje }: Props) {
  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="label">Último sismo</h2>
        {sismo && ahora !== null && (
          <span className="inline-flex items-center gap-1.5 text-[12px] tabular-nums text-muted">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: colorPorMagnitud(sismo.magnitud) }}
            />
            {haceTiempo(sismo.fecha, ahora)}
          </span>
        )}
      </div>

      {!sismo ? (
        <p className="mt-4 text-[14px] leading-relaxed text-muted">
          {mensaje ?? "Sin sismos recientes."}
        </p>
      ) : (
        <>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-display text-[52px] leading-[0.85] tracking-[-0.03em] tabular-nums">
              {sismo.magnitud.toFixed(1)}
            </span>
            <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">
              M
            </span>
          </div>

          <p className="mt-2.5 text-[15px] leading-snug text-ink-soft">{lugarEs(sismo.lugar)}</p>

          <dl className="mt-3 grid grid-cols-2 gap-4 border-t border-line pt-2.5">
            <div>
              <dt className="label">Profundidad</dt>
              <dd className="mt-1.5 text-[14px] tabular-nums">
                {sismo.profundidad === null ? "Desconocida" : `${Math.round(sismo.profundidad)} km`}
              </dd>
            </div>
            <div>
              <dt className="label">Hora · Chile</dt>
              <dd className="mt-1.5 text-[14px] tabular-nums">{fechaHoraCorta(sismo.fecha)}</dd>
            </div>
          </dl>

          {sismo.url?.startsWith("https://") && (
            <a
              href={sismo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent transition-colors hover:text-ink"
            >
              Ver detalle en USGS <span aria-hidden="true">↗</span>
            </a>
          )}
        </>
      )}
    </section>
  );
}
