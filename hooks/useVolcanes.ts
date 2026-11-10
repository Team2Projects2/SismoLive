"use client";

import useSWR from "swr";
import type { DatosVolcanes } from "@/lib/volcanes/fuente";

async function cargar(): Promise<DatosVolcanes> {
  const res = await fetch("/api/volcanes");
  if (!res.ok) throw new Error(`Volcanes: ${res.status}`);
  return res.json();
}

export function useVolcanes() {
  const { data, error } = useSWR("volcanes", cargar, { refreshInterval: 600_000 });
  return {
    volcanes: data?.volcanes ?? [],
    error: !!error,
    sinActividad: data !== undefined && !data.conActividad,
  };
}
