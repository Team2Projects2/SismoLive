import dns from "node:dns";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";
import { featureASismo, type FeatureUsgs } from "../lib/sismos/mapear";
import type { Sismo } from "../lib/types";

// Some networks have broken IPv6 routes to USGS (ECONNRESET); prefer IPv4.
dns.setDefaultResultOrder("ipv4first");

const FEED_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

async function main() {
  const supabase = createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false } },
  );

  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`USGS fetch failed: ${res.status} ${res.statusText}`);
  const { features } = (await res.json()) as { features?: unknown };
  if (!Array.isArray(features)) throw new Error("USGS feed has no features array");

  const sismos = (features as FeatureUsgs[])
    .map(featureASismo)
    .filter((s): s is Sismo => s !== null);

  const { error: sismosError } = await supabase
    .from("sismos")
    .upsert(sismos, { onConflict: "id" });
  if (sismosError) throw sismosError;

  const { error: ingestasError } = await supabase
    .from("ingestas")
    .upsert({ id: 1, ultima: new Date().toISOString() });
  if (ingestasError) throw ingestasError;

  console.log(`Ingested ${sismos.length} sismos (${features.length} features in feed)`);
}

main().catch((error: unknown) => {
  // Log only message and code: the full error object may include request details.
  const { message, code } = (error ?? {}) as { message?: unknown; code?: unknown };
  console.error("Ingest failed:", String(message ?? "unknown error"), code ? `(code ${String(code)})` : "");
  process.exit(1);
});
