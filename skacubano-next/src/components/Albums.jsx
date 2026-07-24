"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"; // Importamos las herramientas de animación y scroll

const albums = [
  { 
    id: 1, title: "Ska Cubano", cover: "/images/albums/skacubano.jpg", year: "2004",
    links: { 
      sp: "https://open.spotify.com/intl-es/album/3N58JMWyiCXtS0uJB5Kvxt?si=jB9p9RSnTsGstRTSSgQAbw",
      yt: "https://www.youtube.com/watch?v=wnMAwJ4KaPM&list=OLAK5uy_ll4KrcoDJi0_RU3fwPh0zAePNQo33j5KQ",
      ap: "https://music.apple.com/es/album/ska-cubano/949685364" 
    } 
  },
  { 
    id: 2, title: "Ajiaco!", cover: "/images/albums/ajiaco.jpg", year: "2007",
    links: { 
      sp: "https://open.spotify.com/intl-es/album/4l0RKxCjk4xB9a4lsQ6SXK?si=cFJxv-07QR-5Hrrx_oADYQ",
      yt: "https://www.youtube.com/watch?v=40_2h7Vkpo8&list=OLAK5uy_kOaE4-Bqj6IwANG6RfDGqqQmewJ1T7I8g",
      ap: "https://music.apple.com/es/album/ajiaco-the-remix-album/705272102" 
    } 
  },
  { 
    id: 3, title: "¡Ay Caramba!", cover: "/images/albums/caramba.jpg", year: "2005",
    links: { 
      sp: "https://open.spotify.com/intl-es/album/6dGWSlqez8ptLOJBCt1ymW?si=afdcvAJvT2OK5qXWkgrZXA",
      yt: "https://www.youtube.com/watch?v=nwLyUCy7O7A&list=OLAK5uy_k0ldgoIleSHm7Ljh7-cr_NnXXH-dyWLVY",
      ap: "https://music.apple.com/es/album/ay-caramba/902312351" 
    } 
  },
  { 
    id: 4, title: "Mambo Ska", cover: "/images/albums/mamboska.jpg", year: "2010",
    links: { 
      sp: "https://open.spotify.com/intl-es/album/7qfCYynbJSqc6OzpLQwRy6?si=x5ulwQg5TsuDsn1MhpTHvg",
      yt: "https://www.youtube.com/watch?v=Es62wlmIlyE&list=OLAK5uy_m0kRcur0qgsmu9v5gZDePEDx4pXJiCFGg",
      ap: "https://music.apple.com/es/album/mambo-ska/1617405456" 
    } 
  },
];

import { useLanguage } from "../context/LanguageContext";

export default function Albums() {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const containerRef = useRef(null);
  const { t } = useLanguage();

  // Rastreo de la posición de scroll sobre el contenedor de discografía
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transformaciones de movimiento y rotación sutiles al scrollear (Parallax)
  const trumpetY = useTransform(scrollYProgress, [0, 1], [-60, 100]);
  const trumpetRot = useTransform(scrollYProgress, [0, 1], [-20, 5]);

  const guitarY = useTransform(scrollYProgress, [0, 1], [60, -100]);
  const guitarRot = useTransform(scrollYProgress, [0, 1], [15, -5]);

  const drumsY = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const drumsRot = useTransform(scrollYProgress, [0, 1], [-10, 15]);

  const saxY = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const saxRot = useTransform(scrollYProgress, [0, 1], [-15, 10]);

  return (
    <section 
      id="music"
      ref={containerRef}
      className="min-h-screen w-full bg-cuban-yellow flex flex-col items-center justify-center overflow-hidden px-4 py-20 relative border-t border-amber-900/20"
    >
      
      {/* INSTRUMENTOS FLOTANTES CON PARALLAX (Ocultos en móvil para no tapar los discos) */}
      
      {/* Trompeta - Arriba a la Izquierda */}
      <motion.div
        style={{ y: trumpetY, rotate: trumpetRot }}
        className="hidden lg:block absolute left-[9%] xl:left-[12%] top-[12%] w-56 z-0 pointer-events-none select-none opacity-20"
      >
        <motion.img
          src="/images/instruments/Trompeta.png"
          alt="Trompeta"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))" }}
          animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Guitarra - Arriba a la Derecha */}
      <motion.div
        style={{ y: guitarY, rotate: guitarRot }}
        className="hidden lg:block absolute right-[9%] xl:right-[12%] top-[18%] w-60 z-0 pointer-events-none select-none opacity-20"
      >
        <motion.img
          src="/images/instruments/Guitarra.png"
          alt="Guitarra"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))" }}
          animate={{ y: [0, -15, 0], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>

      {/* Bombos/Percusión - Abajo a la Izquierda */}
      <motion.div
        style={{ y: drumsY, rotate: drumsRot }}
        className="hidden lg:block absolute left-[7%] xl:left-[10%] bottom-[12%] w-64 z-0 pointer-events-none select-none opacity-20"
      >
        <motion.img
          src="/images/instruments/Bombos.png"
          alt="Bombos y percusión"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))" }}
          animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      {/* Saxofón - Abajo a la Derecha */}
      <motion.div
        style={{ y: saxY, rotate: saxRot }}
        className="hidden lg:block absolute right-[7%] xl:right-[10%] bottom-[15%] w-56 z-0 pointer-events-none select-none opacity-20"
      >
        <motion.img
          src="/images/instruments/Saxofon.png"
          alt="Saxofón"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))" }}
          animate={{ y: [0, -14, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </motion.div>
      
      <div className="text-center mb-16 relative z-10">
        <span className="text-[#d35400] text-xs font-mono tracking-[0.4em] uppercase block mb-3 font-bold drop-shadow">
          {t.albums.badge}
        </span>
        <h2 className="font-bowlorama text-4xl md:text-7xl text-[#2a1a0a] tracking-wide text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)] pb-4">
          {t.albums.title}
        </h2>
        <div className="w-24 h-1.5 bg-[#d35400] mx-auto mt-6 rounded-full shadow-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-x-40 max-w-5xl mx-auto">
        
        {albums.map((album, index) => {
          const isLeftColumn = index % 2 === 0;

          return (
            <div key={album.id} className="flex flex-col items-center relative">
              
              <div 
                className="group relative w-44 h-44 md:w-56 md:h-56 cursor-pointer"
                onClick={() => setActiveAlbum(activeAlbum === album.id ? null : album.id)}
              >
                
                {/* VINILO */}
                <div className="absolute inset-0 bg-[#1a1a1a] rounded-full shadow-xl transition-transform duration-700 group-hover:translate-x-10 md:group-hover:translate-x-20 flex items-center justify-center z-10">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-[6px] md:border-[8px] border-[#222] flex items-center justify-center">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#d35400] rounded-full"></div>
                  </div>
                </div>

                {/* PORTADA */}
                <div className="relative z-20 w-full h-full shadow-lg border-l border-white/10 bg-slate-800">
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover rounded-sm" />
                </div>

                {/* BOCADILLO CON ANIMACIÓN */}
                <AnimatePresence>
                  {activeAlbum === album.id && (
                    <motion.div
                      // Definimos el estado inicial (invisible y pequeño)
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      // Estado al aparecer (visible y tamaño real)
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      // Estado al desaparecer
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      // Tipo de movimiento (un "pop" elástico)
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      
                      className={`
                        absolute z-50 bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem]
                        shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                        flex gap-6 md:gap-8 items-center border-4 border-[#d35400]/10

                        /* MOBILE */
                        top-full mt-6 left-1/2 -translate-x-1/2

                        /* DESKTOP */
                        md:top-1/2 md:-translate-y-1/2 md:left-auto md:translate-x-0
                        ${isLeftColumn ? "md:right-full md:mr-16" : "md:left-full md:ml-16"}
                      `}
                    >
                     {/* FLECHA (FIX RESPONSIVE TOTAL) */}
                    <div className={`
                    absolute w-6 h-6 bg-white rotate-45 border-[#d35400]/10 z-0
                    
                    /* 1. MÓVIL (Por defecto) */
                    -top-2 left-1/2 -translate-x-1/2 border-t-4 border-l-4

                    /* 2. ESCRITORIO (Limpieza y nueva posición) */
                    /* El md:inset-auto es vital: borra el 'top' y el 'left' del móvil */
                    md:inset-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0
                    
                    ${isLeftColumn 
                        ? "md:-right-3 md:border-t-4 md:border-r-4 md:border-b-0 md:border-l-0" 
                        : "md:-left-3 md:border-b-4 md:border-l-4 md:border-t-0 md:border-r-0"
                    }
                    `} />

                      <div className="relative z-10 flex gap-6 md:gap-8">
                        <a href={album.links.sp} target="_blank" className="w-12 h-12 md:w-14 md:h-14 block hover:scale-110 transition-transform">
                          <img src="/images/icons/spotify.png" alt="Spotify" className="w-full h-full object-contain" />
                        </a>
                        <a href={album.links.yt} target="_blank" className="w-12 h-12 md:w-14 md:h-14 block hover:scale-110 transition-transform">
                          <img src="/images/icons/youtube.png" alt="YouTube" className="w-full h-full object-contain" />
                        </a>
                        <a href={album.links.ap} target="_blank" className="w-12 h-12 md:w-14 md:h-14 block hover:scale-110 transition-transform">
                          <img src="/images/icons/apple_music.svg" alt="Apple Music" className="w-full h-full object-contain" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TEXTO */}
              <div className="mt-4 text-center">
                <h3 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-widest leading-tight">
                  {album.title}
                </h3>
                <p className="text-[#d35400] text-xs font-mono">{album.year}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}