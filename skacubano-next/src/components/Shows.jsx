"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import BowloramaText from "./BowloramaText";

const showVideos = [
  {
    id: "ISKzBoIjls8",
    title: "Live at the Nobel Peace Prize Concert",
    location: "Oslo, Norway (2005)",
    description: "A legendary performance introduced by Salma Hayek to a global audience of millions following the band's BBC World Music Award nomination.",
  },
  {
    id: "RrD1GKeGcgc",
    title: "Ska Cubano Live Show",
    location: "Festival Stage Performance",
    description: "Experience the band's raw, infectious energy and brass-heavy mambo-ska backbeat driving festival crowds wild.",
  },
  {
    id: "CmoXFLzOiFc",
    title: "Freedom Sounds 2019 Live",
    location: "Cologne, Germany (2019)",
    description: "Ska Cubano performs Cleopatra at Freedom Sounds festival in Cologne, Germany in 2019.",
  },
];

export default function Shows() {
  const { t } = useLanguage();

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
          {(t.shows.videos || showVideos).map((video, idx) => (
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
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#faab15]/80 uppercase tracking-widest block mb-1">
                    {video.location}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="mt-3 text-white/60 text-xs md:text-[13px] leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
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
            {t.shows.data.map((show, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center px-6 md:px-8 py-5 hover:bg-[#d35400]/10 transition-colors duration-200 group gap-3 md:gap-0"
              >
                {/* Festival */}
                <div className="col-span-1 md:col-span-4 md:pr-4">
                  <h3 className="font-bowlorama text-[#faf6ee] text-base md:text-lg lg:text-xl group-hover:text-yellow-400 transition-colors tracking-wide leading-snug">
                    {show.festival}
                  </h3>
                </div>

                {/* Lugar */}
                <div className="col-span-1 md:col-span-3 flex flex-col justify-center md:pr-4">
                  <span className="text-amber-50/90 font-serif italic text-sm">
                    {show.location}
                  </span>
                  <span className="text-[#d35400] font-mono text-[10px] tracking-widest uppercase mt-0.5 font-bold">
                    {show.year}
                  </span>
                </div>

                {/* Detalles */}
                <div className="col-span-1 md:col-span-5 md:pr-2">
                  <p className="text-amber-100/70 text-xs md:text-sm leading-relaxed">
                    {show.details}
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
