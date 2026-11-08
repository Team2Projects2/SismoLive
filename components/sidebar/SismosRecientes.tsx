import { haceTiempo, lugarEs, profundidadTexto } from "@/lib/formato";
import { colorPorMagnitud, magnitudMw, richterEstimado } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";

export type Pestana = "chile" | "todos";

type Props = {
  pestana: Pestana;
  onPestana: (p: Pestana) => void;
  conteo: Record<Pestana, number>;
  sismos: Sismo[];
  ahora: number | null;
  mensaje: string | null;
  onSelect: (s: Sismo) => void;
};

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "chile", etiqueta: "Chile" },
  { id: "todos", etiqueta: "Todos" },
];

export default function SismosRecientes({
  pestana,
  onPestana,
  conteo,
  sismos,
  ahora,
  mensaje,
  onSelect,
}: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[20px] leading-none tracking-[-0.01em]">
          Sismos recientes
        </h2>
        <span className="text-[11px] text-muted">últimos 7 días</span>
      </div>

      <div
        role="tablist"
        aria-label="Filtrar sismos por zona"
        className="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface-2 p-1"
      >
        {PESTANAS.map((p) => {
          const activa = p.id === pestana;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={activa}
              title={p.id === "todos" ? "Chile y alrededores" : undefined}
              onClick={() => onPestana(p.id)}
              className={`rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${
                activa
                  ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                  : "text-muted hover:text-ink"
              }`}
            >
              {p.etiqueta}
              <span className="ml-1.5 text-[11px] tabular-nums text-muted">{conteo[p.id]}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-2 flex max-h-[55vh] min-h-0 flex-1 flex-col divide-y divide-line overflow-y-auto pr-1 lg:max-h-none">
        {mensaje && (
          <li className="py-6 text-center text-[13px] text-muted">{mensaje}</li>
        )}

        {sismos.map((s) => {
          const color = colorPorMagnitud(s.magnitud);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="group flex w-full items-start gap-3 py-2.5 text-left transition-colors hover:bg-surface-2/70"
              >
                <span
                  className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full"
                  style={{ background: color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <b
                      className="text-[15px] font-semibold tabular-nums"
                      title={richterEstimado(s.magnitud)}
                    >
                      {magnitudMw(s.magnitud)}
                    </b>
                    {ahora !== null && (
                      <time dateTime={s.fecha} className="shrink-0 text-[11.5px] tabular-nums text-muted">
                        {haceTiempo(s.fecha, ahora)}
                      </time>
                    )}
                  </span>
                  <span
                    className="mt-0.5 block truncate text-[14px] text-ink-soft"
                    title={lugarEs(s.lugar)}
                  >
                    {lugarEs(s.lugar)}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-muted">
                    {profundidadTexto(s.profundidad)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
