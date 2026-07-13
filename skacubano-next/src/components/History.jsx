"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const milestones = [
  {
    year: "2001",
    title: "The Two-Island Utopia",
    subtitle: "The Caribbean Dream",
    quote: "What if political borders had never silenced the syncopation?",
    text: "It all began in the heart of London, where visionary producer and music lover Peter A. Scott conceived a bold exercise in 'alternate history'. He wondered what would have happened if Cuba and Jamaica, two musical giants separated by just a few miles of the Caribbean Sea, had freely intertwined their rhythms before the 1959 Revolution. To bring this imaginary bridge to life, Scott sought out Natty Bo (Nathan Lerner), the charismatic leader of London ska band Top Cats. Together, they decided to rewrite history through dance.",
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
    title: "The Sound on the Streets",
    subtitle: "The Roots in Santiago de Cuba",
    quote: "We found the voice of Santiago in a corner filled with smoke, guitars, and rum.",
    text: "Determined to find the roots of their idea, Scott and Natty Bo traveled to Santiago de Cuba, the cradle of traditional son. There, among colonial alleyways and late-night songs, they came across Juan Manuel Villy Carbonell, known artistically as 'Beny Billy', in a bar. His vibrant, soulful voice seemed to summon Beny Moré himself, the 'Barbarón del Ritmo'. Along with him and a constellation of local musicians from Santiago, they recorded the first demos of what would become a transatlantic sound revolution.",
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
    title: "The London Connection",
    subtitle: "The Superband is Born",
    quote: "An orchestra without borders: from Jamaica and Cuba to the River Thames.",
    text: "The studio experiment quickly grew into a live-performance powerhouse. Returning to London, Scott and Natty Bo assembled a stellar, unique lineup: legendary Jamaican trumpeter Eddie 'Tan Tan' Thornton (who recorded with The Beatles, Jimi Hendrix, and Boney M), virtuous Japanese saxophonist Megumi Mesaku ('Miss Megoo'), and double bass and Cuban tres prodigies like Rey Crespo and Jesús Cutiño. Their self-titled debut album unleashed a collective fever and inaugurated a new genre worldwide.",
    badge: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#8c6239]/25 absolute top-4 right-4 rotate-6 pointer-events-none fill-none stroke-current" strokeWidth="2">
        <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        <polygon points="50,12 87,28 87,72 50,88 13,72 13,28" strokeDasharray="2,2" />
        <text x="50" y="42" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">SUPERBAND</text>
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
    title: "Global Mambo Ska",
    subtitle: "The Party Without Borders",
    quote: "Mambo-ska isn't explained in books; it is danced under the sun or under the rain.",
    text: "With the addition of Venezuelan vocalist Carlos Pena in 2006, the band consolidated its devastating live show. Memorable albums like '¡Ay Caramba!' (nominated for the prestigious BBC World Music Awards) and 'Mambo Ska' (2010) defined a free, frenetic sound. They toured more than 30 countries and headlined the most important global music festivals, from Glastonbury to WOMAD. Ska Cubano proved that ska and mambo were born to be blood brothers.",
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
            OUR STORY
          </h2>
          <p
            className="mt-3 text-[#2a1a0a] text-xs md:text-sm font-bold uppercase tracking-[.35em]"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            — The Rhythm Utopia —
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
                      Ska Cubano • The Rhythm Utopia
                    </span>
                    <span className="text-[10px] font-mono text-[#8c6239]/60">
                      Page {activeIndex + 1} of {milestones.length}
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