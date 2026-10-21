import { colorPorMagnitud } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";

const formatoFecha = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
});

type Props = {
  sismos: Sismo[];
  cargando: boolean;
  error: boolean;
  seleccionado: string | null;
  onSelect: (id: string) => void;
};

export default function SismosTable({
  sismos,
  cargando,
  error,
  seleccionado,
  onSelect,
}: Props) {
  const mensaje = cargando
    ? "Cargando sismos…"
    : error
      ? "No se pudieron cargar los datos."
      : sismos.length === 0
        ? "No hay sismos registrados."
        : null;

  return (
    <div className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl shadow-black/30">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            {["Magnitud", "Lugar", "Fecha", "Profundidad"].map((t) => (
              <th key={t} className="px-4 py-3 text-left font-medium">
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {mensaje && (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                {mensaje}
              </td>
            </tr>
          )}
          {sismos.map((s) => {
            const color = colorPorMagnitud(s.magnitud);
            return (
              <tr
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`cursor-pointer transition-colors hover:bg-white/5 ${
                  seleccionado === s.id ? "bg-sky-400/10" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <span
                    className="inline-block min-w-12 rounded-lg px-2.5 py-1 text-center text-sm font-bold text-slate-950"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 14px ${color}55`,
                    }}
                  >
                    {s.magnitud.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-100">
                  {s.lugar}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                  {formatoFecha.format(new Date(s.fecha))}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                  {s.profundidad === null
                    ? "—"
                    : `${Math.round(s.profundidad)} km`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
