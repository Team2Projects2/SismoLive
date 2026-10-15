insert into public.sismos (id, magnitud, lugar, fecha, lat, lng, profundidad) values
  ('seed-001', 2.8, '20 km N of La Serena, Chile',   now() - interval '1 day',  -29.7, -71.2, 40),
  ('seed-002', 3.9, '15 km W of Valparaíso, Chile',  now() - interval '2 days', -33.0, -71.8, 30),
  ('seed-003', 4.0, '50 km S of Lima, Peru',         now() - interval '3 days', -12.5, -76.9, 55),
  ('seed-004', 5.1, 'offshore Coquimbo, Chile',      now() - interval '4 days', -30.1, -72.0, 25),
  ('seed-005', 6.3, '100 km E of Hualien, Taiwan',   now() - interval '5 days',  24.0, 122.6, 20),
  ('seed-006', 7.0, 'Kermadec Islands, New Zealand', now() - interval '6 days', -29.5, -177.0, 10);

insert into public.ingestas (ultima) values (now());