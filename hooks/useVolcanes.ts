"use client";

import useSWR from "swr";
import type { Volcan } from "@/lib/volcanes/mapear";

async function cargar(): Promise<Volcan[]> {
  const res = await fetch("/api/volcanes");
  if (!res.ok) throw new Error(`Volcanes: ${res.status}`);
  return res.json();
}

export function useVolcanes() {
  const { data, error } = useSWR("volcanes", cargar, { refreshInterval: 600_000 });
  return { volcanes: data ?? [], error: !!error };
}
