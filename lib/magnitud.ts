export function colorPorMagnitud(magnitud: number): string {
  if (magnitud >= 6) return "#ef4444";
  if (magnitud >= 5) return "#f97316";
  if (magnitud >= 4) return "#facc15";
  return "#4ade80";
}
