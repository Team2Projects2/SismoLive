export default function Header() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 md:px-9">
        <a href="#" className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="font-logo text-2xl font-extrabold tracking-tight text-white">
            SismoLive
          </span>
        </a>
        <nav className="flex gap-1 text-sm text-slate-300">
          <a
            href="#nosotros"
            className="rounded-full px-3.5 py-1.5 transition hover:bg-white/10 hover:text-white"
          >
            Nosotros
          </a>
          <a
            href="#contacto"
            className="rounded-full px-3.5 py-1.5 transition hover:bg-white/10 hover:text-white"
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}
