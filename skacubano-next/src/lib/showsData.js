"use client";

import { useEffect, useState } from "react";
// Copia incluida en la web compilada: se muestra al instante y sirve de respaldo si la API falla.
// Es la misma semilla con la que la API crea data/shows.json la primera vez.
import seedShows from "../../public/api/seed/shows.json";

export const fallbackShowsData = seedShows;

// Una sola petición por visita aunque varios componentes usen el hook
let showsPromise = null;

function loadShows() {
  if (!showsPromise) {
    showsPromise = fetch("/api/shows")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => (json && Array.isArray(json.shows) && Array.isArray(json.videos) ? json : null))
      .catch(() => null);
  }
  return showsPromise;
}

export function useShowsData() {
  const [data, setData] = useState(fallbackShowsData);

  useEffect(() => {
    let cancelled = false;
    loadShows().then((json) => {
      if (json && !cancelled) setData(json);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

// Texto bilingüe {es, en} → idioma actual (si falta, usa el otro)
export function pickLang(value, lang) {
  if (!value || typeof value !== "object") return value || "";
  return value[lang] || value.en || value.es || "";
}
