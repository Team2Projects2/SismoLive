export const INTERVALO_INGESTA_MIN = 10;
const RETRASO_MIN = 30;

export type EstadoIngesta =
  | { tipo: "fresco"; haceMin: number; faltaSeg: number; progreso: number }
  | { tipo: "en-curso"; haceMin: number; progreso: 1 }
  | { tipo: "retrasado"; haceMin: number; progreso: 1 };

export function estadoIngesta(ultima: string, ahora: number): EstadoIngesta {
  const transcurridoSeg = Math.max(0, (ahora - new Date(ultima).getTime()) / 1000);
  const haceMin = Math.floor(transcurridoSeg / 60);
  const intervaloSeg = INTERVALO_INGESTA_MIN * 60;

  if (transcurridoSeg > RETRASO_MIN * 60) return { tipo: "retrasado", haceMin, progreso: 1 };
  if (transcurridoSeg >= intervaloSeg) return { tipo: "en-curso", haceMin, progreso: 1 };
  return {
    tipo: "fresco",
    haceMin,
    faltaSeg: Math.ceil(intervaloSeg - transcurridoSeg),
    progreso: transcurridoSeg / intervaloSeg,
  };
}

// "06:42" style countdown.
export function cuentaRegresiva(segundos: number): string {
  const s = Math.max(0, Math.round(segundos));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// Poll fast once the next run is due so the header flips as soon as new data lands.
export function intervaloSondeoMs(ultima: string | null | undefined, ahora: number): number {
  if (!ultima) return 60_000;
  return estadoIngesta(ultima, ahora).tipo === "fresco" ? 60_000 : 15_000;
}
