import { haceTiempo, lugarEs } from "@/lib/formato";
import { colorPorMagnitud } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";

const formatoFecha = new Intl.DateTimeFormat("es-CL", { dateStyle: "short", timeStyle: "short" });

type Props = { sismo: Sismo | null; ahora: number | null; mensaje: string | null };

export default function UltimoSismo({ sismo, ahora, mensaje }: Props) {
  return (
    <section className="rounded-xl border border-accent bg-panel p-3.5 shadow-[0_0_0_1px_rgba(239,68,68,.25),0_0_24px_rgba(239,68,68,.12)]">
      <h2 className="text-[11px] uppercase tracking-wider text-muted">Último sismo detectado</h2>
      {!sismo ? (
        <p className="mt-3 text-sm text-muted">{mensaje ?? "Sin sismos recientes."}</p>
      ) : (
        <>
          <p className="my-2 text-[26px] font-bold">
            Magnitud:{" "}
            <span style={{ color: colorPorMagnitud(sismo.magnitud) }}>{sismo.magnitud.toFixed(1)} M</span>
          </p>
          <dl className="text-[13px] leading-[1.7] text-[#c3cde0]">
            <div>
              <dt className="inline">Ubicación: </dt>
              <dd className="inline">{lugarEs(sismo.lugar)}</dd>
            </div>
            <div>
              <dt className="inline">Hora: </dt>
              <dd className="inline">
                {formatoFecha.format(new Date(sismo.fecha))}
                {ahora !== null && ` (${haceTiempo(sismo.fecha, ahora)})`}
              </dd>
            </div>
            <div>
              <dt className="inline">Profundidad: </dt>
              <dd className="inline">
                {sismo.profundidad === null ? "desconocida" : `${Math.round(sismo.profundidad)} km`}
              </dd>
            </div>
          </dl>
          <svg viewBox="0 0 300 40" className="mt-1.5 h-10 w-full" aria-hidden="true">
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              points="0,20 40,20 50,18 60,22 80,20 110,20 118,10 124,32 130,4 136,36 142,8 148,30 154,14 160,24 170,20 200,20 210,17 218,23 230,20 300,20"
            />
          </svg>
          {sismo.url?.startsWith("https://") && (
            <a
              href={sismo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 block w-full rounded-lg border border-line bg-panel-2 p-2 text-center text-[13px] hover:border-[#3b4f75]"
            >
              Ver detalles
            </a>
          )}
        </>
      )}
    </section>
  );
}
