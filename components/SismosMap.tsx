"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/mapbox";
import { colorPorMagnitud } from "@/lib/magnitud";
import type { Sismo } from "@/lib/types";

type Props = {
  sismos: Sismo[];
  seleccionado: string | null;
  onSelect: (id: string) => void;
};

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function SismosMap({ sismos, seleccionado, onSelect }: Props) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const s = sismos.find((x) => x.id === seleccionado);
    if (s) mapRef.current?.flyTo({ center: [s.lng, s.lat], zoom: 5, duration: 1200 });
  }, [seleccionado, sismos]);

  if (!TOKEN) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900 p-6 text-center text-sm text-slate-400">
        Falta <code className="mx-1 text-slate-200">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
        en .env.local
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      projection="globe"
      initialViewState={{ longitude: -71, latitude: -35.5, zoom: 3.2 }}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-left" showCompass={false} />
      {sismos.map((s) => {
        const color = colorPorMagnitud(s.magnitud);
        const tam = 10 + s.magnitud * 3;
        const activo = seleccionado === s.id;
        return (
          <Marker key={s.id} longitude={s.lng} latitude={s.lat} anchor="center">
            <button
              type="button"
              aria-label={`M ${s.magnitud.toFixed(1)} ${s.lugar}`}
              title={`M ${s.magnitud.toFixed(1)} · ${s.lugar}`}
              onClick={() => onSelect(s.id)}
              className="block rounded-full"
              style={{
                width: tam,
                height: tam,
                backgroundColor: color + "99",
                border: `2px solid ${activo ? "#fff" : color}`,
                boxShadow: `0 0 14px ${color}`,
              }}
            />
          </Marker>
        );
      })}
    </Map>
  );
}
