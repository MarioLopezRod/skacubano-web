// Genera versiones WebP ligeras de todas las fotos de public/images:
//   foto.jpg -> foto.w400.webp  (miniaturas, tarjetas, fondos difuminados)
//            -> foto.w1600.webp (carrusel, foto destacada, visor)
// La web las usa a través de src/lib/images.js (optimizedSrc). Las originales no se tocan.
//
// Se ejecuta solo antes de `npm run dev` y de los builds; también a mano con `npm run images`.
// Solo procesa las fotos nuevas o modificadas, así que las siguientes veces tarda muy poco.
// Opciones: --force (regenerar todas).
//
// Las fotos subidas desde el panel de admin no pasan por aquí: sus versiones las crea el navegador
// al subirlas (ver src/components/gallery/ImageCompressor.js).
import { readdir, stat } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import sharp from "sharp";

const ROOT = "public/images";
const SIZES = [
  { width: 400, quality: 70 },
  { width: 1600, quality: 78 },
];
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);
const force = process.argv.includes("--force");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && SOURCE_EXT.has(extname(entry.name).toLowerCase())) yield path;
  }
}

const variantPath = (file, width) => file.slice(0, -extname(file).length) + `.w${width}.webp`;

async function isUpToDate(file, sourceMtime) {
  try {
    return (await stat(file)).mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

async function optimize(file) {
  const { mtimeMs, size } = await stat(file);
  if (size === 0) return { created: 0, saved: 0 }; // ficheros vacíos (p. ej. photos/album_cover.jpg)
  let saved = 0;
  let created = 0;
  for (const { width, quality } of SIZES) {
    const out = variantPath(file, width);
    if (!force && (await isUpToDate(out, mtimeMs))) continue;
    const info = await sharp(file)
      .rotate() // respeta la orientación EXIF de las fotos hechas con móvil/cámara
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(out);
    created++;
    if (width === 1600) saved = size - info.size;
  }
  return { created, saved };
}

const start = Date.now();
let files = 0;
let created = 0;
let saved = 0;
const failed = [];

const queue = [];
for await (const file of walk(ROOT)) queue.push(file);

// Unas pocas a la vez: sharp ya usa varios hilos por imagen
const CONCURRENCY = 4;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const file = queue.shift();
      files++;
      try {
        const r = await optimize(file);
        created += r.created;
        saved += r.saved;
      } catch (err) {
        failed.push(`${relative(ROOT, file)}: ${err.message}`);
      }
    }
  })
);

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(
  `optimize-images: ${files} fotos revisadas, ${created} versiones WebP generadas` +
    (created ? ` (≈${mb(saved)} MB menos en tamaño grande)` : "") +
    ` en ${((Date.now() - start) / 1000).toFixed(1)} s`
);
if (failed.length) {
  console.warn(`optimize-images: no se pudieron procesar ${failed.length} fotos:\n  ` + failed.join("\n  "));
}
