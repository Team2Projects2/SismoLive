import type { GrupoVolcanes } from "@/lib/volcanes/agrupar";
import { colorNivel, etiquetaNivel } from "@/lib/volcanes/nivel";

const MAX_NOMBRES = 6;

export default function GrupoFicha({ grupo }: { grupo: GrupoVolcanes }) {
  const nombres = grupo.volcanes.map((v) => v.nombre);
  const resto = nombres.length - MAX_NOMBRES;

  return (
    <div className="text-[12px] leading-relaxed text-ink-soft">
      <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-ink">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: colorNivel(grupo.nivel) }}
        />
        {nombres.length} volcanes · {etiquetaNivel(grupo.nivel)}
      </div>
      <ul className="space-y-0.5">
        {nombres.slice(0, MAX_NOMBRES).map((n, i) => (
          <li key={`${n}-${i}`}>{n}</li>
        ))}
      </ul>
      {resto > 0 && <div className="mt-1 text-muted">y {resto} más</div>}
    </div>
  );
}
