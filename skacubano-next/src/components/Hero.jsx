"use client"; // 1. Indica que este componente tiene "vida" en el navegador

import { useState, useEffect } from "react"; // 2. Importamos las herramientas correctas
import { motion } from "framer-motion"; // Importamos Framer Motion para animaciones premium

// La lista de imágenes puede ir fuera de la función porque no cambia
const images = [
  "/images/hero/SkaImagen2.jpg",
  "/images/hero/SkaImagen1.jpg",
  "/images/hero/SkaImagen3.jpg",
  "/images/hero/SkaImagen4.jpg",
  "/images/hero/SkaImagen5.jpg",
  "/images/hero/SkaImagen6.jpg",
  "/images/hero/SkaImagen7.jpg",
  "/images/hero/SkaImagen8.jpg",
  "/images/hero/SkaImagen9.jpg",
  "/images/hero/SkaImagen10.jpg",
  "/images/hero/SkaImagen11.jpg",
  "/images/hero/SkaImagen12.jpg",
  "/images/hero/SkaImagen13.jpg",
  "/images/hero/SkaImagen14.jpg",
  "/images/hero/SkaImagen15.jpg",
  "/images/hero/SkaImagen16.jpg",
  "/images/hero/SkaImagen17.jpg"
];

// Función para manejar el scroll suave
const handleSmoothScroll = (e, href) => {
  if (href.startsWith("#")) {
    e.preventDefault();
    const targetId = href.substring(1);
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 80; // Altura del Navbar
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", href);
    }
  }
};

import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center">
      
      {/* Las imágenes DENTRO de la sección */}
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Skacubano Hero ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Capa de oscurecimiento (vignette y contraste para textos) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(13,10,7,0.95) 100%)"
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-16">

        {/* Logo Oficial de Ska Cubano */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-4 max-w-xs sm:max-w-md md:max-w-lg"
        >
          <img 
            src="/images/logos/logoSkaCubano.png" 
            alt="Ska Cubano Official Emblem" 
            className="w-full h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] mx-auto"
          />
        </motion.div>

        {/* Insignia / Badge Retro */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/40 bg-black/50 backdrop-blur-md mb-6 shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-[#d35400] animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-yellow-400 font-semibold">
            {t.hero.badge}
          </span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="font-bowlorama text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-[#faf6ee] uppercase tracking-wider leading-none mb-6 select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
          style={{
            textShadow: "4px 4px 0px #1a0a00, 8px 8px 18px rgba(0,0,0,0.7)"
          }}
        >
          {t.hero.title1} <span className="text-[#d35400] font-bowlorama">{t.hero.title2}</span>
        </motion.h1>

        {/* Eslogan / Subtítulo */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-amber-50/90 max-w-2xl mx-auto mb-10 leading-relaxed font-serif italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {t.hero.slogan}
        </motion.p>

        {/* Botones de acción */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
        >
          <a
            href="#music"
            onClick={(e) => handleSmoothScroll(e, "#music")}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d35400] text-[#faf6ee] font-bold tracking-widest text-xs uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300 rounded-sm hover:scale-105 shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-center"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            {t.hero.exploreBtn}
          </a>
          <a
            href="#history"
            onClick={(e) => handleSmoothScroll(e, "#history")}
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-white/60 hover:border-yellow-400 text-white font-bold tracking-widest text-xs uppercase hover:bg-white/5 transition-all duration-300 rounded-sm hover:scale-105 text-center"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            {t.hero.storyBtn}
          </a>
        </motion.div>
      </div>

      {/* Indicador de scroll animado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8, y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        onClick={(e) => handleSmoothScroll(e, "#music")}
        className="absolute bottom-8 z-20 cursor-pointer flex flex-col items-center select-none"
      >
        <span className="text-[10px] text-amber-50/40 uppercase tracking-[0.25em] mb-2 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {t.hero.scrollDown}
        </span>
        <svg className="w-5 h-5 text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>

    </section>
  );
}