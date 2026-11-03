export type PlacaInfo = {
  nombre: string;
  color: string;
  tipo: string;
  area: string;
  vel: string;
  edad: string;
  bordes: string[];
  sismos: string[];
  dato: string;
};

export const COLOR_PLACA_DEFECTO = "#64748b";

// Keyed by the PB2002 "Code" property. Rounded general-knowledge figures.
export const PLACAS_INFO: Record<string, PlacaInfo> = {
  NZ: {
    nombre: "Placa de Nazca", color: "#38bdf8", tipo: "Oceánica",
    area: "~15,6 millones km²", vel: "~6,6 cm/año hacia el ENE", edad: "Corteza de hasta ~50 millones de años",
    bordes: ["Convergente con Sudamericana: fosa de Atacama (subducción)", "Divergente con Pacífico: dorsal del Pacífico Oriental", "Divergente con Antártica: dorsal de Chile"],
    sismos: ["Valdivia 1960 · M9.5 (el mayor registrado)", "Maule 2010 · M8.8", "Illapel 2015 · M8.3", "Iquique 2014 · M8.2"],
    dato: "Entre ~27°S y ~33°S se hunde casi horizontal (flat slab): por eso no hay volcanes activos entre Copiapó y Santiago.",
  },
  SA: {
    nombre: "Placa Sudamericana", color: "#f59e0b", tipo: "Continental y oceánica",
    area: "~43,6 millones km²", vel: "~2–3 cm/año hacia el oeste", edad: "Cratones de más de 2.000 millones de años",
    bordes: ["Convergente con Nazca y Antártica (Andes)", "Divergente con Africana: dorsal Mesoatlántica", "Transformante con Caribe y Scotia"],
    sismos: ["Valdivia 1960 · M9.5", "Maule 2010 · M8.8", "Arica 1868 · ~M9"],
    dato: "Su choque con Nazca levantó los Andes (~7.000 km), con el Aconcagua (6.961 m) como cumbre más alta fuera de Asia.",
  },
  AN: {
    nombre: "Placa Antártica", color: "#e2e8f0", tipo: "Continental y oceánica",
    area: "~60,9 millones km²", vel: "~2 cm/año de convergencia con Sudamérica", edad: "Escudo antártico de más de 3.000 millones de años",
    bordes: ["Convergente con Sudamericana al sur de ~46°S", "Divergente con Nazca: dorsal de Chile", "Transformante con Scotia"],
    sismos: ["Aysén 2007 · M6.2 (enjambre en el fiordo)"],
    dato: "En el Punto Triple de Chile (~46,5°S, península de Taitao) se juntan Nazca, Antártica y Sudamericana y la dorsal de Chile se está subduciendo.",
  },
  SC: {
    nombre: "Placa Scotia", color: "#34d399", tipo: "Oceánica",
    area: "~1,6 millones km²", vel: "Desplazamiento lateral, ~0,5–1 cm/año relativo a Sudamérica", edad: "Formada hace ~40 millones de años",
    bordes: ["Transformante con Sudamericana: falla Magallanes-Fagnano", "Transformante con Antártica", "Convergente al este: arco de las Sandwich del Sur"],
    sismos: ["Tierra del Fuego 1949 · ~M7.5"],
    dato: "Su apertura separó Sudamérica de la Antártica y abrió el paso Drake, que permitió la corriente circumpolar antártica.",
  },
  PA: {
    nombre: "Placa del Pacífico", color: "#a78bfa", tipo: "Oceánica",
    area: "~103 millones km² (la más grande)", vel: "~7–10 cm/año hacia el NO", edad: "Corteza de hasta ~180 millones de años",
    bordes: ["Divergente con Nazca y Antártica: dorsales", "Convergente con varias placas en Asia y Oceanía", "Transformante con Norteamericana: falla de San Andrés"],
    sismos: ["Japón 2011 · M9.1", "Alaska 1964 · M9.2", "Kamchatka 1952 · M9.0"],
    dato: "Sus bordes forman gran parte del Cinturón de Fuego: ~40.000 km con cerca del 90% de los sismos del mundo y ~75% de los volcanes activos.",
  },
  AP: {
    nombre: "Microplaca Altiplano", color: "#fb7185", tipo: "Continental (bloque andino)",
    area: "Bloque menor", vel: "Se mueve con Sudamérica con leve deformación interna", edad: "Altiplano levantado en los últimos ~25 millones de años",
    bordes: ["Separada de Sudamericana por fallas de la cordillera Oriental"],
    sismos: ["Sismos intraplaca y profundos bajo el altiplano"],
    dato: "Contiene el Altiplano (altura media ~3.750 m), la segunda meseta más alta del mundo tras el Tíbet.",
  },
  JZ: {
    nombre: "Microplaca Juan Fernández", color: "#60a5fa", tipo: "Oceánica",
    area: "Microplaca", vel: "Rota entre Pacífico, Nazca y Antártica", edad: "Formada hace ~3 millones de años",
    bordes: ["Rodeada de dorsales y fallas transformantes"], sismos: [],
    dato: "Es una microplaca en el punto triple de la dorsal del Pacífico Oriental. No tiene relación con el archipiélago de Juan Fernández.",
  },
  EA: {
    nombre: "Microplaca de Pascua", color: "#818cf8", tipo: "Oceánica",
    area: "Microplaca", vel: "Rota entre Pacífico y Nazca", edad: "Formada hace ~5 millones de años",
    bordes: ["Rodeada de dorsales y fallas transformantes"], sismos: [],
    dato: "Microplaca en rotación sobre la dorsal del Pacífico Oriental, al este de Rapa Nui.",
  },
};
