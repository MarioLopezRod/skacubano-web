"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BandGalleryGrid({ photos = [], onSelectPhoto }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-black/60 rounded-2xl border border-dashed border-yellow-400/30">
        <p className="text-yellow-400/80 font-mono text-sm uppercase tracking-wider">
          No hay fotografías en la galería general de la banda.
        </p>
      </div>
    );
  }

  // Sort photos by orden
  const sortedPhotos = [...photos].sort((a, b) => (a.orden || 0) - (b.orden || 0));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sortedPhotos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          onClick={() => onSelectPhoto(photo)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#14100c] border-2 border-yellow-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(250,204,21,0.25)]"
        >
          {/* Vintage Photo Frame Effect */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/80 p-2">
            <div className="relative w-full h-full overflow-hidden rounded-lg border border-yellow-400/20">
              <Image
                src={photo.url}
                alt={photo.descripcion || "Foto Ska Cubano"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

              {/* Date / Event Cuban Stamp Badge */}
              {photo.fecha && (
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#0d0a07]/90 border border-yellow-400/50 text-[10px] font-mono font-bold text-yellow-400 backdrop-blur-md shadow-md uppercase tracking-wider">
                  ★ {photo.fecha}
                </div>
              )}

              {/* Hover Expand Icon */}
              <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl translate-y-2 group-hover:translate-y-0 font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Caption info */}
          <div className="p-4 bg-[#14100c] border-t border-yellow-400/10 flex flex-col justify-between">
            <p className="text-xs font-sans text-amber-100/90 line-clamp-2 leading-relaxed font-medium">
              {photo.descripcion || "Ska Cubano en vivo"}
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-yellow-400/70 font-semibold uppercase">
              <span>Ska Cubano</span>
              <span>★</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
