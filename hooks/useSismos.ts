"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import type { Sismo } from "@/lib/types";

async function cargar(): Promise<Sismo[]> {
  const { data, error } = await supabase
    .from("sismos")
    .select("id, magnitud, lugar, fecha, lat, lng, profundidad, url")
    .eq("es_chile", true)
    .order("fecha", { ascending: false })
    .limit(100);
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
