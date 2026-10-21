import type { Database } from "./database.types";

export type Sismo = Omit<
  Database["public"]["Tables"]["sismos"]["Row"],
  "es_chile"
>;
