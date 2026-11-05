import { useId } from "react";
import type { NivelVolcan } from "@/lib/volcanes/mapear";
import { NIVEL_COLOR } from "@/lib/volcanes/nivel";

type Bocanada = [cx: number, cy: number, r: number, opacidad: number];

const HUMO: Record<number, Bocanada[]> = {
  1: [[21, 10, 2.6, 0.75], [23.5, 7, 3, 0.55]],
  2: [[20.5, 10, 3, 0.85], [23, 6.5, 3.8, 0.75], [27, 4, 4.2, 0.6], [31, 3, 3.5, 0.45]],
};
const CENIZA: Bocanada[] = [[20, 7, 4.5, 0.95], [17, 3.5, 4.5, 0.9], [23, 3, 5, 0.9], [27, 5.5, 3.8, 0.8]];

// Cone and snow-cap outlines in the 40x36 viewBox; shared with the group icon.
export const CONO_D =
  "M1 34 C6 31 9 27 12 22 C14 18 15.5 15 17 12.5 L18.2 11.6 L20 12.6 L21.8 11.4 L23 12.5 C24.5 15 26 18.5 28 22.5 C30.5 27 34 31 39 34 Z";
export const NIEVE_D =
  "M17 12.5 L18.2 11.6 L20 12.6 L21.8 11.4 L23 12.5 C23.7 13.8 24.4 15 25 16.4 L23.6 15.6 L22.5 17 L21 15.4 L19.5 17.2 L18 15.5 L16.6 16.8 L15.2 15.8 C15.9 14.6 16.4 13.5 17 12.5 Z";

type Props = { nivel: NivelVolcan; ancho: number };

export default function VolcanIcon({ nivel, ancho }: Props) {
  // useId output can contain characters (":", "«") that break url(#...) references; keep safe ones.
  const id = `v${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const erupcion = nivel >= 3;
  const bocanadas = erupcion ? CENIZA : (HUMO[nivel] ?? []);
  const rellenoHumo = `url(#${id}${erupcion ? "a" : "s"})`;

  return (
    <svg
      width={ancho}
      height={ancho * 0.9}
      viewBox="0 0 40 36"
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
        <radialGradient id={`${id}s`}>
          <stop offset="0" stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#94a3b8" />
        </radialGradient>
        <radialGradient id={`${id}a`}>
          <stop offset="0" stopColor="#57534e" />
          <stop offset="1" stopColor="#1c1917" />
        </radialGradient>
        <linearGradient id={`${id}l`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
        <filter id={`${id}g`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <ellipse cx="20" cy="34" rx="17" ry="2" fill="#201d19" opacity=".18" />
      <path d={CONO_D} fill={`url(#${id}m)`} />
      {/* Snow cap, dimmed by ash during eruptions */}
      <path
        d={NIEVE_D}
        fill={erupcion ? "#e7e5e4" : "#f8fafc"}
        opacity={erupcion ? 0.55 : 0.95}
      />
      <path
        d="M12 22 L13.5 21 M27 21.5 L28.5 22.6 M9 27 L10.6 26.2"
        stroke="#2a1f17"
        strokeWidth=".8"
        opacity=".6"
      />

      {erupcion && (
        <>
          <path
            d="M18.5 13 Q17 18 15 22 Q13.5 26 12.5 30"
            stroke={`url(#${id}l)`}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M21.5 13 Q23 19 25.5 24 Q27 28 28 31"
            stroke={`url(#${id}l)`}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="20" cy="12" rx="5" ry="3" fill="#f97316" opacity=".8" filter={`url(#${id}g)`} />
        </>
      )}

      {bocanadas.map(([cx, cy, r, o]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={rellenoHumo} opacity={o} />
      ))}

      {erupcion && (
        <>
          <path
            d="M18 9 L15 4 M20 9 L20 2.5 M22 9 L25 4.5"
            stroke="#fb923c"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="14.5" cy="3.5" r=".9" fill="#fbbf24" />
          <circle cx="25.5" cy="4" r=".9" fill="#fbbf24" />
        </>
      )}

      <circle cx="35" cy="30" r="4.2" fill={NIVEL_COLOR[nivel]} stroke="#fbf9f4" strokeWidth="1.2" />
      <text
        x="35"
        y="31.8"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="700"
        fill="#fffdf8"
        fontFamily="system-ui"
      >
        {nivel}
      </text>
    </svg>
  );
}
