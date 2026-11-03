import { COLOR_PLACA_DEFECTO, PLACAS_INFO } from "@/lib/placas";

// `resumen`: hover view with only the header; the full card opens on click.
type Props = { code: string; nombreOriginal: string; resumen?: boolean };

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-disc pl-3.5">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line px-3 py-2 text-[11px] leading-normal">
      <h5 className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">{titulo}</h5>
      {children}
    </div>
  );
}

export default function PlacaFicha({ code, nombreOriginal, resumen = false }: Props) {
  const p = PLACAS_INFO[code];
  if (!p) {
    return (
      <div className="border-l-4 px-3 py-2.5" style={{ borderColor: COLOR_PLACA_DEFECTO }}>
        <b className="block text-sm">Placa {nombreOriginal}</b>
      </div>
    );
  }

  const encabezado = (
    <div className="border-l-4 px-3 py-2.5 pr-7" style={{ borderColor: p.color }}>
      <b className="block text-sm">{p.nombre}</b>
      <span className="text-[11px] text-muted">{p.tipo}</span>
      {resumen && <span className="mt-1 block text-[10px] text-slate-500">Haz clic para ver más</span>}
    </div>
  );
  if (resumen) return encabezado;

  return (
    <>
      {encabezado}
      <div className="grid grid-cols-2 gap-px bg-line">
        <div className="bg-[#0f1828] px-3 py-1.5">
          <small className="block text-[10px] uppercase tracking-wider text-muted">Superficie</small>
          <b className="text-xs">{p.area}</b>
        </div>
        <div className="bg-[#0f1828] px-3 py-1.5">
          <small className="block text-[10px] uppercase tracking-wider text-muted">Movimiento</small>
          <b className="text-xs">{p.vel}</b>
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
        <span className="text-slate-300">{p.dato}</span>
      </Seccion>
    </>
  );
}
