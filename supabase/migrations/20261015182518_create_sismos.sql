create table public.sismos (
  id           text primary key,              -- USGS feature id
  magnitud     numeric(4,2) not null,
  lugar        text not null,
  fecha        timestamptz not null,
  lat          double precision not null,
  lng          double precision not null,
  profundidad  double precision,
  url          text,
  -- USGS "place" ends with ", Chile" for Chilean events (including offshore)
  es_chile     boolean generated always as (lugar ilike '%chile%') stored
);

create index sismos_fecha_idx on public.sismos (fecha desc);
create index sismos_chile_fecha_idx on public.sismos (es_chile, fecha desc);

create table public.ingestas (
  id      smallint primary key default 1 check (id = 1),  -- single row
  ultima  timestamptz not null
);

alter table public.sismos   enable row level security;
alter table public.ingestas enable row level security;

-- Public read only; writes use the secret key, which bypasses RLS
create policy "public read sismos"   on public.sismos   for select to anon, authenticated using (true);
create policy "public read ingestas" on public.ingestas for select to anon, authenticated using (true);

alter publication supabase_realtime add table public.sismos;