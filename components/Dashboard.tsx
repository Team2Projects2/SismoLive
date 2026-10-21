"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useSismos } from "@/hooks/useSismos";
import { colorPorMagnitud } from "@/lib/magnitud";
import SismosTable from "./SismosTable";

const SismosMap = dynamic(() => import("./SismosMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900" />,
});

const formatoFecha = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
});

const LEYENDA = [
  { etiqueta: "< 4", magnitud: 3 },
  { etiqueta: "4 – 5", magnitud: 4 },
  { etiqueta: "5 – 6", magnitud: 5 },
  { etiqueta: "≥ 6", magnitud: 6 },
];

export default function Dashboard() {
  const { sismos, cargando, error } = useSismos();
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const resumen = useMemo(() => {
    if (sismos.length === 0) return null;
    const mayor = sismos.reduce((a, b) => (b.magnitud > a.magnitud ? b : a));
    return { total: sismos.length, mayor, ultimo: sismos[0] };
  }, [sismos]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-9">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          RealTime Data
        </h1>
        <p className="mt-2 text-slate-400">
          Sismos recientes en Chile, actualizados en tiempo real.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Tarjeta titulo="Sismos registrados" valor={resumen?.total ?? "—"} />
        <Tarjeta
          titulo="Mayor magnitud"
          valor={resumen ? resumen.mayor.magnitud.toFixed(1) : "—"}
          color={resumen ? colorPorMagnitud(resumen.mayor.magnitud) : undefined}
        />
        <Tarjeta
          titulo="Último sismo"
          valor={resumen ? formatoFecha.format(new Date(resumen.ultimo.fecha)) : "—"}
          pequeno
        />
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        <SismosTable
          sismos={sismos}
          cargando={cargando}
          error={error}
          seleccionado={seleccionado}
          onSelect={setSeleccionado}
        />
        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/30 md:h-[520px]">
          <SismosMap
            sismos={sismos}
            seleccionado={seleccionado}
            onSelect={setSeleccionado}
          />
          <div className="absolute bottom-6 left-3 z-[1000] rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 backdrop-blur">
            <p className="mb-1.5 font-medium text-slate-400">Magnitud</p>
            <ul className="space-y-1">
              {LEYENDA.map((l) => (
                <li key={l.etiqueta} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colorPorMagnitud(l.magnitud) }}
                  />
                  {l.etiqueta}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

function Tarjeta({
  titulo,
  valor,
  color,
  pequeno,
}: {
  titulo: string;
  valor: string | number;
  color?: string;
  pequeno?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 shadow-lg shadow-black/20">
      <p className="text-xs uppercase tracking-wider text-slate-400">{titulo}</p>
      <p
        className={`mt-1 font-bold text-white ${pequeno ? "text-lg leading-9" : "text-3xl"}`}
        style={color ? { color } : undefined}
      >
        {valor}
      </p>
    </div>
  );
}
