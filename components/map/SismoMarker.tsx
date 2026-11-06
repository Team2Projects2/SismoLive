import { Marker } from "react-map-gl/mapbox";
import { fechaHora, lugarEs } from "@/lib/formato";
import { colorPorMagnitud, magnitudMw, richterEstimado, tamanoPorMagnitud } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";
import CerrarBoton from "./CerrarBoton";

// Above every volcano (active ones stack up to ~20) but below popups (50).
const Z_ULTIMO = 30;

type LadoEtiqueta = "derecha" | "izquierda" | "arriba";

type Props = {
  sismo: Sismo;
  esUltimo: boolean;
  mostrarEtiqueta: boolean;
  ladoEtiqueta: LadoEtiqueta;
  onCerrarEtiqueta: () => void;
  onSeleccionar: (sismo: Sismo) => void;
  onHover: (sismo: Sismo | null) => void;
};

export default function SismoMarker({
  sismo,
  esUltimo,
  mostrarEtiqueta,
  ladoEtiqueta,
  onCerrarEtiqueta,
  onSeleccionar,
  onHover,
}: Props) {
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
      {/* The callout is a sibling of the dot, so moving into it to close it does not
          trigger the dot's hover popup. */}
      <div className="relative">
        <button
          type="button"
          onClick={() => onSeleccionar(sismo)}
          aria-label={`Ver información del sismo: ${magnitudMw(sismo.magnitud)} (${richterEstimado(sismo.magnitud)}), ${lugarEs(sismo.lugar)}`}
          className={`block cursor-pointer appearance-none rounded-full border-0 p-0 ${
            esUltimo ? "sismo-pulso" : ""
          }`}
          style={{
            width: tam,
            height: tam,
            background: color,
            color,
            boxShadow: "0 0 0 1.5px rgb(255 253 248 / 0.95), 0 1px 3px rgb(32 29 25 / 0.3)",
          }}
          onMouseEnter={() => onHover(sismo)}
          onMouseLeave={() => onHover(null)}
        />

        {esUltimo && mostrarEtiqueta && (
          <EtiquetaUltimo
            sismo={sismo}
            color={color}
            lado={ladoEtiqueta}
            onCerrar={onCerrarEtiqueta}
          />
        )}
      </div>
    </Marker>
  );
}

// Always-visible callout for the newest quake: connector line + paper card.
const POSICION: Record<LadoEtiqueta, string> = {
  derecha: "left-full top-1/2 -translate-y-1/2 flex-row",
  izquierda: "right-full top-1/2 -translate-y-1/2 flex-row-reverse",
  arriba: "bottom-full left-1/2 -translate-x-1/2 flex-col-reverse",
};

const LINEA: Record<LadoEtiqueta, string> = {
  derecha: "h-px w-3 bg-gradient-to-r from-transparent to-[#a39a8b]",
  izquierda: "h-px w-3 bg-gradient-to-l from-transparent to-[#a39a8b]",
  arriba: "h-3 w-px bg-gradient-to-t from-transparent to-[#a39a8b]",
};

function EtiquetaUltimo({
  sismo,
  color,
  lado,
  onCerrar,
}: {
  sismo: Sismo;
  color: string;
  lado: LadoEtiqueta;
  onCerrar: () => void;
}) {
  return (
    <div
      className={`pointer-events-none absolute flex items-center ${POSICION[lado]}`}
    >
      <span className={`flex-none ${LINEA[lado]}`} />
      <div
        className="pointer-events-auto w-[230px] max-w-[calc(100vw-2rem)] rounded-lg border border-line bg-surface/95 px-2.5 py-2 shadow-[0_10px_28px_rgba(32,29,25,0.16)] backdrop-blur-sm"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
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
          <CerrarBoton
            onClick={onCerrar}
            label="Cerrar etiqueta del último sismo"
            className="-mr-1 -mt-1"
          />
        </div>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold leading-none tabular-nums">
            {sismo.magnitud.toFixed(1)}
          </span>
          <span className="text-[9px] font-semibold tracking-[0.14em] text-muted">Mw</span>
          <span className="text-[9px] text-muted">({richterEstimado(sismo.magnitud)})</span>
        </div>
        <div className="mt-0.5 max-w-[200px] truncate text-[11px] text-ink-soft">
          {lugarEs(sismo.lugar)}
        </div>
        <div className="mt-1 whitespace-nowrap text-[10px] text-muted">{fechaHora(sismo.fecha)}</div>
      </div>
    </div>
  );
}
