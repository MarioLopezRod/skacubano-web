// Redimensionado de fotos en el navegador del admin, antes de subirlas.
// Se hace aquí (y no en el servidor) porque no todos los hostings PHP tienen la extensión GD con WebP.

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    image.src = url;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const baseName = (name) => name.replace(/\.[^/.]+$/, "");

// Dibuja la imagen con un ancho/alto máximo y la codifica en WebP. Safari antiguo no sabe generar
// WebP (devuelve PNG): en ese caso se usa JPEG, que pesa mucho menos que PNG.
async function resize(image, { maxWidth, maxHeight = maxWidth, quality }) {
  let { width, height } = image;
  const ratio = Math.min(1, maxWidth / width, maxHeight / height);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, width, height);

  let blob = await canvasToBlob(canvas, "image/webp", quality);
  if (!blob || blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
  }
  return blob;
}

const toFile = (blob, name) =>
  new File([blob], `${name}.${blob.type === "image/webp" ? "webp" : "jpg"}`, {
    type: blob.type,
    lastModified: Date.now(),
  });

/**
 * Comprime una foto (máx. 1920 px) para guardarla como "original" de la galería.
 * Si no es una imagen o algo falla, devuelve el fichero tal cual.
 */
export async function compressImage(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.85 } = {}) {
  if (!file || !file.type.startsWith("image/")) return file;
  const image = await loadImage(file);
  const blob = await resize(image, { maxWidth, maxHeight, quality });
  return blob ? toFile(blob, baseName(file.name)) : file;
}

/**
 * Crea las dos versiones ligeras que usa la web pública (ver src/lib/images.js):
 * miniatura de 400 px y grande de 1600 px de ancho.
 * @returns {Promise<{thumb: File, large: File} | null>} null si el navegador no puede generarlas
 */
export async function createImageVariants(file) {
  if (!file || !file.type.startsWith("image/")) return null;
  try {
    const image = await loadImage(file);
    const name = baseName(file.name);
    const [thumb, large] = await Promise.all([
      resize(image, { maxWidth: 400, maxHeight: Infinity, quality: 0.7 }),
      resize(image, { maxWidth: 1600, maxHeight: Infinity, quality: 0.78 }),
    ]);
    if (!thumb || !large) return null;
    return { thumb: toFile(thumb, `${name}.w400`), large: toFile(large, `${name}.w1600`) };
  } catch {
    return null;
  }
}
