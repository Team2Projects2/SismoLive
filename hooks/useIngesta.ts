"use client";

import { useEffect, useRef } from "react";
import useSWR, { useSWRConfig } from "swr";
import { intervaloSondeoMs } from "@/lib/ingesta/estado";
import { supabase } from "@/lib/supabase";

async function cargar(): Promise<string | null> {
  const { data, error } = await supabase
    .from("ingestas")
    .select("ultima")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data?.ultima ?? null;
}

export function useIngesta() {
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR("ingesta", cargar, {
    // Every minute while fresh, every 15 s once the next run is due.
    refreshInterval: (ultima) => intervaloSondeoMs(ultima, Date.now()),
  });

  // A new ingest landed: refresh the quakes right away instead of waiting for their own poll.
  const anterior = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (anterior.current !== undefined && data && data !== anterior.current) mutate("sismos");
    anterior.current = data;
  }, [data, mutate]);

  return { ultima: data ?? null, error: !!error };
}
