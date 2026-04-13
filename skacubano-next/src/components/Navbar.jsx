"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinksLeft = [
  { label: "Music", href: "/#music" },
    { label: "Shows", href: "/#shows" },

];

const navLinksRight = [
  { label: "History", href: "/#history" },
  { label: "Contact", href: "/#contact" },
];

const allNavLinks = [...navLinksLeft, ...navLinksRight];

// Función compartida para manejar el scroll suave
const handleSmoothScroll = (e, href, callback = null) => {
  // 1. Caso especial: Volver arriba del todo si se pulsa el logo ("/")
  if (href === "/") {
    e.preventDefault(); // Evita que la página recargue de golpe
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Limpiamos la URL para que quede bonita
    window.history.pushState(null, "", "/");
  } 
  // 2. Caso normal: Scroll a una sección específica (ej. /#music)
  else if (href.includes("#")) {
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);

    if (elem) {
      e.preventDefault(); 
      
      const offset = 80; // Altura de tu Navbar
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", href);
    }
  }

  // Ejecutamos el callback opcional (ej. para cerrar el menú móvil)
  if (callback) {
    callback();
  }

};

function InstrumentDeco() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.06]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="orquesta" x="0" y="0" width="300" height="76" patternUnits="userSpaceOnUse">
            <g transform="translate(15, 50) rotate(-15) scale(0.65)" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12 H24 L32 4 V20 L24 12" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="16" y1="6" x2="16" y2="12" />
              <line x1="20" y1="6" x2="20" y2="12" />
            </g>
            {/* ... resto del patrón SVG se mantiene igual ... */}
            <g transform="translate(85, 15) rotate(12) scale(0.55)" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="20" cy="10" rx="14" ry="5" />
              <path d="M6 10 C6 30 12 36 12 44 H28 C28 36 34 30 34 10" />
            </g>
            <text x="285" y="65" fontSize="18" fill="#16a34a" fontFamily="system-ui" transform="rotate(-15 285 65)">★</text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#orquesta)" />
      </svg>
    </div>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      onClick={(e) => handleSmoothScroll(e, href)}
      className="relative block px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[.06em] text-white/70 hover:text-yellow-400 hover:bg-yellow-400/5 rounded-md transition-all duration-150 group drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
    >
      {label}
      <span className="absolute bottom-1 left-3.5 right-3.5 h-[1.5px] rounded-full bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
     

      <nav
        className={`relative  transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/95 backdrop-blur-md border-b border-yellow-400/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-black/30 backdrop-blur-sm border-b border-white/5"
        }`}
      >
        <div className={`transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-30"}`}>
          <InstrumentDeco />
        </div>

        {/* ── DESKTOP ── */}
        <div className="relative z-10 hidden lg:flex items-center max-w-7xl mx-auto px-6 h-[72px]">
          
          {/* LADO IZQUIERDO: Links pegados al logo */}
          <div className="flex-1 flex justify-end">
            <ul className="flex items-center gap-1 list-none">
              {navLinksLeft.map((link) => (
                <li key={link.href}><NavLink {...link} /></li>
              ))}
            </ul>
          </div>

          {/* CENTRO: Logo grande */}
          <div className="flex-shrink-0 mx-8 relative z-20">
            <Link 
              href="/" 
              onClick={(e) => handleSmoothScroll(e, "/")} 
              className="hover:scale-105 transition-transform duration-300 block translate-y-[30px]"
            >
              <Image
                src="/skaCubano.png"
                alt="Ska Cubano Logo"
                width={350}
                height={150}
                priority
                className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
              />
            </Link>
          </div>

          {/* LADO DERECHO: Links cerca del logo + Socials al fondo */}
          <div className="flex-1 flex items-center justify-between">
            {/* Links de la derecha (pegados al logo) */}
            <ul className="flex items-center gap-1 list-none">
              {navLinksRight.map((link) => (
                <li key={link.href}><NavLink {...link} /></li>
              ))}
            </ul>

            {/* Redes sociales (empujadas al extremo derecho por el justify-between) */}
            <div className="flex items-center gap-3">
              <div className="w-px h-5 bg-yellow-400/20 mr-1" />
              <a href="https://facebook.com/skacubano" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-yellow-400/25 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-400/10 transition-all duration-150">
                <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com/skacubano" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-yellow-400/25 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-400/10 transition-all duration-150">
                <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://x.com/skcubano" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-yellow-400/25 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-400/10 transition-all duration-150">
                <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.254 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

           {/* ── MOBILE ── */}
        <div className="relative z-10 lg:hidden flex items-center justify-between max-w-7xl mx-auto px-6 h-[76px]">
          <Link 
            href="/" 
            onClick={(e) => handleSmoothScroll(e, "/")}
            // AÑADIDO: translate-y-[20px] para que sobresalga hacia abajo
            className="absolute left-1/2 -translate-x-1/2 hover:scale-105 transition-transform duration-300 translate-y-[20px]"
          >
            <Image 
              src="/skaCubano.png" 
              alt="Ska Cubano Logo" 
              width={350} 
              height={150} 
              // AÑADIDO: drop-shadow para que tenga profundidad sobre el resto de la web
              className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]" 
            />
          </Link>
          <div className="ml-auto">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-[5px] p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-[2px] rounded-full bg-yellow-400 transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-4"}`} />
              <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>

         
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="border-t border-yellow-400/10 bg-transparent">
                {allNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href, () => setMenuOpen(false))}
                    className="flex items-center justify-between px-6 py-4 text-[13px] font-semibold uppercase tracking-[.08em] text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] hover:text-yellow-400 hover:bg-white/5 border-b border-white/[.04] transition-colors"
                  >
                    {link.label}
                    <svg className="w-3.5 h-3.5 opacity-70 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
      </nav>
    </header>
  );
}