/**
 * Compresses an image file in the browser using Canvas API.
 * @param {File} file - Original image file
 * @param {Object} options - Max width, height, quality
 * @returns {Promise<File>} Compressed File object
 */
export async function compressImage(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target.result;
    };

    image.onload = () => {
      let { width, height } = image;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/webp',
        quality
      );
    };

    image.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
