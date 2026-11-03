"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { REGION_CHILE } from "@/lib/region";
import { supabase } from "@/lib/supabase";
import type { Sismo } from "@/lib/types";

const DIAS = 7;

async function cargar(): Promise<Sismo[]> {
  const desde = new Date(Date.now() - DIAS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("sismos")
    .select("id, magnitud, lugar, fecha, lat, lng, profundidad, url")
    .gte("lat", REGION_CHILE.latMin)
    .lte("lat", REGION_CHILE.latMax)
    .gte("lng", REGION_CHILE.lngMin)
    .lte("lng", REGION_CHILE.lngMax)
    .gte("fecha", desde)
    .order("fecha", { ascending: false })
    .limit(500);
  if (error) throw error;
  return data;
}

export function useSismos() {
  const { data, error, isLoading, mutate } = useSWR("sismos", cargar, {
    refreshInterval: 60_000,
  });

  useEffect(() => {
    const canal = supabase
      .channel("sismos-cambios")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sismos" },
        () => {
          mutate();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [mutate]);

  return { sismos: data ?? [], cargando: isLoading, error: !!error };
}
