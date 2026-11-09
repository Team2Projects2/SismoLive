"use client";

import dynamic from "next/dynamic";
import { memo, useEffect, useMemo, useRef, useState } from "react";
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

const PANELES_MAPA = [
  { id: "ultimo", etiqueta: "Último sismo" },
  { id: "capas", etiqueta: "Capas" },
  { id: "leyenda", etiqueta: "Leyenda" },
] as const;

type PanelMapa = (typeof PANELES_MAPA)[number]["id"];
type PanelesMapa = Record<PanelMapa, boolean>;

export default function Dashboard() {
  const { sismos, cargando, error } = useSismos();
  const { volcanes, error: errorVolcanes, sinActividad } = useVolcanes();
  const avisoVolcanes = errorVolcanes
    ? "Volcanes no disponibles"
    : sinActividad
      ? "Sin datos de actividad volcánica"
      : null;
  const ahora = useAhora();
  const [pestana, setPestana] = useState<Pestana>("chile");
  const [capas, setCapas] = useState<Capas>({ sismos: true, placas: false, volcanes: true });
  const [foco, setFoco] = useState<Foco | null>(null);
  const [paneles, setPaneles] = useState<PanelesMapa>({
    ultimo: true,
    capas: true,
    leyenda: true,
  });
  const [menuPaneles, setMenuPaneles] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const chile = useMemo(() => sismos.filter((s) => esChile(s.lugar)), [sismos]);
  const lista = pestana === "chile" ? chile : sismos;
  const hayPanelesOcultos = !paneles.ultimo || !paneles.capas || !paneles.leyenda;

  const mensaje = cargando
    ? "Cargando sismos…"
    : error
      ? "No se pudieron cargar los datos."
      : lista.length === 0
        ? "No hay sismos registrados."
        : null;

  useEffect(() => {
    if (!menuPaneles) return;

    function alPresionar(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuPaneles(false);
    }
    function alTeclear(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuPaneles(false);
    }

    document.addEventListener("pointerdown", alPresionar);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("pointerdown", alPresionar);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [menuPaneles]);

  function seleccionar(s: Sismo) {
    setFoco((f) => ({ lng: s.lng, lat: s.lat, n: (f?.n ?? 0) + 1 }));
  }

  function alternarPanel(id: PanelMapa) {
    const siguiente = { ...paneles, [id]: !paneles[id] };
    setPaneles(siguiente);
    if (siguiente.ultimo && siguiente.capas && siguiente.leyenda) setMenuPaneles(false);
  }

  function cerrarPanel(id: PanelMapa) {
    setPaneles((p) => ({ ...p, [id]: false }));
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
          <SismosMap
            sismos={lista}
            volcanes={volcanes}
            capas={capas}
            foco={foco}
            mostrarUltimo={paneles.ultimo}
            onCerrarUltimo={() => cerrarPanel("ultimo")}
          />
        </div>

        {/* No permanent tab bar: this icon only appears once an overlay has been closed. */}
        {hayPanelesOcultos && (
          <div ref={menuRef} className="absolute left-3 top-3 z-20">
            <button
              type="button"
              aria-expanded={menuPaneles}
              aria-controls="paneles-mapa-menu"
              aria-label="Paneles del mapa"
              title="Paneles del mapa"
              onClick={() => setMenuPaneles((abierto) => !abierto)}
              className={`panel flex h-8 w-8 cursor-pointer items-center justify-center ${
                menuPaneles ? "bg-surface-2 text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
                <path d="M6 2.5v11" />
              </svg>
            </button>

            {menuPaneles && (
              <div
                id="paneles-mapa-menu"
                role="group"
                aria-label="Paneles del mapa"
                className="panel absolute left-0 top-full mt-1.5 w-52 p-2"
              >
                <p className="label px-2 pb-1.5">Paneles del mapa</p>
                <div className="flex flex-col gap-0.5">
                  {PANELES_MAPA.map((panel) => {
                    const activo = paneles[panel.id];
                    return (
                      <button
                        key={panel.id}
                        type="button"
                        role="switch"
                        aria-checked={activo}
                        onClick={() => alternarPanel(panel.id)}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[12px] text-ink-soft transition-colors hover:bg-surface-2"
                      >
                        <span>{panel.etiqueta}</span>
                        <span
                          aria-hidden="true"
                          className={`relative inline-flex h-[18px] w-8 flex-none items-center rounded-full border transition-colors ${
                            activo
                              ? "border-accent bg-accent"
                              : "border-line-strong bg-surface-2"
                          }`}
                        >
                          <span
                            className={`absolute top-[3px] h-3 w-3 rounded-full transition-transform ${
                              activo ? "left-[17px] bg-surface" : "left-[3px] bg-line-strong"
                            }`}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop: overlays float on the right. Mobile: they flow below the map, full width. */}
        {(paneles.capas || paneles.leyenda) && (
          <div className="mt-3 flex flex-col gap-2.5 lg:pointer-events-none lg:absolute lg:inset-y-3 lg:right-3 lg:z-10 lg:mt-0 lg:w-[220px]">
            {paneles.capas && (
              <div className="lg:pointer-events-auto">
                <CapasPanel
                  capas={capas}
                  onChange={setCapas}
                  avisoVolcanes={avisoVolcanes}
                  onClose={() => cerrarPanel("capas")}
                />
              </div>
            )}
            {paneles.leyenda && (
              // No flex-1: a stretched wrapper would catch map clicks in the empty space below the legend.
              <div className="min-h-0 lg:pointer-events-auto lg:overflow-y-auto">
                <Leyenda onClose={() => cerrarPanel("leyenda")} />
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
