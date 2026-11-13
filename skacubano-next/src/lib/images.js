// Versiones optimizadas (WebP) de las fotos, para no descargar originales de 3-8 MB.
//
//  - thumb: ~400 px de ancho, para miniaturas, tarjetas y fondos difuminados.
//  - large: ~1600 px de ancho, para el carrusel de la portada, la foto destacada y el visor.
//
// De dónde salen:
//  - Fotos del repositorio (/images/...): las genera scripts/optimize-images.mjs junto a la original
//    (foto.jpg -> foto.w400.webp y foto.w1600.webp). Se ejecuta solo antes de `npm run dev` y de cada build.
//  - Fotos subidas desde el panel (/uploads/...): el navegador del admin crea las dos versiones al subir
//    y la API guarda sus URLs en la foto (thumbUrl y largeUrl).
// Si una foto no tiene versiones (p. ej. subidas antiguas), se usa la original.

export const IMAGE_SIZES = { thumb: 400, large: 1600 };

const OPTIMIZABLE = /\.(jpe?g|png)$/i;

// Ruta de la versión optimizada de una imagen del repositorio (misma convención que el script)
export function variantPath(url, size) {
  return url.replace(/\.[^./]+$/, `.w${IMAGE_SIZES[size]}.webp`);
}

/**
 * URL de la versión optimizada de una foto.
 * @param {string|{url: string, thumbUrl?: string, largeUrl?: string}} photo URL o foto de la galería
 * @param {"thumb"|"large"} size
 */
export function optimizedSrc(photo, size = "large") {
  if (!photo) return "";
  let url = photo;
  if (typeof photo === "object") {
    const explicit = size === "thumb" ? photo.thumbUrl : photo.largeUrl;
    if (explicit) return explicit;
    url = photo.url;
  }
  if (typeof url !== "string") return "";
  if (url.startsWith("/images/") && OPTIMIZABLE.test(url)) return variantPath(url, size);
  return url;
}

// Foto de perfil de un integrante: si es una de sus fotos de la galería, se aprovechan sus versiones
export function memberPhoto(member, fotos = []) {
  const url = member?.fotoPrincipalUrl;
  if (url) return fotos.find((f) => f.url === url) || url;
  return fotos.find((f) => f.integranteId === member?.id) || "/images/photos/bio_portrait_natty.jpg";
}

// Fotos en el mismo orden que la cuadrícula de la galería
export function byOrder(photos) {
  return [...photos].sort((a, b) => (a.orden || 0) - (b.orden || 0));
}
