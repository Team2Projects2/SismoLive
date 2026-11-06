"use client";

import dynamic from "next/dynamic";
import { memo, useMemo, useState } from "react";
import { useAhora } from "@/hooks/useAhora";
import { useSismos } from "@/hooks/useSismos";
import { useVolcanes } from "@/hooks/useVolcanes";
import { esChile } from "@/lib/region";
import type { Sismo } from "@/lib/types";
import Footer from "./Footer";
import Header from "./Header";
import CapasPanel, { type Capas } from "./map/CapasPanel";
import Leyenda from "./map/Leyenda";
import type { Foco } from "./map/SismosMap";
import SismosRecientes, { type Pestana } from "./sidebar/SismosRecientes";
import UltimoSismo from "./sidebar/UltimoSismo";

const SismosMap = memo(
  dynamic(() => import("./map/SismosMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-surface-2" />,
  }),
);

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
    <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-5 px-4 py-4 sm:px-6 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-6 lg:px-7 lg:py-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      {/* On small screens the wrapper "disappears" so its children can sit above and below the map. */}
      <aside className="contents lg:flex lg:min-h-0 lg:flex-col lg:gap-4">
        <div className="order-1 lg:flex-none">
          <Header />
        </div>

        <div className="order-2 lg:flex-none">
          <UltimoSismo sismo={lista[0] ?? null} ahora={ahora} mensaje={mensaje} />
        </div>

        <div className="order-4 lg:flex lg:min-h-0 lg:flex-1 lg:overflow-hidden">
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
        </div>

        <div className="order-5 lg:flex-none">
          <Footer />
        </div>
      </aside>

      <section className="relative order-3 lg:order-none lg:h-auto lg:min-h-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-line lg:bg-surface-2">
        <div className="h-[58vh] min-h-[400px] overflow-hidden rounded-2xl border border-line bg-surface-2 lg:h-full lg:rounded-none lg:border-0">
          <SismosMap sismos={lista} volcanes={volcanes} capas={capas} foco={foco} />
        </div>

        {/* Desktop: legends float on the right. Mobile: they flow below the map, full width. */}
        <div className="mt-3 flex flex-col gap-2.5 lg:pointer-events-none lg:absolute lg:inset-y-3 lg:right-3 lg:z-10 lg:mt-0 lg:w-[220px]">
          <div className="lg:pointer-events-auto">
            <CapasPanel capas={capas} onChange={setCapas} volcanesNoDisponibles={errorVolcanes} />
          </div>
          {/* No flex-1: a stretched wrapper would catch map clicks in the empty space below the legend. */}
          <div className="min-h-0 lg:pointer-events-auto lg:overflow-y-auto">
            <Leyenda />
          </div>
        </div>
      </section>
    </main>
  );
}
