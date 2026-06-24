"use client";

import { motion } from "framer-motion";

const TIMELINE_EVENTS = [
  {
    year: "2001",
    title: "SANTIAGO DE CUBA",
    subtitle: "La idea de una historia alternativa",
    text: "El gestor de inversiones Peter A. Scott decide recrear una 'historia alternativa en la que el ska cubano hubiera surgido de forma natural'. Viaja a Santiago de Cuba con el carismático cantante y DJ Natty Bo (Nathan Lerner) para ensayar y grabar su álbum debut con talentos locales como el cantante Beny Billy (Juan Manuel Villy Carbonell).",
    align: "left"
  },
  {
    year: "2004",
    title: "LA BIG BAND",
    subtitle: "Conexión Londres - Caribe",
    text: "A finales de 2004, la banda se consolida en Londres con músicos caribeños e internacionales de primer nivel, incluyendo a Rey Crespo y Ernesto Estruch (La Habana), Dr. Sleepy (Montserrat), Eddie 'Tan Tan' Thornton (Jamaica), Miss Megoo (Japón) y Trevor Edwards (Londres), con Beny Billy viajando constantemente desde Cuba para giras y grabaciones.",
    align: "right"
  },
  {
    year: "2005",
    title: "¡AY CARAMBA!",
    subtitle: "Nominación a los Premios BBC",
    text: "Lanzan su aclamado segundo álbum, '¡Ay Caramba!', que es nominado a los prestigiosos premios BBC World Music Award en la categoría 'Crossover'. La prensa musical lo describe como 'imaginativo, lleno de melodía, ingenio y una fusión alegre de ritmos irresistibles'. En 2006, el cantante venezolano Carlos Peña se une como co-líder vocal.",
    align: "left"
  },
  {
    year: "2010",
    title: "MAMBO SKA",
    subtitle: "Sonido de alto octanaje",
    text: "Se publica 'Mambo Ska', calificado por la prestigiosa revista All About Jazz como 'una explosión ruidosa, desordenada e irresistible de música de alto octanaje'. Su popular tema 'Soy Campesino' se convierte en un fenómeno publicitario navideño en el Reino Unido para la cadena Comet.",
    align: "right"
  },
  {
    year: "LEGADO",
    title: "GIRAS GLOBALES",
    subtitle: "Más de 30 países conquistados",
    text: "Con uno de los directos más enérgicos y fiesteros del mundo, Ska Cubano se presenta en los principales escenarios y festivales internacionales de prestigio como Glastonbury, WOMAD y Big Day Out, llevando su fusión contagiosa a rincones de todo el planeta.",
    align: "left"
  }
];

export default function History() {
  return (
    <section 
      id="history" 
      className="relative w-full bg-[#fcfbf7] px-4 py-20 md:py-32 overflow-hidden border-t border-yellow-800/10"
    >
      {/* Elemento decorativo de fondo: Papel pautado o manchado */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: "radial-gradient(#d4c4a8 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Cabecera de la sección */}
        <div className="text-center mb-16 md:mb-24">
          <span 
            className="text-[#d35400] text-xs font-mono tracking-[0.4em] uppercase block mb-3"
          >
            — Nuestra Trayectoria —
          </span>
          <h2 
            className="font-alfa text-4xl md:text-6xl text-zinc-900 tracking-tight leading-none uppercase"
          >
            HISTORIA
          </h2>
          <div className="w-16 h-1 bg-[#d35400] mx-auto mt-6" />
        </div>

        {/* Línea de Tiempo */}
        <div className="relative w-full">
          {/* Línea vertical central */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#d35400]/25 -translate-x-[1px] md:-translate-x-1/2 z-0" />

          {/* Bloques de la línea de tiempo */}
          <div className="space-y-12 md:space-y-20 relative z-10">
            {TIMELINE_EVENTS.map((event, index) => {
              const isLeft = event.align === "left";

              return (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-start ${
                    isLeft ? "md:flex-row-reverse" : ""
                  } relative w-full`}
                >
                  {/* Punto indicador sobre la línea de tiempo */}
                  <div 
                    className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#d35400] border-4 border-[#fcfbf7] -translate-x-1/2 top-2 z-20 shadow-md"
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
                      className="bg-[#faf6ee] p-6 md:p-8 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#d4c4a8]/30 relative hover:shadow-[0_12px_40px_rgba(211,84,0,0.08)] transition-all duration-300 group"
                    >
                      {/* Chincheta o detalle decorativo superior retro */}
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-zinc-700 rounded-full border border-white shadow-sm opacity-60 group-hover:bg-[#d35400] transition-colors duration-300" />
                      
                      {/* Año destacado */}
                      <span 
                        className="font-alfa text-3xl md:text-5xl text-[#d35400]/80 tracking-tighter block mb-2"
                      >
                        {event.year}
                      </span>

                      {/* Título */}
                      <h3 
                        className="font-alfa text-lg md:text-xl text-zinc-900 uppercase tracking-tight mb-1"
                      >
                        {event.title}
                      </h3>

                      {/* Subtítulo */}
                      <span 
                        className="text-xs uppercase font-mono tracking-wider text-zinc-500 block mb-4"
                      >
                        {event.subtitle}
                      </span>

                      {/* Texto */}
                      <p 
                        className="text-zinc-700 font-serif text-sm md:text-base leading-relaxed"
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
          className="text-center mt-20 md:mt-32 max-w-xl mx-auto"
        >
          <p className="text-zinc-400 font-serif italic text-lg leading-relaxed">
            "Aunque la banda hoy no está en activo, la fusión mágica del Ska jamaicano y el Son cubano sigue resonando en sus grabaciones y en la memoria de miles de fans en todo el mundo."
          </p>
          <span className="text-[#d35400] font-mono text-xs uppercase tracking-[0.2em] mt-3 block">
            ★ original ska & son ★
          </span>
        </motion.div>
      </div>
    </section>
  );
}
