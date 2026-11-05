export const LEYENDA_MAGNITUD = [
  { color: "#7f1d1d", etiqueta: "6.0+ Severo" },
  { color: "#b42318", etiqueta: "5.0 – 5.9 Fuerte" },
  { color: "#c2410c", etiqueta: "4.5 – 4.9 Moderado" },
  { color: "#a16207", etiqueta: "4.0 – 4.4 Leve" },
  { color: "#0f766e", etiqueta: "< 4.0 Menor" },
] as const;

export function colorPorMagnitud(magnitud: number): string {
  if (magnitud >= 6) return LEYENDA_MAGNITUD[0].color;
  if (magnitud >= 5) return LEYENDA_MAGNITUD[1].color;
  if (magnitud >= 4.5) return LEYENDA_MAGNITUD[2].color;
  if (magnitud >= 4) return LEYENDA_MAGNITUD[3].color;
  return LEYENDA_MAGNITUD[4].color;
}

export function tamanoPorMagnitud(magnitud: number): number {
  return Math.max(7, Math.min(40, 8 + (magnitud - 4) * 9));
}
