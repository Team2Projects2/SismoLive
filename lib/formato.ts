// Plain-language bearings for a general audience: the 16-point compass is reduced to 8 words.
// Three-letter bearings (e.g. NNE) are within 22.5° of their first letter, so they map to it.
const RUMBOS: Record<string, string> = {
  N: "norte", NNE: "norte", NE: "noreste", ENE: "este",
  E: "este", ESE: "este", SE: "sureste", SSE: "sur",
  S: "sur", SSW: "sur", SW: "suroeste", WSW: "oeste",
  W: "oeste", WNW: "oeste", NW: "noroeste", NNW: "norte",
};

const PREFIJOS: [RegExp, string][] = [
  [/^offshore /i, "frente a la costa de "],
  [/^off the coast of /i, "frente a la costa de "],
  [/^near the coast of /i, "cerca de la costa de "],
];

// USGS places look like "25 km NNE of Calama, Chile"; translate them to plain Spanish.
export function lugarEs(lugar: string): string {
  const conRumbo = lugar.replace(
    /^(\d+(?:\.\d+)? km) ([NSEW]{1,3}) of /,
    (_, km: string, rumbo: string) => `${km} al ${RUMBOS[rumbo] ?? rumbo} de `,
  );
  return PREFIJOS.reduce((texto, [patron, reemplazo]) => texto.replace(patron, reemplazo), conRumbo);
}

export function haceTiempo(iso: string, ahora: number): string {
  const min = Math.max(0, Math.round((ahora - new Date(iso).getTime()) / 60_000));
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} día${d > 1 ? "s" : ""}`;
}

// Fixed Chile time zone so every viewer (and the server render) shows the same local time.
const FORMATO_FECHA_HORA = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Santiago",
});

export function fechaHora(iso: string): string {
  return `${FORMATO_FECHA_HORA.format(new Date(iso))} (hora de Chile)`;
}

// Compact variant for cards and lists; keeps the same fixed Chile time zone.
const FORMATO_CORTO = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Santiago",
});

export function fechaHoraCorta(iso: string): string {
  return FORMATO_CORTO.format(new Date(iso));
}

export function profundidadTexto(profundidad: number | null): string {
  return profundidad === null ? "profundidad desconocida" : `${Math.round(profundidad)} km prof.`;
}
