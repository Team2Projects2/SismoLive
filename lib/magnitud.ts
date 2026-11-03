export const LEYENDA_MAGNITUD = [
  { color: "#b91c1c", etiqueta: "6.0+ Severo" },
  { color: "#ef4444", etiqueta: "5.0 – 5.9 Fuerte" },
  { color: "#f97316", etiqueta: "4.5 – 4.9 Moderado" },
  { color: "#facc15", etiqueta: "4.0 – 4.4 Leve" },
  { color: "#2dd4bf", etiqueta: "< 4.0 Menor" },
] as const;

export function colorPorMagnitud(magnitud: number): string {
  if (magnitud >= 6) return LEYENDA_MAGNITUD[0].color;
  if (magnitud >= 5) return LEYENDA_MAGNITUD[1].color;
  if (magnitud >= 4.5) return LEYENDA_MAGNITUD[2].color;
  if (magnitud >= 4) return LEYENDA_MAGNITUD[3].color;
  return LEYENDA_MAGNITUD[4].color;
}

export function tamanoPorMagnitud(magnitud: number): number {
  return Math.max(7, 8 + (magnitud - 4) * 10);
}
