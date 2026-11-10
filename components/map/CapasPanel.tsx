import CerrarBoton from "./CerrarBoton";

export type Capas = { sismos: boolean; placas: boolean; volcanes: boolean };

const ETIQUETAS: Record<keyof Capas, string> = {
  sismos: "Sismos",
  placas: "Placas tectónicas",
  volcanes: "Volcanes",
};

type Props = {
  capas: Capas;
  onChange: (capas: Capas) => void;
  // Warning shown under the toggles while the volcano layer is on, e.g. missing activity data.
  avisoVolcanes: string | null;
  onClose?: () => void;
};

export default function CapasPanel({ capas, onChange, avisoVolcanes, onClose }: Props) {
  return (
    <div className="panel px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <h3 id="capas-title" className="label">
          Capas
        </h3>
        {onClose && <CerrarBoton onClick={onClose} label="Cerrar capas" />}
      </div>
      <div
        role="group"
        aria-labelledby="capas-title"
        className="mt-2.5 flex flex-col gap-2.5"
      >
        {(Object.keys(ETIQUETAS) as (keyof Capas)[]).map((clave) => (
          <label
            key={clave}
            className="flex cursor-pointer items-center justify-between gap-3 text-[13px] leading-none text-ink-soft"
          >
            <span>{ETIQUETAS[clave]}</span>
            <span className="relative inline-flex h-[18px] w-8 flex-none items-center">
              <input
                type="checkbox"
                checked={capas[clave]}
                onChange={(e) => onChange({ ...capas, [clave]: e.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-line-strong bg-surface-2 transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
              />
              <span
                aria-hidden="true"
                className="absolute left-[3px] top-[3px] h-3 w-3 rounded-full bg-line-strong transition-transform peer-checked:translate-x-[14px] peer-checked:bg-surface"
              />
            </span>
          </label>
        ))}
      </div>

      {avisoVolcanes && capas.volcanes && (
        <p role="status" className="mt-2.5 border-t border-line pt-2 text-[11px] leading-snug text-warn">
          {avisoVolcanes}
        </p>
      )}
    </div>
  );
}
