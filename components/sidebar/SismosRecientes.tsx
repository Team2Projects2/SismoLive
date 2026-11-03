import { haceTiempo, lugarEs, profundidadTexto } from "@/lib/formato";
import { colorPorMagnitud } from "@/lib/magnitud";
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
  { id: "todos", etiqueta: "Chile y alrededores" },
];

export default function SismosRecientes({ pestana, onPestana, conteo, sismos, ahora, mensaje, onSelect }: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between px-1 text-[11px] uppercase tracking-wider text-muted">
        <h2>Sismos recientes</h2>
        <span>últimos 7 días</span>
      </div>
      <div role="tablist" className="flex rounded-[10px] border border-line bg-panel p-[3px]">
        {PESTANAS.map((p) => {
          const activa = p.id === pestana;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => onPestana(p.id)}
              className={`flex-1 rounded-[7px] py-[7px] text-[13px] ${
                activa ? "bg-panel-2 text-foreground shadow-[inset_0_0_0_1px_#3b4f75]" : "text-muted"
              }`}
            >
              {p.etiqueta} <small className="ml-1 text-muted">{conteo[p.id]}</small>
            </button>
          );
        })}
      </div>
      <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
        {mensaje && <li className="px-1 py-4 text-center text-sm text-muted">{mensaje}</li>}
        {sismos.map((s) => {
          const color = colorPorMagnitud(s.magnitud);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="flex w-full items-center gap-2.5 rounded-[10px] border border-line bg-panel px-3 py-2.5 text-left hover:border-[#3b4f75]"
              >
                <span
                  className="h-[18px] w-[18px] flex-none rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <span>
                  <b className="block text-[13px]">
                    {s.magnitud.toFixed(1)} M · {lugarEs(s.lugar)}
                  </b>
                  <small className="text-[11px] text-muted">
                    {ahora !== null && `${haceTiempo(s.fecha, ahora)} · `}
                    {profundidadTexto(s.profundidad)}
                  </small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
