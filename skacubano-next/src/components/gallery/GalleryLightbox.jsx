import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage, localized } from "@/context/LanguageContext";
import { optimizedSrc } from "@/lib/images";

// Elementos que pueden recibir el foco con Tab (para mantenerlo dentro del visor)
const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// `photos` debe llegar ya en el orden de la galería: el contador "n / total" y las flechas lo siguen
export default function GalleryLightbox({ photo, photos = [], onClose, onSelectPhoto }) {
  const { lang, t } = useLanguage();
  const l = t.lightbox;
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isOpen = !!photo;

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;

  const navigate = (direction) => {
    if (photos.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + photos.length) % photos.length;
    onSelectPhoto(photos[nextIndex]);
  };

  // Teclado: Esc cierra, flechas cambian de foto y Tab no sale del visor
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigate(-1);
      } else if (e.key === "ArrowRight") {
        navigate(1);
      } else if (e.key === "Tab" && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Al abrir: bloquea el scroll del fondo y lleva el foco al visor. Al cerrar: lo devuelve a donde estaba.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    // Compensa el ancho de la barra de scroll para que la página no "salte" al ocultarla
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen]);

  if (!photo) return null;

  const caption = localized(photo, "descripcion", lang);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-xl overscroll-contain"
        onClick={onClose}
      >
        {/* Modal Container */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={l.dialogLabel}
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
                {photo.fecha ? `★ ${photo.fecha}` : l.archive}
              </span>
              {photos.length > 1 && currentIndex !== -1 && (
                <span className="text-xs text-amber-100/60 font-mono ml-2" aria-live="polite">
                  ({currentIndex + 1} / {photos.length})
                </span>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black text-white flex items-center justify-center transition-colors font-bold text-lg cursor-pointer"
              title={l.close}
              aria-label={l.close}
            >
              ✕
            </button>
          </div>

          {/* Image Display */}
          <div className="relative w-full h-[60vh] sm:h-[68vh] bg-black/90 flex items-center justify-center p-2 group">
            <div className="relative w-full h-full max-h-full flex items-center justify-center">
              <Image
                key={photo.id}
                src={optimizedSrc(photo, "large")}
                alt={caption || t.gallery.photoAlt}
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
                  type="button"
                  onClick={() => navigate(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-yellow-400 hover:text-black text-white/90 border border-yellow-400/40 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-110"
                  title={l.prev}
                  aria-label={l.prev}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-yellow-400 hover:text-black text-white/90 border border-yellow-400/40 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-110"
                  title={l.next}
                  aria-label={l.next}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption Bar */}
          {(caption || photo.esPrincipal) && (
            <div className="w-full px-6 py-4 bg-[#14100c] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {caption ? (
                <p className="text-sm font-sans text-amber-100/90 leading-relaxed max-w-3xl">{caption}</p>
              ) : (
                <div />
              )}
              {photo.esPrincipal && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-mono font-semibold shrink-0 uppercase">
                  {l.mainPhoto}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
