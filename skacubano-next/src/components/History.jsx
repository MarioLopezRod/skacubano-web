"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import BowloramaText from "./BowloramaText";

// Fotos históricas asignadas a cada hito para completar el espacio opuesto
const eventPhotos = [
  { photo: "/images/photos/beny_natty_santiago.jpg", caption: "Santiago de Cuba 2001 • Primeros ensayos" },
  { photo: "/images/hero/SkaImagen11.jpg", caption: "Londres 2004 • Consolidación de la Big Band" },
  { photo: "/images/albums/caramba.jpg", caption: "¡Ay Caramba! • Premio BBC World Music" },
  { photo: "/images/albums/mamboska.jpg", caption: "Mambo Ska 2010 • Sonido de alto octanaje" },
  { photo: "/images/hero/SkaImagen16.jpg", caption: "World Tour • Glastonbury & WOMAD" },
];

export default function History() {
  const { t } = useLanguage();

  return (
    <section
      id="history"
      className="relative w-full bg-cuban-blue px-4 py-16 md:py-24 overflow-hidden border-t border-yellow-800/20"
    >
      {/* Superposición sutil para riqueza visual */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: "radial-gradient(#d35400 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Cabecera de la sección */}


        <div className="text-center mb-10 md:mb-14">
          <span 

            className="text-yellow-400 text-xs font-mono tracking-[0.4em] uppercase block mb-3 drop-shadow font-bold"
          >
            {t.history.badge}
          </span>
          <h2
            className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl text-[#faf6ee] tracking-wide leading-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            <BowloramaText text={t.history.title} />
          </h2>
          <div className="w-20 h-1 bg-[#d35400] mx-auto mt-6 shadow-md rounded-full" />
        </div>

        {/* Vídeo Principal de Presentación de la Banda */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-14 md:mb-20 max-w-4xl mx-auto relative px-2 sm:px-0"
        >
          <div className="bg-[#140e0a] rounded-sm p-4 sm:p-6 border-2 border-yellow-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.7)] relative group hover:border-yellow-400/70 transition-colors duration-300">
            {/* Cinta adhesiva vintage en esquina superior */}
            <div className="absolute -top-3 right-10 sm:right-16 w-24 sm:w-28 h-6 bg-amber-100/30 backdrop-blur-sm border border-amber-200/40 -rotate-3 shadow-sm z-30" />

        

            {/* Encabezado del vídeo con tipografía corporativa */}
            <div className="mb-4 pt-2">
              <span className="text-yellow-400 font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase block mb-1">
                {t.history.videoBadge || "★ PRESENTACIÓN OFICIAL Y DOCUMENTAL ★"}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-4xl text-[#faf6ee] tracking-wide uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                <BowloramaText text={t.history.videoTitle || "La Historia de Ska Cubano"} />
              </h3>
              <div className="w-16 h-1 bg-[#d35400] mt-2 shadow-sm rounded-full" />
            </div>

            {/* Contenedor del Vídeo HTML5 */}
            <div className="relative aspect-video w-full rounded-xs overflow-hidden bg-black shadow-2xl border-2 border-yellow-500/30 group-hover:border-yellow-400/50 transition-colors duration-300">
              <video 
                controls 
                preload="metadata" 
                poster="/images/hero/SkaImagen11.jpg"
                className="w-full h-full object-contain"
              >
                <source src="/videos/ska-cubano-promo.mp4" type="video/mp4" />
                Tu navegador no soporta el reproductor de vídeo HTML5.
              </video>
            </div>

            {/* Descripción del vídeo */}
            <div className="mt-4 pt-3 border-t border-yellow-500/20">
              <p className="text-amber-100/90 font-serif text-sm sm:text-base leading-relaxed">
                {t.history.videoDesc || "Descubre el origen, la energía y la fusión del Ska jamaicano con el auténtico sabor del Son cubano en este vídeo de presentación oficial."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Línea de Tiempo Compacta */}
        <div className="relative w-full">
          {/* Línea vertical central */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-yellow-500/40 -translate-x-[1px] md:-translate-x-1/2 z-0" />

          {/* Bloques compactos de la línea de tiempo */}
          <div className="space-y-8 md:space-y-10 relative z-10">
            {t.history.events.map((event, index) => {
              const isLeft = index % 2 === 0;
              const photoData = eventPhotos[index] || eventPhotos[0];

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center relative w-full"
                >
                  {/* Punto indicador sobre la línea de tiempo */}
                  <div
                    className="absolute left-4 md:left-1/2 w-5 h-5 rounded-full bg-[#d35400] border-4 border-yellow-400 -translate-x-1/2 top-6 z-20 shadow-lg"
                  />

                  {/* LADO 1: Tarjeta de Texto e Historia */}
                  <div className={`w-full md:w-1/2 pl-12 pr-4 md:px-6 ${isLeft ? "md:order-1" : "md:order-2"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -25 : 25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-[#faf6ee] p-5 md:p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-2 border-amber-950/20 relative hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group overflow-hidden"
                    >
                      {/* Sello postal retro */}
                      <div className="absolute top-4 right-4 text-[9px] font-mono font-bold tracking-widest text-[#d35400] uppercase border border-[#d35400]/40 px-2 py-0.5 rounded-sm bg-amber-100/60 rotate-2 shadow-sm">
                        {event.stamp}
                      </div>

                      {/* Chincheta decorativa */}

                      {/* Año destacado */}
                      <span
                        className="font-alfa text-3xl md:text-4xl text-[#d35400] tracking-tight block mb-1 leading-none"
                      >
                        {event.year}
                      </span>

                      {/* Título */}
                      <h3
                        className="text-lg md:text-xl text-zinc-900 uppercase tracking-wide mb-1 flex items-center"
                      >
                        <BowloramaText text={event.title} />
                      </h3>

                      {/* Subtítulo */}
                      <span
                        className="text-[11px] uppercase font-mono tracking-wider text-amber-900/80 block mb-2 font-semibold"
                      >
                        {event.subtitle}
                      </span>

                      {/* Texto */}
                      <p
                        className="text-zinc-800 font-serif text-xs md:text-sm leading-relaxed"
                      >
                        {event.text}
                      </p>
                    </motion.div>
                  </div>

                  {/* LADO 2: Tarjeta Polaroid de Foto Histórica que llena el espacio opuesto */}
                  <div className={`hidden md:block w-1/2 px-6 ${isLeft ? "md:order-2" : "md:order-1"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? 25 : -25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                      className="bg-[#140e0a] p-3 rounded-sm border-2 border-yellow-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative hover:border-yellow-400 transition-all duration-300 group"
                    >
                      {/* Cinta adhesiva vintage en esquina */}
                      <div className="absolute -top-2.5 right-8 w-16 h-5 bg-amber-100/30 backdrop-blur-sm border border-amber-200/40 rotate-6 shadow-sm z-10" />

                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-black">
                        <img
                          src={photoData.photo}
                          alt={photoData.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2.5 text-[10px] font-mono font-bold text-yellow-300 drop-shadow">
                          ★ {photoData.caption}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Cita final o frase retro */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-14 md:mt-20 max-w-xl mx-auto p-6 rounded-lg bg-black/50 backdrop-blur-md border border-yellow-500/30 shadow-xl"
        >
          <p className="text-yellow-100/90 font-serif italic text-base md:text-lg leading-relaxed">
            {t.history.quote}
          </p>
          <span className="text-yellow-400 font-mono text-xs uppercase tracking-[0.25em] mt-3 block font-bold">
            {t.history.tag}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
