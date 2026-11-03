"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useShowsData, pickLang } from "../lib/showsData";
import BowloramaText from "./BowloramaText";

// Miniatura + botón de play: el reproductor de YouTube (pesado) solo se carga si el visitante lo pulsa
function YouTubeLite({ youtubeId, title, playLabel }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${playLabel}: ${title}`}
      className="absolute inset-0 w-full h-full group/play cursor-pointer"
    >
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-90 group-hover/play:opacity-100 transition-opacity"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-11 rounded-xl bg-[#d35400]/90 group-hover/play:bg-[#d35400] flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.6)] group-hover/play:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

export default function Shows() {
  const { t, lang } = useLanguage();
  const { shows, videos } = useShowsData();

  return (
    <section
      id="shows"
      className="relative w-full bg-cuban-fence px-4 py-20 md:py-32 overflow-hidden border-t border-amber-900/30"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Cabecera de la sección */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-yellow-400 text-xs font-mono tracking-[0.4em] uppercase block mb-3 font-bold drop-shadow">
            {t.shows.badge}
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl text-[#faf6ee] tracking-wide leading-none uppercase drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)] pb-4">
            <BowloramaText text={t.shows.title} />
          </h2>
          <p className="mt-4 text-amber-100/80 font-serif italic text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {t.shows.subtitle}
          </p>
          <div className="w-24 h-1.5 bg-[#d35400] mx-auto mt-8 rounded-full shadow-md" />
        </div>

        {/* VIDEOS GRID CONTAINER */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24">
          {videos.map((video, idx) => {
            const title = pickLang(video.title, lang);
            return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-[#181512] rounded-lg overflow-hidden border border-white/[0.04] shadow-[0_12px_32px_rgba(0,0,0,0.8)] hover:border-[#faab15]/20 group transition-all duration-300 flex flex-col"
            >
              {/* Responsive Video Wrapper */}
              <div className="relative w-full aspect-video bg-black">
                <YouTubeLite youtubeId={video.youtubeId} title={title} playLabel={t.shows.playVideo} />
              </div>

              {/* Video Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#faab15]/80 uppercase tracking-widest block mb-1">
                    {pickLang(video.location, lang)}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors leading-snug">
                    {title}
                  </h3>
                  <p className="mt-3 text-white/60 text-xs md:text-[13px] leading-relaxed">
                    {pickLang(video.description, lang)}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Listado de Shows (Estilo Cartelera Retro de Club) */}
        <div className="border-2 border-yellow-500/30 rounded-sm overflow-hidden bg-[#18120d]/95 backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.8)]">

          {/* Cabecera de la Tabla / Cartelera */}
          <div className="hidden md:grid grid-cols-12 items-center px-8 py-4 bg-[#140f0c] border-b border-yellow-900/25 text-yellow-500 font-mono text-xs tracking-widest uppercase">
            <div className="col-span-4">{t.shows.tableHeader.festival}</div>
            <div className="col-span-3">{t.shows.tableHeader.location}</div>
            <div className="col-span-5">{t.shows.tableHeader.details}</div>
          </div>

          {/* Filas de la Cartelera */}
          <div className="divide-y divide-yellow-900/15">
            {shows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(index, 10) * 0.04, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center px-6 md:px-8 py-5 hover:bg-[#d35400]/10 transition-colors duration-200 group gap-3 md:gap-0"
              >
                {/* Festival */}
                <div className="col-span-1 md:col-span-4 md:pr-4">
                  <h3 className="font-retro50s text-[#faf6ee] text-base md:text-lg lg:text-xl group-hover:text-yellow-400 transition-colors tracking-wide leading-snug">
                    {pickLang(show.festival, lang)}
                  </h3>
                </div>

                {/* Lugar */}
                <div className="col-span-1 md:col-span-3 flex flex-col justify-center md:pr-4">
                  <span className="text-amber-50/90 font-serif italic text-sm">
                    {pickLang(show.location, lang)}
                  </span>
                  <span className="text-[#d35400] font-mono text-[10px] tracking-widest uppercase mt-0.5 font-bold">
                    {pickLang(show.year, lang)}
                  </span>
                </div>

                {/* Detalles */}
                <div className="col-span-1 md:col-span-5 md:pr-2">
                  <p className="text-amber-100/70 text-xs md:text-sm leading-relaxed">
                    {pickLang(show.details, lang)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decoración del pie de sección */}
        <div className="text-center mt-12 font-mono text-[10px] tracking-[0.3em] text-[#d35400]/60 uppercase font-bold">
          {t.shows.tagline}
        </div>
      </div>
    </section>
  );
}
