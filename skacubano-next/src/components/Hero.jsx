"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

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

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-[100vh] h-[100dvh] min-h-[100vh] min-h-[100dvh] overflow-hidden flex flex-col items-center justify-between"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >

      {/* Carrusel de imágenes de fondo */}
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Ska Cubano ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms" }}
        />
      ))}

      {/* Capa de ambiente retro cubano-jamaicano */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(13,9,6,0.85) 0%, rgba(18,12,7,0.55) 50%, rgba(13,9,6,0.98) 100%)"
        }}
      />

      {/* Contenido principal (Logo + Eslogan) centrado verticalmente en la zona superior/media */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 pt-20 sm:pt-24 pb-4">

        {/* LOGO OFICIAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-[260px] xs:max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shrink-0"
        >
          <img
            src="/images/logos/logoSkaCubano.png"
            alt="Ska Cubano Big Band Logo"
            className="w-full h-auto drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)] mx-auto hover:scale-102 transition-transform duration-300"
          />
        </motion.div>

        {/* Eslogan / Subtítulo informativo */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-amber-100/90 font-serif italic text-xs sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-2"
        >
          "{t.hero.slogan}"
        </motion.p>

      </div>

      {/* Indicador de scroll - Anclado cerca del borde inferior (~5%-8% margen) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="relative z-20 flex flex-col items-center gap-1.5 shrink-0 pb-6 sm:pb-8 md:pb-10"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-yellow-500/70 font-semibold">
          {t.hero.scrollDown}
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-yellow-500/40 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-[#d35400]"
          />
        </div>
      </motion.div>

    </section>
  );
}