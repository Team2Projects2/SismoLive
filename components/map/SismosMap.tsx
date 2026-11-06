"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import type { PopupOptions } from "mapbox-gl";
import { type ReactNode, useEffect, useRef, useState } from "react";
import Map, { AttributionControl, NavigationControl, Popup, type MapMouseEvent, type MapRef } from "react-map-gl/mapbox";
import { fechaHora, lugarEs, profundidadTexto } from "@/lib/formato";
import type { Sismo } from "@/lib/types";
import { limitesGrupo, type GrupoVolcanes } from "@/lib/volcanes/agrupar";
import type { Volcan } from "@/lib/volcanes/mapear";
import { NIVEL_ETIQUETA } from "@/lib/volcanes/nivel";
import type { Capas } from "./CapasPanel";
import GrupoFicha from "./GrupoFicha";
import PlacaFicha from "./PlacaFicha";
import PlacasLayer, { PLACAS_FILL, PLACAS_SOURCE } from "./PlacasLayer";
import SismoMarker from "./SismoMarker";
import VolcanesCapa, { type Vista } from "./VolcanesCapa";

export type Foco = { lng: number; lat: number; n: number };

type Props = {
  sismos: Sismo[];
  volcanes: Volcan[];
  capas: Capas;
  foco: Foco | null;
};

type Etiqueta = { lng: number; lat: number; contenido: ReactNode };
type PlacaHover = { id: number; code: string; nombre: string; lng: number; lat: number };
// The pinned card opens toward the side with more room and scrolls within it.
type PlacaFijada = PlacaHover & { anchor: NonNullable<PopupOptions["anchor"]>; maxAlto: number };

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
// Below this span (degrees) fitBounds would barely move; zoom in a fixed step instead.
const SPAN_MINIMO = 0.05;

// Continental Chile (Arica to Cabo de Hornos). The max zoom-out always fits it, whatever the screen size.
const CHILE: [[number, number], [number, number]] = [
  [-76.5, -56.5],
  [-66.0, -17.0],
];
// Panning stops here: the southeast Pacific, South America's southern half and the
// Antarctic Peninsula (Nazca, South American, Antarctic and Scotia plates), not the rest of the world.
const LIMITE_PANEO: [[number, number], [number, number]] = [
  [-130, -78],
  [-15, 10],
];
const PADDING_CHILE = 24;
// Plate hover hides when the cursor gets this close (px) to a quake or volcano.
const RADIO_MARCADOR = 28;
// Extra zoom-out beyond "Chile just fits" (1 ≈ 2× wider view). LIMITE_PANEO must stay
// larger than that view, otherwise maxBounds would block the zoom-out.
const ZOOM_EXTRA = 1;
// Pinned plate card: popup offset, gap kept to the map edge and card width (px; width matches globals.css).
const OFFSET_FICHA = 16;
const MARGEN_FICHA = 12;
const ANCHO_FICHA = 300;
const ALTO_MINIMO_FICHA = 140;

function textoSismo(s: Sismo): ReactNode {
  return (
    <>
      <div>{`${s.magnitud.toFixed(1)} M · ${lugarEs(s.lugar)} · ${profundidadTexto(s.profundidad)}`}</div>
      <div className="mt-0.5 text-[11px] text-muted">{fechaHora(s.fecha)}</div>
    </>
  );
}

function textoVolcan(v: Volcan): string {
  return [
    v.nombre,
    v.alturaMsnm !== null ? `${v.alturaMsnm} m` : null,
    `EAV ${v.nivel}: ${NIVEL_ETIQUETA[v.nivel]}`,
    v.region,
    v.rankingRiesgo !== null ? `ranking de riesgo #${v.rankingRiesgo}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default function SismosMap({ sismos, volcanes, capas, foco }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [etiqueta, setEtiqueta] = useState<Etiqueta | null>(null);
  const [placa, setPlaca] = useState<PlacaHover | null>(null);
  const [placaFijada, setPlacaFijada] = useState<PlacaFijada | null>(null);
  const [vista, setVista] = useState<Vista | null>(null);
  const frameResize = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameResize.current !== null) cancelAnimationFrame(frameResize.current);
    },
    [],
  );

  useEffect(() => {
    if (foco) mapRef.current?.flyTo({ center: [foco.lng, foco.lat], zoom: 6, duration: 1200 });
  }, [foco]);

  // Hiding the plate layer should not leave a hover or pinned card waiting to reappear.
  useEffect(() => {
    if (capas.placas) return;
    // Also drop the hover highlight, or the last hovered plate stays lit when the layer comes back.
    const map = mapRef.current?.getMap();
    if (map?.getSource(PLACAS_SOURCE)) map.removeFeatureState({ source: PLACAS_SOURCE });
    // Resetting UI state when a layer is hidden is the intended use of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaca(null);
    setPlacaFijada(null);
  }, [capas.placas]);

  // Max zoom-out = the zoom that fits all of Chile (plus ZOOM_EXTRA); recomputed on resize.
  function ajustarZoomMinimo() {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const camara = map.cameraForBounds(CHILE, { padding: PADDING_CHILE });
    if (camara?.zoom !== undefined) map.setMinZoom(camara.zoom - ZOOM_EXTRA);
  }

  function onLoad() {
    // Keep pinch-zoom on touch screens but drop its two-finger rotation.
    mapRef.current?.getMap().touchZoomRotate.disableRotation();
    ajustarZoomMinimo();
    actualizarVista();
  }

  // Zoom limits and the screen-space volcano clustering both depend on the viewport size.
  // Resize fires continuously while a window is dragged, so coalesce it to one update per frame.
  function onResize() {
    if (frameResize.current !== null) return;
    frameResize.current = requestAnimationFrame(() => {
      frameResize.current = null;
      ajustarZoomMinimo();
      actualizarVista();
    });
  }

  // Runs on load, moveend (which also fires after zooms) and at most once per frame on resize.
  function actualizarVista() {
    const map = mapRef.current;
    if (!map) return;
    setVista({ proyectar: (lng, lat) => map.project([lng, lat]) });
  }

  function acercarGrupo(grupo: GrupoVolcanes) {
    const map = mapRef.current;
    if (!map) return;
    setEtiqueta(null);
    const [[oeste, sur], [este, norte]] = limitesGrupo(grupo);
    if (este - oeste < SPAN_MINIMO && norte - sur < SPAN_MINIMO) {
      map.flyTo({ center: [grupo.lng, grupo.lat], zoom: map.getZoom() + 2, duration: 800 });
      return;
    }
    map.fitBounds(
      [
        [oeste, sur],
        [este, norte],
      ],
      { padding: 80, maxZoom: 10, duration: 800 },
    );
  }

  function marcarPlaca(id: number | null, hover: boolean) {
    if (id !== null) mapRef.current?.setFeatureState({ source: PLACAS_SOURCE, id }, { hover });
  }

  // Opens the pinned card toward the roomier vertical side (and away from a close side edge),
  // capping its height to the space left so it scrolls instead of being cut off by the map edge.
  function ubicarFicha(x: number, y: number): Pick<PlacaFijada, "anchor" | "maxAlto"> {
    const contenedor = mapRef.current?.getMap().getContainer();
    if (!contenedor) return { anchor: "top", maxAlto: ALTO_MINIMO_FICHA };
    const { clientWidth: ancho, clientHeight: alto } = contenedor;
    const haciaAbajo = y < alto / 2;
    const mitad = ANCHO_FICHA / 2 + MARGEN_FICHA;
    const lado = x < mitad ? "-left" : x > ancho - mitad ? "-right" : "";
    const espacio = (haciaAbajo ? alto - y : y) - OFFSET_FICHA - MARGEN_FICHA;
    return {
      anchor: `${haciaAbajo ? "top" : "bottom"}${lado}` as PlacaFijada["anchor"],
      maxAlto: Math.max(espacio, ALTO_MINIMO_FICHA),
    };
  }

  // True when the cursor is within RADIO_MARCADOR px of a visible quake or volcano.
  function cercaDeMarcador(x: number, y: number): boolean {
    const map = mapRef.current;
    if (!map) return false;
    const puntos = [
      ...(capas.sismos ? sismos : []),
      ...(capas.volcanes ? volcanes : []),
    ];
    return puntos.some((p) => {
      const q = map.project([p.lng, p.lat]);
      return Math.hypot(q.x - x, q.y - y) < RADIO_MARCADOR;
    });
  }

  function onMouseMove(e: MapMouseEvent) {
    // Plate hover is the only reason to run this handler; skip the projection loop otherwise.
    if (!capas.placas) return;

    const destino = e.originalEvent.target as HTMLElement | null;
    // Moving inside the expanded card keeps it open.
    if (destino?.closest(".placa-fijada")) return;

    // Plates cover the whole map, so their hover must yield to markers: hide it when the
    // cursor is over a DOM marker (events bubble from it) or merely close to one.
    const sobreCanvas = destino?.tagName === "CANVAS";
    if (!sobreCanvas || cercaDeMarcador(e.point.x, e.point.y)) {
      onMouseLeave();
      setPlacaFijada(null);
      return;
    }
    // mapbox-gl types features via @types/geojson, which it does not install; narrow locally.
    const f = e.features?.[0] as
      | { id?: string | number; properties?: Record<string, unknown> | null }
      | undefined;
    // The expanded card behaves like a big hover: it closes once the cursor leaves its plate.
    if (placaFijada && f?.id !== placaFijada.id) setPlacaFijada(null);
    if (!f || typeof f.id !== "number") {
      onMouseLeave();
      return;
    }
    if (placa?.id !== f.id) {
      marcarPlaca(placa?.id ?? null, false);
      marcarPlaca(f.id, true);
    }
    setPlaca({
      id: f.id,
      code: String(f.properties?.Code ?? ""),
      nombre: String(f.properties?.PlateName ?? ""),
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
    });
  }

  function onMouseLeave() {
    if (!placa) return;
    marcarPlaca(placa.id, false);
    setPlaca(null);
  }

  // Click on a plate pins its full card; click on empty map closes it. Clicks on DOM markers
  // (volcanoes, quakes) bubble up here too, so only clicks that hit the map canvas count.
  function onClick(e: MapMouseEvent) {
    if ((e.originalEvent.target as HTMLElement | null)?.tagName !== "CANVAS") return;
    const f = e.features?.[0] as
      | { id?: string | number; properties?: Record<string, unknown> | null }
      | undefined;
    if (!f || typeof f.id !== "number") {
      setPlacaFijada(null);
      return;
    }
    setPlacaFijada({
      id: f.id,
      code: String(f.properties?.Code ?? ""),
      nombre: String(f.properties?.PlateName ?? ""),
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
      ...ubicarFicha(e.point.x, e.point.y),
    });
  }

  if (!TOKEN) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-2 p-6 text-center text-[13px] text-muted">
        Falta <code className="mx-1 font-medium text-ink">NEXT_PUBLIC_MAPBOX_TOKEN</code> en .env.local
      </div>
    );
  }

  // Hover shows only the header, and not over the plate whose full card is already open.
  // A quake/volcano popup always wins over the plate hover.
  const mostrarPlaca =
    capas.placas && placa && !etiqueta && placa.id !== placaFijada?.id ? placa : null;
  const fijada = capas.placas ? placaFijada : null;

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={TOKEN}
      mapStyle="mapbox://styles/mapbox/light-v11"
      language="es"
      initialViewState={{ bounds: CHILE, fitBoundsOptions: { padding: PADDING_CHILE } }}
      // Flat map: maxBounds behaves predictably in mercator (globe view would ignore the framing).
      projection="mercator"
      maxBounds={LIMITE_PANEO}
      // No compass, so no rotation or tilt either: the map always stays north-up.
      dragRotate={false}
      pitchWithRotate={false}
      touchPitch={false}
      attributionControl={false}
      style={{ width: "100%", height: "100%" }}
      interactiveLayerIds={capas.placas ? [PLACAS_FILL] : []}
      cursor={capas.placas && placa ? "pointer" : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      // Cursor left the map canvas: into the expanded card keeps it, anywhere else closes everything.
      onMouseOut={(e) => {
        onMouseLeave();
        const hacia = e.originalEvent.relatedTarget as HTMLElement | null;
        if (!hacia?.closest(".placa-fijada")) setPlacaFijada(null);
      }}
      onClick={onClick}
      onLoad={onLoad}
      onResize={onResize}
      onMoveEnd={actualizarVista}
    >
      {/* Mapbox requires both the wordmark and the text attribution; grouped bottom-left, compact. */}
      <AttributionControl position="bottom-left" compact />
      <NavigationControl position="bottom-left" showCompass={false} />
      <PlacasLayer visible={capas.placas} />

      {capas.volcanes && (
        <VolcanesCapa
          volcanes={volcanes}
          vista={vista}
          onHoverVolcan={(x) =>
            setEtiqueta(x && { lng: x.lng, lat: x.lat, contenido: textoVolcan(x) })
          }
          onHoverGrupo={(g) =>
            setEtiqueta(g && { lng: g.lng, lat: g.lat, contenido: <GrupoFicha grupo={g} /> })
          }
          onClickGrupo={acercarGrupo}
        />
      )}

      {capas.sismos &&
        sismos.map((s, i) => (
          <SismoMarker
            key={s.id}
            sismo={s}
            esUltimo={i === 0}
            onHover={(x) => setEtiqueta(x && { lng: x.lng, lat: x.lat, contenido: textoSismo(x) })}
          />
        ))}

      {etiqueta && (
        <Popup
          longitude={etiqueta.lng}
          latitude={etiqueta.lat}
          closeButton={false}
          closeOnClick={false}
          offset={14}
        >
          {etiqueta.contenido}
        </Popup>
      )}

      {mostrarPlaca && (
        <Popup
          longitude={mostrarPlaca.lng}
          latitude={mostrarPlaca.lat}
          closeButton={false}
          closeOnClick={false}
          offset={16}
          maxWidth="320px"
          className="placa-popup"
        >
          <PlacaFicha code={mostrarPlaca.code} nombreOriginal={mostrarPlaca.nombre} resumen />
        </Popup>
      )}

      {fijada && (
        <Popup
          key={fijada.id}
          longitude={fijada.lng}
          latitude={fijada.lat}
          closeButton
          closeOnClick={false}
          onClose={() => setPlacaFijada(null)}
          anchor={fijada.anchor}
          offset={OFFSET_FICHA}
          maxWidth="320px"
          className="placa-popup placa-fijada"
        >
          <div
            className="overflow-y-auto overscroll-contain"
            style={{ maxHeight: fijada.maxAlto }}
            onMouseLeave={(e) => {
              // Back onto the map canvas: onMouseMove decides (same plate keeps it open).
              // Anywhere else (sidebar, header, outside the window): close it.
              if ((e.relatedTarget as HTMLElement | null)?.tagName !== "CANVAS") setPlacaFijada(null);
            }}
          >
            <PlacaFicha code={fijada.code} nombreOriginal={fijada.nombre} />
          </div>
        </Popup>
      )}
    </Map>
  );
}
