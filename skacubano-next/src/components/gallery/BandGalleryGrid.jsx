"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function BandGalleryGrid({ photos = [], onSelectPhoto }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filmstripRef = useRef(null);
  const { lang } = useLanguage();

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-black/60 rounded-2xl border border-dashed border-yellow-400/30">
        <p className="text-yellow-400/80 font-mono text-sm uppercase tracking-wider">
          No hay fotografías en la galería general de la banda.
        </p>
      </div>
    );
  }

  const sortedPhotos = [...photos].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const currentPhoto = sortedPhotos[selectedIndex] || sortedPhotos[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? sortedPhotos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === sortedPhotos.length - 1 ? 0 : prev + 1));
  };

  const scrollFilmstrip = (direction) => {
    if (filmstripRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      filmstripRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── SECCIÓN PRINCIPAL: EXPOSICIÓN DE FOTO DESTACADA A GRAN TAMAÑO ── */}
      <div className="relative w-full rounded-2xl bg-[#120d09] border-2 border-yellow-500/40 p-3 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Contenedor de la foto principal destacada */}
        <div 
          onClick={() => onSelectPhoto(currentPhoto)}
          className="relative w-full h-[340px] sm:h-[480px] md:h-[540px] rounded-xl overflow-hidden bg-black/90 cursor-pointer group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.descripcion || "Foto Ska Cubano"}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Flechas Navegación Foto Principal */}
          <button
            onClick={handlePrev}
            aria-label="Fotografía anterior"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 border border-yellow-400/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-200 shadow-2xl hover:scale-110"
          >
            <span className="text-xl sm:text-2xl font-bold font-mono">‹</span>
          </button>

          <button
            onClick={handleNext}
            aria-label="Fotografía siguiente"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 border border-yellow-400/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-200 shadow-2xl hover:scale-110"
          >
            <span className="text-xl sm:text-2xl font-bold font-mono">›</span>
          </button>

          {/* Pie de foto */}
          {((lang === "en" ? currentPhoto.descripcionEn : currentPhoto.descripcion) || currentPhoto.fecha) && (
            <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
              {(lang === "en" ? currentPhoto.descripcionEn : currentPhoto.descripcion) && (
                <p className="text-sm sm:text-lg font-serif italic text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-2">
                  {lang === "en" && currentPhoto.descripcionEn ? currentPhoto.descripcionEn : currentPhoto.descripcion}
                </p>
              )}
              {currentPhoto.fecha && (
                <span className="inline-block mt-1 text-[10px] sm:text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-yellow-400/30">
                  ★ {currentPhoto.fecha}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CINTA / FILMSTRIP HORIZONTAL PARA NAVEGAR FECHAS Y FOTOS ── */}
      <div className="space-y-2 bg-[#120d09]/80 p-3.5 rounded-2xl border border-yellow-500/25">
        <div className="flex items-center justify-end">
          {/* Botones de navegación horizontal */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollFilmstrip("left")}
              className="w-8 h-8 rounded-full bg-black/80 border border-yellow-400/40 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-sm font-mono font-bold shadow"
              title="Desplazar a la izquierda"
            >
              ‹
            </button>
            <button
              onClick={() => scrollFilmstrip("right")}
              className="w-8 h-8 rounded-full bg-black/80 border border-yellow-400/40 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all text-sm font-mono font-bold shadow"
              title="Desplazar a la derecha"
            >
              ›
            </button>
          </div>
        </div>

        {/* Contenedor con Scroll Horizontal Limpio */}
        <div 
          ref={filmstripRef}
          className="flex items-center gap-3 overflow-x-auto py-2 px-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#d35400 #14100c" }}
        >
          {sortedPhotos.map((photo, idx) => {
            const isSelected = idx === selectedIndex;

            return (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(idx)}
                className={`relative flex-shrink-0 w-36 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 snap-start bg-black/80 ${
                  isSelected
                    ? "border-3 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)] ring-2 ring-yellow-400/50 scale-105 z-10"
                    : "border border-yellow-500/30 opacity-75 hover:opacity-100 hover:border-yellow-400/80"
                }`}
              >
                <Image
                  src={photo.url}
                  alt={photo.descripcion || `Foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                
                {/* Indicador de seleccionado */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[10px] font-bold shadow">
                    ✓
                  </div>
                )}

                {/* Insignia de Fecha / Año en cada foto */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-mono font-bold text-amber-200">
                  <span className="bg-black/75 px-1.5 py-0.5 rounded border border-yellow-400/30 text-yellow-300">
                    {photo.fecha || `Nº ${idx + 1}`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
