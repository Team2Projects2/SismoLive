import EstadoActualizacion from "./header/EstadoActualizacion";

export default function Header() {
  return (
    <header className="flex flex-col gap-3 border-b border-line bg-[#0d1526] px-5 py-3 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 34 22" className="h-[22px] w-[34px]" aria-hidden="true">
          <polyline
            points="0,11 8,11 11,3 14,19 17,6 20,15 23,11 34,11"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
        </svg>
        <div>
          <b className="block font-logo text-xl">SismoLive</b>
          <small className="text-xs text-muted">Monitoreo sísmico · Chile y alrededores</small>
        </div>
      </div>
      <EstadoActualizacion />
    </header>
  );
}
