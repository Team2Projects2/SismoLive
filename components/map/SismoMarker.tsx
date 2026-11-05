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
        className={`relative cursor-pointer rounded-full ${esUltimo ? "sismo-pulso" : ""}`}
        style={{
          width: tam,
          height: tam,
          background: color,
          color,
          boxShadow: "0 0 0 1.5px rgb(255 253 248 / 0.95), 0 1px 3px rgb(32 29 25 / 0.3)",
        }}
        onMouseEnter={() => onHover(sismo)}
        onMouseLeave={() => onHover(null)}
      >
        {esUltimo && <EtiquetaUltimo sismo={sismo} color={color} />}
      </div>
    </Marker>
  );
}

// Always-visible callout for the newest quake: connector line + paper card.
function EtiquetaUltimo({ sismo, color }: { sismo: Sismo; color: string }) {
  return (
    <div className="pointer-events-none absolute left-full top-1/2 flex -translate-y-1/2 items-center">
      <span className="h-px w-3 bg-gradient-to-r from-transparent to-[#a39a8b]" />
      <div
        className="rounded-lg border border-line bg-surface/95 px-2.5 py-2 shadow-[0_10px_28px_rgba(32,29,25,0.16)] backdrop-blur-sm"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
              style={{ background: color }}
            />
            <span
              className="relative inline-flex size-1.5 rounded-full"
              style={{ background: color }}
            />
          </span>
          Último sismo
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-[15px] font-semibold leading-none tabular-nums">
            M {sismo.magnitud.toFixed(1)}
          </span>
          <span className="max-w-[180px] truncate text-[11px] text-ink-soft">
            {lugarEs(sismo.lugar)}
          </span>
        </div>
        <div className="mt-1 whitespace-nowrap text-[10px] text-muted">{fechaHora(sismo.fecha)}</div>
      </div>
    </div>
  );
}
