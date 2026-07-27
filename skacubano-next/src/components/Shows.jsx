"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import BowloramaText from "./BowloramaText";

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

        {/* Listado de Shows (Estilo Cartelera Retro de Club) */}
        <div className="border-2 border-yellow-500/30 rounded-sm overflow-hidden bg-[#18120d]/95 backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          
          {/* Cabecera de la Tabla / Cartelera */}
          <div className="hidden md:grid grid-cols-12 items-center px-8 py-4 bg-[#140f0c] border-b border-yellow-900/25 text-yellow-500 font-mono text-xs tracking-widest uppercase">
            <div className="col-span-4">{t.shows.tableHeader.festival}</div>
            <div className="col-span-3">{t.shows.tableHeader.location}</div>
            <div className="col-span-3">{t.shows.tableHeader.details}</div>
            <div className="col-span-2 text-right">{t.shows.tableHeader.status}</div>
          </div>

          {/* Filas de la Cartelera */}
          <div className="divide-y divide-yellow-900/15">
            {t.shows.data.map((show, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center px-6 md:px-8 py-6 hover:bg-[#d35400]/10 transition-colors duration-200 group gap-3 md:gap-0"
              >
                {/* Festival */}
                <div className="col-span-1 md:col-span-4 md:pr-4">
                  <h3 className="font-bowlorama text-[#faf6ee] text-base md:text-lg lg:text-xl group-hover:text-yellow-400 transition-colors tracking-wide leading-snug">
                    {show.festival}
                  </h3>
                </div>

                {/* Lugar */}
                <div className="col-span-1 md:col-span-3 flex flex-col justify-center md:pr-2">
                  <span className="text-amber-50/90 font-serif italic text-sm">
                    {show.location}
                  </span>
                  <span className="text-[#d35400] font-mono text-[10px] tracking-widest uppercase mt-0.5 font-bold">
                    {show.year}
                  </span>
                </div>

                {/* Detalles */}
                <div className="col-span-1 md:col-span-3 md:pr-4">
                  <p className="text-amber-100/70 text-xs md:text-sm leading-relaxed">
                    {show.details}
                  </p>
                </div>

                {/* Badge Sello */}
                <div className="col-span-1 md:col-span-2 flex md:justify-end items-center mt-2 md:mt-0">
                  <span 
                    className="inline-block px-3 py-1 text-[9px] font-bold font-mono tracking-widest uppercase border border-[#d35400]/50 text-yellow-400 rounded-sm bg-[#d35400]/10 group-hover:bg-[#d35400] group-hover:text-black group-hover:border-[#d35400] transition-all duration-300 shadow-sm"
                  >
                    {show.badge}
                  </span>
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

