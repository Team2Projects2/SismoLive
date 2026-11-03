import { Marker } from "react-map-gl/mapbox";
import { fechaHora, lugarEs } from "@/lib/formato";
import { colorPorMagnitud, tamanoPorMagnitud } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";

// Above every volcano (active ones stack up to ~20) but below popups (50).
const Z_ULTIMO = 30;

type Props = {
  sismo: Sismo;
  esUltimo: boolean;
  onHover: (sismo: Sismo | null) => void;
};

export default function SismoMarker({ sismo, esUltimo, onHover }: Props) {
  const color = colorPorMagnitud(sismo.magnitud);
  const tam = tamanoPorMagnitud(sismo.magnitud);

  // Mapbox owns the Marker root (absolute positioning): never set `position` on it.
  // All styling lives on the inner element.
  return (
    <Marker
      longitude={sismo.lng}
      latitude={sismo.lat}
      anchor="center"
      style={esUltimo ? { zIndex: Z_ULTIMO } : undefined}
    >
      <div
        className="sismo-pulso cursor-pointer"
        style={{ width: tam, height: tam, background: color, color, boxShadow: `0 0 14px ${color}` }}
        onMouseEnter={() => onHover(sismo)}
        onMouseLeave={() => onHover(null)}
      >
        {esUltimo && <EtiquetaUltimo sismo={sismo} color={color} />}
      </div>
    </Marker>
  );
}

// Always-visible callout for the newest quake: connector line + dark glass card.
function EtiquetaUltimo({ sismo, color }: { sismo: Sismo; color: string }) {
  return (
    <div className="pointer-events-none absolute left-full top-1/2 flex -translate-y-1/2 items-center">
      <span className="h-px w-4 bg-gradient-to-r from-transparent to-white/50" />
      <div
        className="rounded-lg border border-white/10 bg-[rgb(13_21_38/0.82)] px-2.5 py-1.5 shadow-[0_8px_24px_rgb(0_0_0/0.5)] backdrop-blur-md"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: color }} />
            <span className="relative inline-flex size-1.5 rounded-full" style={{ background: color }} />
          </span>
          Último sismo
        </div>
        <div className="mt-0.5 flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-base font-bold leading-none text-white">M {sismo.magnitud.toFixed(1)}</span>
          <span className="max-w-[180px] truncate text-[11px] text-slate-300">{lugarEs(sismo.lugar)}</span>
        </div>
        <div className="mt-0.5 whitespace-nowrap text-[10px] text-slate-400">{fechaHora(sismo.fecha)}</div>
      </div>
    </div>
  );
}
