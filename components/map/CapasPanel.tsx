export type Capas = { sismos: boolean; placas: boolean; volcanes: boolean };

const ETIQUETAS: Record<keyof Capas, string> = {
  sismos: "Sismos",
  placas: "Placas tectónicas",
  volcanes: "Volcanes",
};

type Props = {
  capas: Capas;
  onChange: (capas: Capas) => void;
  volcanesNoDisponibles: boolean;
};

export default function CapasPanel({ capas, onChange, volcanesNoDisponibles }: Props) {
  return (
    <div className="map-overlay right-3 top-3 min-w-[170px]">
      <h4 className="mb-2 text-xs font-semibold text-muted">Capas</h4>
      {(Object.keys(ETIQUETAS) as (keyof Capas)[]).map((clave) => (
        <label key={clave} className="my-1.5 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={capas[clave]}
            onChange={(e) => onChange({ ...capas, [clave]: e.target.checked })}
          />
          {ETIQUETAS[clave]}
        </label>
      ))}
      {volcanesNoDisponibles && capas.volcanes && (
        <p className="mt-1 text-[11px] text-muted">Volcanes no disponibles</p>
      )}
    </div>
  );
}
