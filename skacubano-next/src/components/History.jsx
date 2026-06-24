"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const milestones = [
  {
    year: "2001",
    title: "La Utopía de Dos Islas",
    subtitle: "El Sueño Caribeño",
    quote: "¿Y si las fronteras políticas nunca hubieran silenciado la síncopa?",
    text: "Todo comenzó en el corazón de Londres, donde el visionario productor y melómano Peter A. Scott concibió un audaz ejercicio de 'historia alternativa'. Se preguntó qué habría ocurrido si Cuba y Jamaica, dos gigantes musicales separados por escasos kilómetros de mar Caribe, hubieran entrelazado sus ritmos libremente antes de la Revolución de 1959. Para dar vida a este puente imaginario, Scott buscó a Natty Bo (Nathan Lerner), el carismático líder de la banda de ska londinense Top Cats. Juntos, decidieron reescribir la historia a través del baile.",
    badge: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#8c6239]/25 absolute top-4 right-4 -rotate-12 pointer-events-none fill-none stroke-current" strokeWidth="2">
        <rect x="10" y="10" width="80" height="80" rx="8" />
        <rect x="15" y="15" width="70" height="70" rx="4" strokeDasharray="3,3" />
        <text x="50" y="36" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">LONDON</text>
        <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="black" fill="currentColor" stroke="none">2001</text>
        <text x="50" y="70" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">OFFICIAL</text>
      </svg>
    ),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    year: "2002",
    title: "El Sonido en las Calles",
    subtitle: "La Raíz en Santiago de Cuba",
    quote: "Encontramos la voz de Santiago en un rincón cubierto de humo, guitarras y ron.",
    text: "Decididos a buscar la raíz de su idea, Scott y Natty Bo viajaron a Santiago de Cuba, la cuna del son tradicional. Allí, entre callejones coloniales y cantos trasnochados, se toparon en un bar con Juan Manuel Villy Carbonell, conocido artísticamente como 'Beny Billy'. Su voz vibrante y desgarradora parecía invocar al mismísimo Beny Moré, el 'Bárbaro del Ritmo'. Junto a él y una constelación de instrumentistas locales santiagueros, grabaron las primeras maquetas de lo que sería una revolución sonora transatlántica.",
    badge: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#8c6239]/25 absolute top-4 right-4 rotate-12 pointer-events-none fill-none stroke-current" strokeWidth="2">
        <circle cx="50" cy="50" r="45" strokeDasharray="4,4" />
        <circle cx="50" cy="50" r="38" />
        <text x="50" y="38" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">SANTIAGO</text>
        <text x="50" y="53" textAnchor="middle" fontSize="10" fontWeight="black" fill="currentColor" stroke="none">2002</text>
        <text x="50" y="66" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">DE CUBA</text>
      </svg>
    ),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    )
  },
  {
    year: "2004",
    title: "La Conexión de Londres",
    subtitle: "Nace la Superbanda",
    quote: "Una orquesta sin fronteras: de Jamaica y Cuba al río Támesis.",
    text: "El experimento de estudio creció rápidamente hasta convertirse en un monstruo de los escenarios. De regreso a Londres, Scott y Natty Bo reunieron a una alineación estelar única: el legendario trompetista jamaiquino Eddie 'Tan Tan' Thornton (quien grabó con The Beatles, Jimi Hendrix y Boney M), la virtuosa saxofonista japonesa Megumi Mesaku ('Miss Megoo'), y prodigios del contrabajo y el tres cubano como Rey Crespo y Jesús Cutiño. Su álbum debut homónimo desató una fiebre colectiva e inauguró un nuevo género en el mundo entero.",
    badge: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#8c6239]/25 absolute top-4 right-4 rotate-6 pointer-events-none fill-none stroke-current" strokeWidth="2">
        <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        <polygon points="50,12 87,28 87,72 50,88 13,72 13,28" strokeDasharray="2,2" />
        <text x="50" y="42" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">SUPERBANDA</text>
        <text x="50" y="58" textAnchor="middle" fontSize="11" fontWeight="black" fill="currentColor" stroke="none">2004</text>
        <text x="50" y="71" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">LONDON</text>
      </svg>
    ),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  {
    year: "2005 - 2010",
    title: "Mambo Ska Global",
    subtitle: "La Fiesta Sin Límites",
    quote: "El mambo-ska no se explica en los libros, se baila bajo el sol o bajo la lluvia.",
    text: "Con la incorporación del vocalista venezolano Carlos Pena en 2006, la banda consolidó su arrollador directo. Álbumes memorables como '¡Ay Caramba!' (nominado a los prestigiosos premios BBC World Music Awards) y 'Mambo Ska' (2010) definieron un sonido libre y frenético. Recorrieron más de 30 países y fueron cabezas de cartel en los festivales más importantes de la música global, desde Glastonbury hasta el WOMAD. Ska Cubano demostró que el ska y el mambo nacieron para ser hermanos de sangre.",
    badge: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#8c6239]/25 absolute top-4 right-4 -rotate-6 pointer-events-none fill-none stroke-current" strokeWidth="2">
        <ellipse cx="50" cy="50" rx="48" ry="32" />
        <ellipse cx="50" cy="50" rx="42" ry="26" strokeDasharray="4,2" />
        <text x="50" y="44" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">WORLD TOUR</text>
        <text x="50" y="55" textAnchor="middle" fontSize="8" fontWeight="black" fill="currentColor" stroke="none">2005-2010</text>
        <text x="50" y="66" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">BBC NOMINEE</text>
      </svg>
    ),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.373-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
      </svg>
    )
  }
];
export default function History() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section
      id="history"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f3eac0] via-[#5b4027] to-[#0d0a07] py-24 px-4 md:px-8"
    >
      {/* Film grain overlay for paper/vintage texture */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Decorative compass lines in background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center z-0">
        <svg width="600" height="600" viewBox="0 0 200 200" fill="none" stroke="#f3eac0" strokeWidth="0.5">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" strokeDasharray="2,2" />
          <line x1="100" y1="0" x2="100" y2="200" />
          <line x1="0" y1="100" x2="200" y2="100" />
          <line x1="29.29" y1="29.29" x2="170.71" y2="170.71" />
          <line x1="29.29" y1="170.71" x2="170.71" y2="29.29" />
        </svg>
      </div>
      <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-[#d35400] tracking-tighter italic leading-none drop-shadow-[0_2px_10px_rgba(243,234,192,0.15)]">
            NUESTRA HISTORIA
          </h2>
          <p
            className="mt-3 text-[#2a1a0a] text-xs md:text-sm font-bold uppercase tracking-[.35em]"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            — La Utopía del Ritmo —
          </p>
        </div>
        {/* Outer Box with two columns */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* LEFT COLUMN: The Interactive Timeline list */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-3 lg:gap-6 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[#8c6239]/20 pr-0 lg:pr-8 overflow-x-auto lg:overflow-x-visible scrollbar-none">
            {milestones.map((milestone, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={milestone.year}
                  onClick={() => setActiveIndex(idx)}
                  className="flex-shrink-0 flex items-center gap-4 lg:text-right group cursor-pointer focus:outline-none py-2 px-1 rounded-lg"
                >
                  {/* Desktop only: text labeling */}
                  <div className="hidden lg:block">
                    <p className={`text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-[#f3eac0]" : "text-[#f3eac0]/40 group-hover:text-[#f3eac0]/80"}`}>
                      {milestone.subtitle.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <h3 className={`text-base font-bold transition-colors duration-300 ${isActive ? "text-yellow-400" : "text-[#f3eac0]/60 group-hover:text-yellow-400/80"}`}>
                      {milestone.title}
                    </h3>
                  </div>
                  {/* Year Bubble Badge */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center font-black transition-all duration-300 border-2 ${isActive
                      ? "bg-[#d35400] border-yellow-400 text-[#f3eac0] shadow-[0_0_20px_rgba(211,84,0,0.5)]"
                      : "bg-[#2a1a0a]/70 border-[#8c6239]/30 text-[#f3eac0]/70 group-hover:border-yellow-400/50 group-hover:text-yellow-400"
                      }`}
                  >
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tight leading-none">
                      {milestone.year.split(" ")[0]}
                    </span>
                    {milestone.year.includes("-") && (
                      <span className="text-[7px] md:text-[8px] font-semibold leading-none mt-0.5">
                        - {milestone.year.split("-")[1].trim()}
                      </span>
                    )}
                    {/* Timeline line connector - Desktop only */}
                    {idx < milestones.length - 1 && (
                      <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#8c6239]/30 pointer-events-none mt-2" />
                    )}
                  </motion.div>
                </button>
              );
            })}
          </div>
          {/* RIGHT COLUMN: The Scrapbook Content Display */}
          <div className="lg:col-span-8 relative flex items-center">
            <div className="w-full min-h-[420px] md:min-h-[380px] flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20, rotate: -0.5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -20, rotate: 0.5 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full bg-[#fcf8ef] rounded-md shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-6 md:p-10 border border-[#e8dcb9] flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative Vintage Stamp */}
                  {milestones[activeIndex].badge}
                  {/* Top Header details inside Card */}
                  <div>
                    <div className="flex items-center gap-3 mb-4 text-[#8c6239]">
                      <div className="p-2 bg-[#8c6239]/10 rounded-full text-[#8c6239]">
                        {milestones[activeIndex].icon}
                      </div>
                      <div>
                        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[.25em] font-bold block opacity-75">
                          {milestones[activeIndex].year} — {milestones[activeIndex].subtitle}
                        </span>
                        <h3 className="text-xl md:text-3xl font-extrabold text-[#2a1a0a] tracking-tight leading-none mt-1">
                          {milestones[activeIndex].title}
                        </h3>
                      </div>
                    </div>
                    {/* Handwritten Style Quote */}
                    <p
                      className="text-base md:text-lg text-[#b85b24] italic mb-6 leading-relaxed border-l-4 border-[#b85b24]/30 pl-4 py-1"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      “{milestones[activeIndex].quote}”
                    </p>
                    {/* Description Paragraph */}
                    <p
                      className="text-slate-800 text-sm md:text-[15px] leading-relaxed tracking-wide"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {milestones[activeIndex].text}
                    </p>
                  </div>
                  {/* Card bottom details */}
                  <div className="mt-8 pt-4 border-t border-[#8c6239]/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8c6239]/60">
                      Ska Cubano • La Utopía del Ritmo
                    </span>
                    <span className="text-[10px] font-mono text-[#8c6239]/60">
                      Pág. {activeIndex + 1} de {milestones.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}