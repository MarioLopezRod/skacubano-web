import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function GalleryLightbox({ photo, photos = [], onClose, onSelectPhoto }) {
  const { lang } = useLanguage();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!photo) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigate(-1);
      } else if (e.key === "ArrowRight") {
        navigate(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, photos]);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  
  const navigate = (direction) => {
    if (photos.length === 0 || currentIndex === -1) return;
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = photos.length - 1;
    if (nextIndex >= photos.length) nextIndex = 0;
    onSelectPhoto(photos[nextIndex]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-yellow-500/40 bg-[#0d0a07] shadow-[0_0_50px_rgba(250,204,21,0.2)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-yellow-400 uppercase font-bold">
                {photo.fecha ? `★ ${photo.fecha}` : "SKA CUBANO ARCHIVE"}
              </span>
              {photos.length > 1 && (
                <span className="text-xs text-amber-100/60 font-mono ml-2">
                  ({currentIndex + 1} / {photos.length})
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black text-white flex items-center justify-center transition-colors font-bold text-lg cursor-pointer"
              title="Cerrar (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Image Display */}
          <div className="relative w-full h-[60vh] sm:h-[68vh] bg-black/90 flex items-center justify-center p-2 group">
            <div className="relative w-full h-full max-h-full flex items-center justify-center">
              <Image
                src={photo.url}
                alt={photo.descripcion || "Foto Ska Cubano"}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-contain drop-shadow-2xl select-none"
              />
            </div>

            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-yellow-400 hover:text-black text-white/90 border border-yellow-400/40 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-110"
                  title="Anterior (Flecha izquierda)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-yellow-400 hover:text-black text-white/90 border border-yellow-400/40 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-110"
                  title="Siguiente (Flecha derecha)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption Bar */}
          {((lang === "en" ? photo.descripcionEn : photo.descripcion) || photo.esPrincipal) && (
            <div className="w-full px-6 py-4 bg-[#14100c] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {(lang === "en" ? photo.descripcionEn : photo.descripcion) ? (
                <p className="text-sm font-sans text-amber-100/90 leading-relaxed max-w-3xl">
                  {lang === "en" && photo.descripcionEn ? photo.descripcionEn : photo.descripcion}
                </p>
              ) : (
                <div />
              )}
              {photo.esPrincipal && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-mono font-semibold shrink-0 uppercase">
                  ★ FOTO PRINCIPAL
                </span>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
