import type { NivelVolcan, Volcan } from "@/lib/volcanes/mapear";
import { altitudTexto, anioTexto, colorNivel, NIVEL_ETIQUETA } from "@/lib/volcanes/nivel";

// Activity line shared by the single-volcano and group cards. A hollow ring means "no data",
// so it never reads as a level.
export function EstadoActividad({ nivel }: { nivel: NivelVolcan | null }) {
  const color = colorNivel(nivel);
  return (
    <p className="flex items-center gap-1.5 text-[11.5px] leading-snug text-ink-soft">
      <span
        aria-hidden="true"
        className="h-2 w-2 flex-none rounded-full"
        style={nivel === null ? { boxShadow: `inset 0 0 0 1.5px ${color}` } : { background: color }}
      />
      {nivel === null ? (
        <span className="text-muted">Actividad sin datos</span>
      ) : (
        <span>
          <b className="font-semibold tabular-nums">EAV {nivel}</b> · {NIVEL_ETIQUETA[nivel]}
        </span>
      )}
    </p>
  );
}

const SIN_DATOS = "Sin datos";

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <dt className="label text-[10px]">{titulo}</dt>
      <dd className={`mt-1 text-[12px] tabular-nums ${valor === SIN_DATOS ? "text-muted" : "text-ink"}`}>
        {valor}
      </dd>
    </div>
  );
}

// Hover card for a volcano. Same anatomy as the plate and quake cards: color rule on the left
// (activity), serif name, quiet metadata.
export default function VolcanFicha({ volcan }: { volcan: Volcan }) {
  const subtitulo = [volcan.tipo, volcan.region, volcan.pais].filter(Boolean).join(" · ");
  // Altitude and last eruption are always shown so every card has the same shape.
  const datos = [
    { titulo: "Altitud", valor: volcan.alturaMsnm === null ? SIN_DATOS : altitudTexto(volcan.alturaMsnm) },
    {
      titulo: "Última erupción",
      valor: volcan.ultimaErupcion === null ? SIN_DATOS : anioTexto(volcan.ultimaErupcion),
    },
    ...(volcan.rankingRiesgo !== null
      ? [{ titulo: "Ranking de riesgo", valor: `#${volcan.rankingRiesgo}` }]
      : []),
  ];

  return (
    <div className="border-l-4 px-3.5 py-3" style={{ borderColor: colorNivel(volcan.nivel) }}>
      <p className="label text-[10px]">Volcán</p>
      <b className="mt-1 block font-display text-[17px] leading-tight text-ink">{volcan.nombre}</b>
      {subtitulo && <span className="mt-0.5 block text-[11px] text-muted">{subtitulo}</span>}

      <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-2">
        {datos.map((d) => (
          <Dato key={d.titulo} {...d} />
        ))}
      </dl>

      <div className="mt-2.5 border-t border-line pt-2">
        <EstadoActividad nivel={volcan.nivel} />
      </div>
    </div>
  );
}
