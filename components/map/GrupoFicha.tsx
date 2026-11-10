import type { GrupoVolcanes } from "@/lib/volcanes/agrupar";
import { colorNivel } from "@/lib/volcanes/nivel";
import { EstadoActividad } from "./VolcanFicha";

const MAX_NOMBRES = 6;

export default function GrupoFicha({ grupo }: { grupo: GrupoVolcanes }) {
  const nombres = grupo.volcanes.map((v) => v.nombre);
  const resto = nombres.length - MAX_NOMBRES;

  return (
    <div className="border-l-4 px-3.5 py-3" style={{ borderColor: colorNivel(grupo.nivel) }}>
      <p className="label text-[10px]">{nombres.length} volcanes</p>
      <ul className="mt-1.5 space-y-0.5 font-display text-[14px] leading-snug text-ink">
        {nombres.slice(0, MAX_NOMBRES).map((n, i) => (
          <li key={`${n}-${i}`}>{n}</li>
        ))}
      </ul>
      {resto > 0 && <p className="mt-1 text-[11px] text-muted">y {resto} más</p>}

      <div className="mt-2.5 border-t border-line pt-2">
        <EstadoActividad nivel={grupo.nivel} />
      </div>
      <p className="mt-1.5 text-[10px] text-muted">Haz clic para acercar</p>
    </div>
  );
}
