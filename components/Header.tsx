import EstadoActualizacion from "./header/EstadoActualizacion";

export default function Header() {
  return (
    <header className="border-b border-line pb-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line bg-surface text-accent">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M2 12h4l2-5 3 10 2.5-7 2 4H22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="font-display text-[28px] leading-none tracking-[-0.02em]">SismoLive</p>
          <p className="mt-1.5 text-[12px] leading-tight text-muted">
            Monitoreo sísmico y volcánico · Chile y alrededores
          </p>
        </div>
      </div>

      <div className="mt-4">
        <EstadoActualizacion />
      </div>
    </header>
  );
}
