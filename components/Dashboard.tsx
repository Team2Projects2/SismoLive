"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useAhora } from "@/hooks/useAhora";
import { useSismos } from "@/hooks/useSismos";
import { useVolcanes } from "@/hooks/useVolcanes";
import { esChile } from "@/lib/region";
import type { Sismo } from "@/lib/types";
import CapasPanel, { type Capas } from "./map/CapasPanel";
import Leyenda from "./map/Leyenda";
import type { Foco } from "./map/SismosMap";
import SismosRecientes, { type Pestana } from "./sidebar/SismosRecientes";
import UltimoSismo from "./sidebar/UltimoSismo";

const SismosMap = dynamic(() => import("./map/SismosMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-panel" />,
});

const LIMITE_LISTA = 80;

export default function Dashboard() {
  const { sismos, cargando, error } = useSismos();
  const { volcanes, error: errorVolcanes } = useVolcanes();
  const ahora = useAhora();
  const [pestana, setPestana] = useState<Pestana>("chile");
  const [capas, setCapas] = useState<Capas>({ sismos: true, placas: false, volcanes: true });
  const [foco, setFoco] = useState<Foco | null>(null);

  const chile = useMemo(() => sismos.filter((s) => esChile(s.lugar)), [sismos]);
  const lista = pestana === "chile" ? chile : sismos;

  const mensaje = cargando
    ? "Cargando sismos…"
    : error
      ? "No se pudieron cargar los datos."
      : lista.length === 0
        ? "No hay sismos registrados."
        : null;

  function seleccionar(s: Sismo) {
    setFoco((f) => ({ lng: s.lng, lat: s.lat, n: (f?.n ?? 0) + 1 }));
  }

  return (
    <main className="grid flex-1 gap-3.5 p-3.5 md:min-h-0 md:grid-cols-[1fr_360px]">
      <div className="relative h-[60vh] overflow-hidden rounded-xl border border-line md:h-auto">
        <SismosMap sismos={lista} volcanes={volcanes} capas={capas} foco={foco} />
        <CapasPanel capas={capas} onChange={setCapas} volcanesNoDisponibles={errorVolcanes} />
        <Leyenda />
      </div>

      <aside className="flex flex-col gap-3 md:min-h-0 md:overflow-hidden">
        <UltimoSismo sismo={lista[0] ?? null} ahora={ahora} mensaje={mensaje} />
        <SismosRecientes
          pestana={pestana}
          onPestana={setPestana}
          conteo={{ chile: chile.length, todos: sismos.length }}
          // Full list including the newest quake, so the count badge matches the rows shown.
          sismos={lista.slice(0, LIMITE_LISTA)}
          ahora={ahora}
          mensaje={lista.length > 1 ? null : mensaje}
          onSelect={seleccionar}
        />
      </aside>
    </main>
  );
}
