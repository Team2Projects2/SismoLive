import https from "node:https";
import tls from "node:tls";
import { ALPHASSL_CA_2025 } from "./ca";
import { mapearVolcanes, type Volcan } from "./mapear";

const RNVV_URL = "https://rnvv-backend.sernageomin.cl:8443/api/volcanes";
const TIMEOUT_MS = 10_000;
const MAX_BYTES = 1_000_000;

// Uses node:https instead of fetch because the upstream server omits its intermediate
// certificate; we add it to the trusted CAs for this request only.
function obtenerJson(url: string, apiKey: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        ca: [...tls.rootCertificates, ALPHASSL_CA_2025],
        timeout: TIMEOUT_MS,
        headers: { "X-API-Key": apiKey },
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`RNVV responded ${res.statusCode}`));
          return;
        }
        let cuerpo = "";
        res.setEncoding("utf8");
        res.on("data", (parte: string) => {
          cuerpo += parte;
          if (cuerpo.length > MAX_BYTES) req.destroy(new Error("RNVV response too large"));
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(cuerpo));
          } catch {
            reject(new Error("RNVV returned invalid JSON"));
          }
        });
        res.on("error", reject);
      },
    );
    req.on("timeout", () => req.destroy(new Error("RNVV request timed out")));
    req.on("error", reject);
  });
}

// RNVV requires an API key since 2026-11. Without one we fail fast instead of calling upstream.
export function leerApiKey(env: Record<string, string | undefined> = process.env): string {
  const apiKey = env.RNVV_API_KEY?.trim();
  if (!apiKey) throw new Error("RNVV_API_KEY is not set");
  return apiKey;
}

export async function obtenerVolcanes(): Promise<Volcan[]> {
  const datos = await obtenerJson(RNVV_URL, leerApiKey());
  if (!Array.isArray(datos)) throw new Error("RNVV payload is not an array");
  return mapearVolcanes(datos);
}
