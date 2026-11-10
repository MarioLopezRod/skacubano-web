// Descarga las canciones de cada disco (título, duración y fragmento de 30 s) desde la API pública
// de Apple Music / iTunes y las guarda en src/data/tracklists.json. No necesita cuenta ni clave.
//
//   npm run tracklists
//
// Se ejecuta a mano, no en cada build. Conviene repetirlo de vez en cuando (por ejemplo, una vez al año)
// por si Apple cambia los enlaces de los fragmentos. Si un disco falla, se conserva lo que ya hubiera.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const COUNTRY = "es"; // tienda de Apple de la que se sacan los datos

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const albumsFile = path.join(root, "src/data/albums.js");
const outFile = path.join(root, "src/data/tracklists.json");

const albumsSource = await readFile(albumsFile, "utf8");
const ids = [...new Set([...albumsSource.matchAll(/music\.apple\.com\/[^"]*?\/album\/(?:[^/"]+\/)?(\d+)/g)].map((m) => m[1]))];

if (ids.length === 0) {
  console.error("No se han encontrado enlaces de Apple Music en src/data/albums.js");
  process.exit(1);
}

function formatDuration(ms) {
  if (!Number.isFinite(ms)) return "";
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

let previous = {};
try {
  previous = JSON.parse(await readFile(outFile, "utf8"));
} catch {
  // primera vez
}

const result = { ...previous };
let failures = 0;

for (const id of ids) {
  const url = `https://itunes.apple.com/lookup?id=${id}&entity=song&country=${COUNTRY}&limit=200`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const songs = (json.results || [])
      .filter((r) => r.wrapperType === "track" && r.kind === "song")
      .sort((a, b) => (a.discNumber - b.discNumber) || (a.trackNumber - b.trackNumber));
    if (songs.length === 0) throw new Error("Apple no devuelve canciones para este disco");

    const album = (json.results || []).find((r) => r.wrapperType === "collection");
    result[id] = {
      album: album?.collectionName || "",
      fetchedAt: new Date().toISOString().slice(0, 10),
      tracks: songs.map((s) => ({
        title: s.trackName,
        duration: formatDuration(s.trackTimeMillis),
        previewUrl: s.previewUrl || null,
      })),
    };
    const withPreview = songs.filter((s) => s.previewUrl).length;
    console.log(`✓ ${album?.collectionName || id}: ${songs.length} canciones, ${withPreview} con fragmento de 30 s`);
  } catch (err) {
    failures++;
    console.error(`✗ ${id}: ${err.message}${previous[id] ? " (se conserva la versión anterior)" : ""}`);
  }
}

await writeFile(outFile, JSON.stringify(result, null, 2) + "\n");
console.log(`\nGuardado en ${path.relative(root, outFile)}. Revisa los títulos antes de publicar.`);
process.exit(failures ? 1 : 0);
