"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { LOGO_HANDOFF_SCROLL, LOGO_FADE_START } from "../lib/logoScroll";

// Fotos por defecto si desde el panel de admin no se ha marcado ninguna para el carrusel
const defaultImages = [
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
  // null mientras se cargan las fotos, para no mostrar las de por defecto y cambiarlas justo después
  const [images, setImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  // ── Logo que sube y se encoge hasta el logo del navbar al hacer scroll ──
  const logoAnchorRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Distancias medidas en pantalla: { dx, dy, scale } entre el logo del Hero y el del navbar
  const logoMetrics = useMotionValue(null);

  useEffect(() => {
    const measure = () => {
      const anchor = logoAnchorRef.current;
      // Hay un logo de navbar para escritorio y otro para móvil; se usa el que está visible
      const target = Array.from(document.querySelectorAll("[data-nav-logo]")).find(
        (el) => el.getBoundingClientRect().width > 0
      );
      if (!anchor || !target) return;
      const a = anchor.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      // El ancla no lleva transformaciones: su posición en el documento es fija
      const heroCenterX = a.left + a.width / 2;
      const heroCenterDocY = a.top + window.scrollY + a.height / 2;
      logoMetrics.set({
        dx: b.left + b.width / 2 - heroCenterX,
        // El navbar es fixed: su centro no depende del scroll
        dy: b.top + b.height / 2 - heroCenterDocY + LOGO_HANDOFF_SCROLL,
        scale: b.width / a.width,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    const img = logoAnchorRef.current?.querySelector("img");
    img?.addEventListener("load", measure);
    return () => {
      window.removeEventListener("resize", measure);
      img?.removeEventListener("load", measure);
    };
  }, [logoMetrics]);

  const progress = (y) => Math.min(Math.max(y / LOGO_HANDOFF_SCROLL, 0), 1);
  // Mientras sube, compensa el propio scroll de la página para acabar justo encima del logo del navbar
  const logoX = useTransform([scrollY, logoMetrics], ([y, m]) => (m && !reduceMotion ? progress(y) * m.dx : 0));
  const logoY = useTransform([scrollY, logoMetrics], ([y, m]) => (m && !reduceMotion ? progress(y) * m.dy : 0));
  const logoScale = useTransform([scrollY, logoMetrics], ([y, m]) =>
    m && !reduceMotion ? 1 + progress(y) * (m.scale - 1) : 1
  );
  const logoOpacity = useTransform(scrollY, [LOGO_FADE_START, LOGO_HANDOFF_SCROLL], [1, 0]);

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        const carrusel = (json.fotos || []).filter((f) => f.enCarrusel).map((f) => f.url);
        if (!cancelled) setImages(carrusel.length > 0 ? carrusel : defaultImages);
      } catch (err) {
        if (!cancelled) setImages(defaultImages);
      }
    };

    loadImages();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!images || images.length < 2) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <section
      id="hero"
      className="relative w-full h-[100vh] h-[100dvh] min-h-[100vh] min-h-[100dvh] overflow-hidden flex flex-col items-center justify-between"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >

      {/* Carrusel de imágenes de fondo. Solo se montan la foto actual, la siguiente (precargada para
          el cambio) y la anterior (para el fundido): así no se descargan todas las fotos al entrar. */}
      {(images || []).map((image, index) => {
        const total = images.length;
        const isCurrent = index === currentImageIndex;
        const isNext = index === (currentImageIndex + 1) % total;
        const isPrev = index === (currentImageIndex - 1 + total) % total;
        if (!isCurrent && !isNext && !isPrev) return null;
        return (
          <img
            key={image}
            src={image}
            alt={isCurrent ? t.hero.photoAlt : ""}
            fetchPriority={isCurrent && currentImageIndex === 0 ? "high" : "low"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isCurrent ? "opacity-100" : "opacity-0"
              }`}
          />
        );
      })}

      {/* Capa de ambiente retro cubano-jamaicano - Tono suave para destacar fotos */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(13,9,6,0.45) 0%, rgba(18,12,7,0.20) 50%, rgba(13,9,6,0.65) 100%)"
        }}
      />

      {/* Contenido principal (Logo + Eslogan) centrado verticalmente en la zona superior/media */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 pt-20 sm:pt-24 pb-4">

        {/* Título principal de la página para buscadores y lectores de pantalla (visualmente ya está el logo) */}
        <h1 className="sr-only">{t.hero.heading}</h1>

        {/* LOGO OFICIAL (Tamaño ajustado y retocado sin bordes blancos) */}
        {/* Ancla sin transformaciones (sirve para medir) > capa que sigue al scroll > animación de entrada */}
        <div
          ref={logoAnchorRef}
          className="w-full max-w-[140px] xs:max-w-[160px] sm:max-w-[190px] md:max-w-[220px] lg:max-w-[250px] shrink-0"
        >
          <motion.div
            style={{ x: logoX, y: logoY, scale: logoScale, opacity: logoOpacity }}
            className="will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <img
                src="/images/logos/logoSkaCubano_vectorizado.svg"
                alt="Ska Cubano"
                className="w-full h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] mx-auto"
              />
            </motion.div>
          </motion.div>
        </div>

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