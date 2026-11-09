# SismoLive

Live map of earthquakes in Chile and surroundings, with volcano activity levels and tectonic plate boundaries.

## Stack

- Next.js 16 (App Router), React 19, Tailwind CSS v4
- Mapbox GL via `react-map-gl/mapbox`
- Supabase (Postgres + Realtime) for earthquake storage
- Vitest for unit tests

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Name | Used by | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | app, ingest | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_KEY` | app | Supabase publishable (anon) key, read-only |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | app | Mapbox public access token |
| `SUPABASE_SECRET_KEY` | ingest only | Supabase secret key, never expose it to the browser |

## Local development

```bash
npm install
npx supabase start          # local Supabase (Docker)
npm run db:reset            # apply migrations + seed
npm run dev                 # http://localhost:3000
```

Other scripts: `npm test`, `npm run typecheck`, `npm run lint`, `npm run db:types`.

## How data flows

- **Earthquakes**: `scripts/ingest.ts` downloads the USGS 2.5+ weekly feed, validates each feature and upserts it into `public.sismos`, then stamps `public.ingestas.ultima`. A GitHub Actions workflow (`.github/workflows/ingest.yml`) runs it every 10 minutes. The browser reads with the publishable key (RLS: read only) and listens to Realtime changes.
- **Volcanoes**: `app/api/volcanes/route.ts` fetches the SERNAGEOMIN RNVV API server-side, validates it and caches it for 10 minutes. The API requires a key: set `RNVV_API_KEY` (server-only, never `NEXT_PUBLIC_`); without it (or if RNVV fails) the route falls back to the Smithsonian GVP catalog of Chilean volcanoes, which has locations but no activity level, and the layers panel shows "Sin datos de actividad volcánica".
- **Tectonic plates**: static GeoJSON in `public/data/pb2002-plates.json`.

To run the ingest against local Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SECRET_KEY=<local secret key> npm run ingest
```

## Data sources and attribution

- Earthquakes: [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
- Volcanoes: SERNAGEOMIN, Red Nacional de Vigilancia Volcánica (RNVV)
- Plate boundaries: PB2002 (Bird, 2003), via [fraxen/tectonicplates](https://github.com/fraxen/tectonicplates), ODC-By
