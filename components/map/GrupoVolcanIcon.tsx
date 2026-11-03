import { useId } from "react";
import type { NivelVolcan } from "@/lib/volcanes/mapear";
import { NIVEL_COLOR } from "@/lib/volcanes/nivel";
import { CONO_D, NIEVE_D } from "./VolcanIcon";

// Back-left, back-right, then front-center so the middle cone overlaps the others.
const CONOS = [
  { x: 0, y: 10.2, escala: 0.7 },
  { x: 22, y: 10.2, escala: 0.7 },
  { x: 9.5, y: 6.8, escala: 0.8 },
] as const;

type Props = { nivel: NivelVolcan; cantidad: number; ancho: number };

export default function GrupoVolcanIcon({ nivel, cantidad, ancho }: Props) {
  // useId output can contain characters (":", "«") that break url(#...) references; keep safe ones.
  const id = `g${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      width={ancho}
      height={ancho * 0.72}
      viewBox="0 0 50 36"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}m`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5b4636" />
          <stop offset=".5" stopColor="#7a5f49" />
          <stop offset=".55" stopColor="#4a382b" />
          <stop offset="1" stopColor="#2e231b" />
        </linearGradient>
      </defs>

      <ellipse cx="25" cy="34" rx="23" ry="2" fill="#000" opacity=".35" />
      {CONOS.map(({ x, y, escala }) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${escala})`}>
          <path d={CONO_D} fill={`url(#${id}m)`} stroke="#1f1610" strokeWidth=".8" />
          <path d={NIEVE_D} fill="#f8fafc" opacity=".95" />
        </g>
      ))}

      <circle cx="45" cy="29" r="6" fill={NIVEL_COLOR[nivel]} stroke="#0b1220" strokeWidth="1.2" />
      <text
        x="45"
        y="31.4"
        textAnchor="middle"
        fontSize={cantidad > 9 ? "6" : "7"}
        fontWeight="700"
        fill="#0b1220"
        fontFamily="system-ui"
      >
        {cantidad}
      </text>
    </svg>
  );
}
