"use client";

import { useAhora } from "@/hooks/useAhora";
import { useIngesta } from "@/hooks/useIngesta";
import { cuentaRegresiva, estadoIngesta } from "@/lib/ingesta/estado";

export default function EstadoActualizacion() {
  const { ultima, error } = useIngesta();
  // 1 s tick for the countdown; only this small component re-renders.
  const ahora = useAhora(1000);

  if (error) {
    return (
      <Panel>
        <p className="text-[12px] leading-relaxed text-muted">
          No se pudo obtener el estado de actualización.
        </p>
      </Panel>
    );
  }
  if (!ultima || ahora === null) {
    return (
      <Panel>
        <p className="text-[12px] leading-relaxed text-muted">Cargando estado…</p>
      </Panel>
    );
  }

  const estado = estadoIngesta(ultima, ahora);
  const fresco = estado.tipo === "fresco";
  const retrasado = estado.tipo === "retrasado";
  const color = retrasado ? "bg-warn" : fresco ? "bg-ok" : "bg-accent";

  return (
    <div className="rounded-lg border border-line bg-surface-2 px-3.5 py-2.5" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label">Última actualización</span>
        <span
          className={`inline-flex items-center gap-1.5 text-[12px] font-medium tabular-nums ${
            retrasado ? "text-warn" : "text-ink-soft"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
          hace {estado.haceMin} min
        </span>
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-muted">
          {fresco ? "Próxima actualización" : "Estado"}
        </span>
        <span className="font-display text-[17px] leading-none tabular-nums">
          {fresco ? (
            cuentaRegresiva(estado.faltaSeg)
          ) : retrasado ? (
            "Con retraso"
          ) : (
            "En curso"
          )}
        </span>
      </div>

      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Tiempo hasta la próxima actualización"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(estado.progreso * 100)}
      >
        <i
          className={`block h-full rounded-full transition-[width] duration-500 ${color}`}
          style={{ width: `${Math.min(100, estado.progreso * 100)}%` }}
        />
      </div>

      {retrasado && (
        <p className="mt-2 text-[11px] leading-snug text-muted">
          La ingesta puede demorar unos minutos.
        </p>
      )}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 px-3.5 py-2.5" aria-live="polite">
      {children}
    </div>
  );
}
