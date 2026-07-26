"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BowloramaText from "../BowloramaText";

export default function MemberDetailView({ member, photos = [], onBack, onSelectPhoto }) {
  if (!member) return null;

  const memberPhotos = photos
    .filter((p) => p.integranteId === member.id)
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const mainPhoto = member.fotoPrincipalUrl || (memberPhotos[0]?.url) || "/images/photos/bio_portrait_natty.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-yellow-400/50 bg-black/80 hover:bg-yellow-400 hover:text-black font-mono font-bold text-xs uppercase tracking-widest text-yellow-400 transition-all duration-200 cursor-pointer shadow-lg"
        >
          <span>← Volver a Integrantes</span>
        </button>
      </div>

      {/* Member Hero Banner with Cuban Vintage Paper Texture */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-yellow-500/40 bg-cuban-paper p-6 sm:p-10 shadow-2xl text-[#171717]">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Main Profile Photo Badge Frame */}
          <div className="relative w-48 h-60 sm:w-56 sm:h-68 rounded-2xl overflow-hidden border-4 border-[#14100c] shadow-[0_10px_30px_rgba(0,0,0,0.5)] shrink-0 group">
            <Image
              src={mainPhoto}
              alt={member.nombre}
              fill
              sizes="(max-width: 768px) 224px, 256px"
              priority
              className="object-cover"
            />
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-yellow-400 text-black text-[9px] font-mono font-bold uppercase shadow">
              Foto Principal
            </div>
          </div>

          {/* Bio & Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-block px-4 py-1 rounded-full bg-[#14100c] text-yellow-400 border border-yellow-400/40 text-xs font-mono font-bold uppercase tracking-widest shadow">
              ★ {member.rol} ★
            </div>
            
            <h2 className="font-bebas text-5xl sm:text-7xl text-[#0d0a07] uppercase tracking-wider drop-shadow leading-none mb-1">
              {member.nombre}
            </h2>

            <div className="w-16 h-1 bg-[#d35400] mx-auto md:mx-0 shadow-sm" />

            <p className="font-sans text-base sm:text-lg text-amber-950/90 leading-relaxed max-w-3xl font-medium">
              {member.bio || "Integrante destacado del ensamble internacional Ska Cubano."}
            </p>
          </div>
        </div>
      </div>

      {/* Member Additional Photos Grid */}
      <div className="space-y-6">
        <h3 className="font-bowlorama text-2xl text-yellow-400 uppercase tracking-wide flex items-center gap-3 drop-shadow">
          <span>GALERIA DE FOTOS DE {member.nombre.toUpperCase()}</span>
          <div className="h-[2px] flex-1 bg-yellow-400/20" />
        </h3>

        {memberPhotos.length === 0 ? (
          <div className="text-center py-12 px-4 bg-black/60 rounded-2xl border border-dashed border-yellow-400/30">
            <p className="text-yellow-400/80 font-mono text-sm uppercase tracking-wider">
              Aún no se han añadido fotos adicionales para {member.nombre}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memberPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onSelectPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#14100c] border border-yellow-400/30 shadow-md hover:border-yellow-400 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black p-1.5">
                  <div className="relative w-full h-full overflow-hidden rounded-lg">
                    <Image
                      src={photo.url}
                      alt={photo.descripcion || member.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {photo.esPrincipal && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-yellow-400 text-black text-[9px] font-mono font-bold uppercase shadow">
                        Foto de Perfil
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-[#14100c]">
                  <p className="text-xs font-sans text-amber-100/90 line-clamp-2">
                    {photo.descripcion || `Foto de ${member.nombre}`}
                  </p>
                  {photo.fecha && (
                    <p className="text-[10px] font-mono text-yellow-400/70 mt-1 uppercase">
                      ★ {photo.fecha}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
