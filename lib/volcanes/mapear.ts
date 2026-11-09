export type NivelVolcan = 0 | 1 | 2 | 3 | 4 | 5;

export type Volcan = {
  nombre: string;
  region: string | null;
  lat: number;
  lng: number;
  // null when no activity source is available (fallback catalog without EAV).
  nivel: NivelVolcan | null;
  rankingRiesgo: number | null;
  alturaMsnm: number | null;
  actualizado: string | null;
};

type Registro = Record<string, unknown>;

// The RNVV API sends coordinates as strings ("-40.3660000"); accept numbers too.
function aNumero(valor: unknown): number | null {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  if (typeof valor === "string" && valor.trim() !== "") {
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function aTexto(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : null;
}

function aFechaIso(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
}

function esNivel(valor: unknown): valor is NivelVolcan {
  return Number.isInteger(valor) && (valor as number) >= 0 && (valor as number) <= 5;
}

export function registroAVolcan(registro: unknown): Volcan | null {
  if (typeof registro !== "object" || registro === null) return null;
  const r = registro as Registro;

  const nombre = aTexto(r.nombre);
  const lat = aNumero(r.latitud);
  const lng = aNumero(r.longitud);
  if (!nombre || lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  if (!esNivel(r.nivel)) return null;

  return {
    nombre,
    region: aTexto(r.region),
    lat,
    lng,
    nivel: r.nivel,
    rankingRiesgo: aNumero(r.ranking_riesgo),
    alturaMsnm: aNumero(r.altura_msnm),
    actualizado: aFechaIso(r.updated_at),
  };
}

export function mapearVolcanes(datos: unknown): Volcan[] {
  if (!Array.isArray(datos)) return [];
  return datos.map(registroAVolcan).filter((v): v is Volcan => v !== null);
}
