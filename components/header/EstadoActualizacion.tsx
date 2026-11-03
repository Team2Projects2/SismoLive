"use client";

import { useAhora } from "@/hooks/useAhora";
import { useIngesta } from "@/hooks/useIngesta";
import { cuentaRegresiva, estadoIngesta } from "@/lib/ingesta/estado";

export default function EstadoActualizacion() {
  const { ultima, error } = useIngesta();
  // 1 s tick for the countdown; only this small component re-renders.
  const ahora = useAhora(1000);

  if (error) {
    return <Contenedor>No se pudo obtener el estado de actualización</Contenedor>;
  }
  if (!ultima || ahora === null) {
    return <Contenedor>Cargando estado…</Contenedor>;
  }

  const estado = estadoIngesta(ultima, ahora);
  const fresco = estado.tipo === "fresco";
  const retrasado = estado.tipo === "retrasado";

  return (
    <Contenedor>
      <div className={`flex items-center gap-1.5 text-[13px] ${retrasado ? "text-amber-400" : "text-foreground"}`}>
        {fresco && <span className="h-[9px] w-[9px] rounded-full bg-ok shadow-[0_0_8px_var(--color-ok)]" />}
        {retrasado && <b>Datos con retraso ·</b>}
        <span>
          Actualizado hace <b>{estado.haceMin} min</b>
        </span>
      </div>
      <div>
        {fresco ? (
          <>
            Próxima actualización en <b className="tabular-nums">{cuentaRegresiva(estado.faltaSeg)}</b>
          </>
        ) : (
          "Próxima actualización: en curso (puede demorar unos minutos)"
        )}
      </div>
      <div
        className="h-1 w-40 overflow-hidden rounded-sm bg-line"
        role="progressbar"
        aria-label="Tiempo hasta la próxima actualización"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(estado.progreso * 100)}
      >
        <i
          className={`block h-full ${retrasado ? "bg-amber-400" : "bg-[#60a5fa]"}`}
          style={{ width: `${Math.min(100, estado.progreso * 100)}%` }}
        />
      </div>
    </Contenedor>
  );
}

function Contenedor({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-0.5 text-xs text-muted sm:ml-auto sm:items-end" aria-live="polite">
      {children}
    </div>
  );
}
