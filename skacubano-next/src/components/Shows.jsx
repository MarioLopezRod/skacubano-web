"use client";

import { motion } from "framer-motion";

const SHOWS_DATA = [
  {
    festival: "GLASTONBURY FESTIVAL",
    location: "Pilton, Reino Unido",
    year: "Hitos Giras",
    details: "Escenario principal de World Music. Considerado uno de los conciertos de ska más enérgicos del festival.",
    badge: "MÍTICO"
  },
  {
    festival: "WOMAD FESTIVAL",
    location: "Reino Unido, España, Australia",
    year: "Gira Global",
    details: "Actuación estelar en múltiples sedes internacionales del festival de músicas del mundo fundado por Peter Gabriel.",
    badge: "ESTELAR"
  },
  {
    festival: "FUJI ROCK FESTIVAL",
    location: "Naeba, Japón",
    year: "Tour Asia",
    details: "Lleno absoluto en los escenarios del festival de montaña más importante de Asia durante su aclamada gira japonesa.",
    badge: "SOLD OUT"
  },
  {
    festival: "ROSKILDE FESTIVAL",
    location: "Roskilde, Dinamarca",
    year: "Gira Europea",
    details: "El corazón del norte de Europa vibrando al ritmo del mambo-ska tradicional en una noche memorable.",
    badge: "LEYENDA"
  },
  {
    festival: "BIG DAY OUT",
    location: "Sídney, Melbourne, Australia",
    year: "Tour Oceanía",
    details: "Gira multitudinaria por las principales ciudades de Australia y Nueva Zelanda, marcando un hito en las antípodas.",
    badge: "DESTACADO"
  },
  {
    festival: "CHICAGO WORLD MUSIC",
    location: "Chicago, Estados Unidos",
    year: "Tour EE.UU.",
    details: "Conquista del público norteamericano en una serie de conciertos con un derroche inigualable de vientos y percusión.",
    badge: "TRIUNFO"
  }
];

export default function Shows() {
  return (
    <section 
      id="shows" 
      className="relative w-full bg-[#18130f] px-4 py-20 md:py-32 overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(211,84,0,0.08) 0%, transparent 80%)"
      }}
    >
      {/* Detalle decorativo de grano de película o madera */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Cabecera de la sección */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[#d35400] text-xs font-mono tracking-[0.4em] uppercase block mb-3">
            — Conciertos Históricos —
          </span>
          <h2 className="font-alfa text-4xl md:text-6xl text-white tracking-tight leading-none uppercase">
            GIRAS Y SHOWS
          </h2>
          <p className="mt-4 text-amber-50/60 font-serif italic text-sm md:text-base max-w-lg mx-auto">
            Ska Cubano ha recorrido más de 30 países, llevando su directo explosivo a los escenarios más prestigiosos de la música mundial.
          </p>
          <div className="w-16 h-1 bg-[#d35400] mx-auto mt-6" />
        </div>

        {/* Listado de Shows (Estilo Cartelera Retro de Club) */}
        <div className="border border-yellow-900/25 rounded-sm overflow-hidden bg-[#1e1713] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Cabecera de la Tabla / Cartelera */}
          <div className="hidden md:flex items-center px-8 py-4 bg-[#140f0c] border-b border-yellow-900/25 text-yellow-500 font-mono text-xs tracking-widest uppercase">
            <div className="w-1/4">FESTIVAL / TOUR</div>
            <div className="w-1/4">LUGAR</div>
            <div className="w-2/5">DETALLES DE LA ACTUACIÓN</div>
            <div className="w-12 text-right">INFO</div>
          </div>

          {/* Filas de la Cartelera */}
          <div className="divide-y divide-yellow-900/10">
            {SHOWS_DATA.map((show, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="flex flex-col md:flex-row md:items-center px-6 md:px-8 py-6 hover:bg-[#d35400]/5 transition-colors duration-200 group relative"
              >
                {/* Festival */}
                <div className="w-full md:w-1/4 mb-2 md:mb-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-alfa text-base md:text-lg text-white group-hover:text-yellow-400 transition-colors">
                      {show.festival}
                    </h3>
                  </div>
                </div>

                {/* Lugar */}
                <div className="w-full md:w-1/4 mb-4 md:mb-0 flex flex-col justify-center">
                  <span className="text-amber-50/80 font-serif italic text-sm">
                    {show.location}
                  </span>
                  <span className="text-[#d35400] font-mono text-[10px] tracking-widest uppercase mt-0.5">
                    {show.year}
                  </span>
                </div>

                {/* Detalles */}
                <div className="w-full md:w-2/5 pr-4 mb-4 md:mb-0">
                  <p className="text-amber-50/60 text-xs md:text-sm leading-relaxed">
                    {show.details}
                  </p>
                </div>

                {/* Badge Sello */}
                <div className="w-full md:w-12 flex md:justify-end items-center">
                  <span 
                    className="inline-block px-2.5 py-1 text-[9px] font-bold font-mono tracking-widest uppercase border border-[#d35400]/40 text-[#d35400] rounded-sm bg-[#d35400]/5 group-hover:bg-[#d35400] group-hover:text-black group-hover:border-[#d35400] transition-all duration-300"
                  >
                    {show.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decoración del pie de sección */}
        <div className="text-center mt-12 font-mono text-[10px] tracking-[0.3em] text-[#d35400]/50 uppercase">
          ★ Giras mundiales 2004 — 2014 • London to Santiago ★
        </div>
      </div>
    </section>
  );
}
