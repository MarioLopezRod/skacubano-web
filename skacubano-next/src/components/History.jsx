"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function History() {
  const { t } = useLanguage();

  return (
    <section 
      id="history" 
      className="relative w-full bg-cuban-blue px-4 py-20 md:py-32 overflow-hidden border-t border-yellow-800/20"
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
        <div className="text-center mb-16 md:mb-24">
          <span 
            className="text-yellow-400 text-xs font-mono tracking-[0.4em] uppercase block mb-3 drop-shadow"
          >
            {t.history.badge}
          </span>
          <h2 
            className="font-bowlorama text-4xl md:text-7xl text-[#faf6ee] tracking-wide leading-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            {t.history.title}
          </h2>
          <div className="w-20 h-1 bg-[#d35400] mx-auto mt-6 shadow-md" />
        </div>

        {/* Línea de Tiempo */}
        <div className="relative w-full">
          {/* Línea vertical central */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-yellow-500/40 -translate-x-[1px] md:-translate-x-1/2 z-0" />

          {/* Bloques de la línea de tiempo */}
          <div className="space-y-12 md:space-y-20 relative z-10">
            {t.history.events.map((event, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-start ${
                    isLeft ? "md:flex-row-reverse" : ""
                  } relative w-full`}
                >
                  {/* Punto indicador sobre la línea de tiempo */}
                  <div 
                    className="absolute left-4 md:left-1/2 w-5 h-5 rounded-full bg-[#d35400] border-4 border-yellow-400 -translate-x-1/2 top-3 z-20 shadow-lg"
                  />

                  {/* Lado Vacío (espacio en escritorio) */}
                  <div className="hidden md:block w-1/2 px-8" />

                  {/* Lado Contenedor de la Tarjeta */}
                  <div className="w-full md:w-1/2 pl-12 pr-4 md:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="bg-[#faf6ee] p-6 md:p-8 rounded-sm shadow-[0_12px_36px_rgba(0,0,0,0.4)] border-2 border-amber-950/20 relative hover:shadow-[0_16px_45px_rgba(0,0,0,0.5)] transition-all duration-300 group overflow-hidden"
                    >
                      {/* Sello postal retro */}
                      <div className="absolute top-4 right-4 text-[10px] font-mono font-bold tracking-widest text-[#d35400] uppercase border border-[#d35400]/40 px-2.5 py-1 rounded-sm bg-amber-100/60 rotate-2 shadow-sm">
                        {event.stamp}
                      </div>

                      {/* Chincheta decorativa */}
                      <div className="absolute -top-2 left-6 w-3.5 h-3.5 bg-amber-800 rounded-full border-2 border-white shadow-md group-hover:bg-[#d35400] transition-colors duration-300" />

                      {/* Foto Histórica Archivo */}
                      {event.photo && (
                        <div className="mb-4 rounded-sm overflow-hidden border border-amber-900/20 shadow-sm max-h-48">
                          <img 
                            src={event.photo} 
                            alt={event.title} 
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      )}
                      
                      {/* Año destacado (Uso de font-alfa para perfecta alineación de números) */}
                      <span 
                        className="font-alfa text-3xl md:text-5xl text-[#d35400] tracking-tight block mb-2 leading-none"
                      >
                        {event.year}
                      </span>

                      {/* Título */}
                      <h3 
                        className="font-bowlorama text-xl md:text-2xl text-zinc-900 uppercase tracking-wide mb-1"
                      >
                        {event.title}
                      </h3>

                      {/* Subtítulo */}
                      <span 
                        className="text-xs uppercase font-mono tracking-wider text-amber-900/80 block mb-3 font-semibold"
                      >
                        {event.subtitle}
                      </span>

                      {/* Texto */}
                      <p 
                        className="text-zinc-800 font-serif text-sm md:text-base leading-relaxed"
                      >
                        {event.text}
                      </p>
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
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mt-20 md:mt-32 max-w-xl mx-auto p-6 rounded-lg bg-black/40 backdrop-blur-md border border-yellow-500/20 shadow-xl"
        >
          <p className="text-yellow-100/90 font-serif italic text-lg leading-relaxed">
            {t.history.quote}
          </p>
          <span className="text-yellow-400 font-mono text-xs uppercase tracking-[0.25em] mt-4 block font-bold">
            {t.history.tag}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
