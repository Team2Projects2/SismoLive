"use client";

import { useEffect, useState } from "react";

// Current time that re-renders the caller every `intervaloMs`. Null until mounted, which
// avoids a server/client mismatch on relative times.
export function useAhora(intervaloMs = 15_000): number | null {
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setAhora(Date.now());
    tick();
    const id = setInterval(tick, intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);

  return ahora;
}
