"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const handleSmoothScroll = (e, href, callback = null) => {
  if (href === "/") {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    window.history.pushState(null, "", "/");
  } else if (href.includes("#")) {
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);

    if (elem) {
      e.preventDefault();
      const offset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", href);
    }
  }

  if (callback) {
    callback();
  }
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      // Reveal header logo once scrolled past the main Hero section
      setScrolled(window.scrollY > 220);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.music, href: "#music" },
    { label: t.nav.shows, href: "#shows" },
    { label: t.nav.gallery, href: "#gallery" },
    { label: t.nav.history, href: "#history" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b border-yellow-500/15 bg-[#0d0906]/92 backdrop-blur-md px-4 sm:px-8 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* LADO IZQUIERDO: Logo dentro de un círculo retro elegante que destaca sobre el fondo */}
        <div className="flex items-center min-w-[120px] sm:min-w-[160px]">
          <Link
            href="/"
            onClick={(e) => handleSmoothScroll(e, "/")}
            title="Volver al Inicio"
            aria-label="Volver al Inicio"
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#18110b] border-2 border-yellow-500/40 hover:border-yellow-400 hover:bg-[#d35400] transition-all duration-300 flex items-center justify-center p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.8)] group cursor-pointer ${
              scrolled
                ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-x-4 scale-90 pointer-events-none"
            }`}
          >
            <img
              src="/images/logos/logoSkaCubano.png"
              alt="Ska Cubano Logo"
              className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* CENTRO: Menú de navegación tradicional centrado */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="relative py-1 text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em] text-amber-100/90 hover:text-yellow-400 transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d35400] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
            </Link>
          ))}
        </nav>

        {/* LADO DERECHO: Selector de Idioma & Redes Sociales */}
        <div className="hidden md:flex items-center gap-4 min-w-[120px] sm:min-w-[160px] justify-end">
          {/* Botón de Idioma */}
          <button
            onClick={toggleLanguage}
            title={lang === "en" ? "Cambiar a Español" : "Switch to English"}
            className="flex items-center gap-2 px-3 py-1 rounded-sm border border-yellow-500/40 bg-[#1a120b] hover:bg-[#d35400] hover:text-black text-amber-200 transition-all duration-200 text-xs font-mono font-bold uppercase tracking-wider shadow-md cursor-pointer hover:scale-105"
          >
            <span className={`fi ${lang === "en" ? "fi-gb" : "fi-es"} rounded-xs shadow-sm`}></span>
            <span>{lang === "en" ? "EN" : "ES"}</span>
          </button>

          <div className="w-px h-4 bg-yellow-500/20" />

          {/* Redes Sociales */}
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com/skacubano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-yellow-500/30 flex items-center justify-center text-amber-200/80 hover:text-yellow-400 hover:border-yellow-400 hover:bg-[#d35400]/20 transition-all duration-200 shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/skacubano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-yellow-500/30 flex items-center justify-center text-amber-200/80 hover:text-yellow-400 hover:border-yellow-400 hover:bg-[#d35400]/20 transition-all duration-200 shadow-sm"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://x.com/skcubano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-yellow-500/30 flex items-center justify-center text-amber-200/80 hover:text-yellow-400 hover:border-yellow-400 hover:bg-[#d35400]/20 transition-all duration-200 shadow-sm"
              aria-label="X (Twitter)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.254 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* CONTROLES MOBILE */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Logo mobile circular animado */}
          <Link
            href="/"
            onClick={(e) => handleSmoothScroll(e, "/")}
            title="Volver al Inicio"
            className={`w-10 h-10 rounded-full bg-[#18110b] border-2 border-yellow-500/40 p-1 flex items-center justify-center transition-all duration-500 ease-out transform ${
              scrolled
                ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-x-4 scale-90 pointer-events-none"
            }`}
          >
            <img
              src="/images/logos/logoSkaCubano.png"
              alt="Ska Cubano Logo"
              className="w-full h-full object-contain"
            />
          </Link>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-yellow-500/40 bg-[#1a120b] text-xs font-mono font-bold text-yellow-400"
            >
              <span className={`fi ${lang === "en" ? "fi-gb" : "fi-es"} rounded-xs shadow-sm`}></span>
              <span>{lang === "en" ? "EN" : "ES"}</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-yellow-400 hover:bg-yellow-500/10 rounded-sm focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-yellow-900/30 bg-[#0d0906]/98 backdrop-blur-md px-6 py-6 shadow-2xl mt-3">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href, () => setMenuOpen(false))}
                className="px-4 py-2.5 text-sm font-mono font-bold uppercase tracking-wider text-amber-100 hover:text-yellow-400 hover:bg-[#d35400]/20 rounded-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
