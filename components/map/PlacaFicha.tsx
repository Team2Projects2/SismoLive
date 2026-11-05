import { COLOR_PLACA_DEFECTO, PLACAS_INFO } from "@/lib/placas";

// `resumen`: hover view with only the header; the full card opens on click.
type Props = { code: string; nombreOriginal: string; resumen?: boolean };

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-disc space-y-0.5 pl-3.5 marker:text-line-strong">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line px-3.5 py-2.5 text-[11.5px] leading-relaxed text-ink-soft">
      <h5 className="label mb-1 text-[10px]">{titulo}</h5>
      {children}
    </div>
  );
}

export default function PlacaFicha({ code, nombreOriginal, resumen = false }: Props) {
  const p = PLACAS_INFO[code];
  if (!p) {
    return (
      <div className="border-l-4 px-3.5 py-2.5" style={{ borderColor: COLOR_PLACA_DEFECTO }}>
        <b className="block font-display text-[15px]">Placa {nombreOriginal}</b>
      </div>
    );
  }

  const encabezado = (
    <div className="border-l-4 px-3.5 py-3 pr-7" style={{ borderColor: p.color }}>
      <b className="block font-display text-[16px] leading-tight">{p.nombre}</b>
      <span className="text-[11px] text-muted">{p.tipo}</span>
      {resumen && <span className="mt-1 block text-[10px] text-muted">Haz clic para ver más</span>}
    </div>
  );
  if (resumen) return encabezado;

  return (
    <>
      {encabezado}
      <div className="grid grid-cols-2 gap-px bg-line">
        <div className="bg-surface-2 px-3.5 py-2">
          <small className="label block text-[10px]">Superficie</small>
          <b className="mt-1 block text-[11.5px] font-semibold text-ink-soft">{p.area}</b>
        </div>
        <div className="bg-surface-2 px-3.5 py-2">
          <small className="label block text-[10px]">Movimiento</small>
          <b className="mt-1 block text-[11.5px] font-semibold text-ink-soft">{p.vel}</b>
        </div>
      </div>
      <Seccion titulo="Edad">{p.edad}</Seccion>
      <Seccion titulo="Bordes">
        <Lista items={p.bordes} />
      </Seccion>
      {p.sismos.length > 0 && (
        <Seccion titulo="Terremotos notables">
          <Lista items={p.sismos} />
        </Seccion>
      )}
      <Seccion titulo="¿Sabías que?">
        <span>{p.dato}</span>
      </Seccion>
    </>
  );
}
