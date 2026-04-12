"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Music", href: "/#music" },
  { label: "History", href: "/#history" },
  { label: "Contact", href: "/#contact" },
];

function StripeBar() {
  return (
    <div
      className="h-[3px] w-full"
      style={{
        background:
         
          "repeating-linear-gradient(90deg,#ffffff 0,#ffffff 18px,transparent 18px,transparent 24px,#333333 24px,#333333 42px,transparent 42px,transparent 48px)"
      }}
    />
  );
}

function InstrumentDeco() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.08]">
      <svg width="100%" height="100%">
        <defs>
          {/* Aumentamos un poco el ancho del patrón para que los instrumentos descolocados tengan espacio */}
          <pattern id="orquesta" x="0" y="0" width="300" height="76" patternUnits="userSpaceOnUse">
            
            {/* Trompeta: Inclinada hacia arriba y posicionada más abajo */}
            <g transform="translate(15, 50) rotate(-15) scale(0.65)" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12 H24 L32 4 V20 L24 12" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="16" y1="6" x2="16" y2="12" />
              <line x1="20" y1="6" x2="20" y2="12" />
            </g>
            
            {/* Conga: Inclinada a la derecha y posicionada más arriba */}
            <g transform="translate(85, 15) rotate(12) scale(0.55)" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="20" cy="10" rx="14" ry="5" />
              <path d="M6 10 C6 30 12 36 12 44 H28 C28 36 34 30 34 10" />
              <line x1="14" y1="15" x2="20" y2="44" />
              <line x1="26" y1="15" x2="20" y2="44" />
            </g>

            {/* Saxofón: Inclinado hacia abajo y centrado */}
            <g transform="translate(155, 45) rotate(22) scale(0.6)" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 28 C16 36 28 36 32 28 L22 18 C16 12 16 12 12 28 Z" />
              <path d="M12 28 C10 42 16 52 28 50 C40 48 42 42 40 10 Q40 4 34 4 H28" />
              <path d="M28 4 C26 2 20 2 18 4" />
              <circle cx="40" cy="18" r="2.5" fill="none" stroke="#facc15"/>
              <circle cx="40" cy="28" r="2.5" fill="none" stroke="#facc15"/>
              <circle cx="40" cy="38" r="2.5" fill="none" stroke="#facc15"/>
            </g>
            
            {/* Piano: Ligeramente torcido y arriba */}
            <g transform="translate(225, 20) rotate(-8) scale(0.45)" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="0" y="0" width="110" height="30" rx="3" />
              <line x1="11" y1="12" x2="11" y2="30" />
              <line x1="22" y1="12" x2="22" y2="30" />
              <line x1="33" y1="12" x2="33" y2="30" />
              <line x1="44" y1="12" x2="44" y2="30" />
              <line x1="55" y1="12" x2="55" y2="30" />
              <line x1="66" y1="12" x2="66" y2="30" />
              <line x1="77" y1="12" x2="77" y2="30" />
              <line x1="88" y1="12" x2="88" y2="30" />
              <line x1="99" y1="12" x2="99" y2="30" />
              <rect x="8.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
              <rect x="19.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
              <rect x="41.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
              <rect x="52.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
              <rect x="63.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
              <rect x="85.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
              <rect x="96.5" y="4" width="5" height="18" rx="1" fill="#facc15" stroke="none" />
            </g>

            {/* Estrella decorativa descolocada */}
            <text x="285" y="65" fontSize="18" fill="#16a34a" fontFamily="system-ui" transform="rotate(-15 285 65)">★</text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#orquesta)" />
      </svg>
    </div>
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
      <StripeBar />

      <nav
        className={`relative overflow-hidden transition-all duration-300 border-b border-yellow-400/10 ${
          scrolled ? "bg-zinc-950/97 backdrop-blur-md" : "bg-[#111]"
        }`}
      >
        <InstrumentDeco />

        <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center justify-between h-[76px]">

          {/* Logo */}
          <Link href="/#home" className="flex items-center gap-3 group shrink-0">
            <div className="flex flex-col items-center justify-center w-[46px] h-[46px] rounded-full border-2 border-yellow-400 leading-none group-hover:bg-yellow-400/10 transition-colors duration-200">
              <span className="text-yellow-400 font-black text-[11px] tracking-widest">SKA</span>
              <span className="text-yellow-400/50 text-[7px] tracking-[.3em] mt-0.5">•BAND•</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-[.08em] uppercase leading-none">
                Cubano
              </span>
              <span className="text-yellow-400/60 text-[9px] tracking-[.35em] uppercase mt-0.5">
                Ska · Reggae · Brass
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-0.5 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative block px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[.06em] text-white/50 hover:text-yellow-400 hover:bg-yellow-400/5 rounded-md transition-all duration-150 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-[1.5px] rounded-full bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Facebook actualizado */}
            <a
              href="https://facebook.com/skacubano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-yellow-400/25 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-400/10 transition-all duration-150"
            >
              <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Instagram actualizado */}
            <a
              href="https://instagram.com/skacubano"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-yellow-400/25 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:border-yellow-400/60 hover:bg-yellow-400/10 transition-all duration-150"
            >
              <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path fill="#111" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <circle cx="17.5" cy="6.5" r="1" fill="#111" />
              </svg>
            </a>
            
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-[2px] rounded-full bg-yellow-400 transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-4"}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[420px]" : "max-h-0"}`}>
          <div className="border-t border-yellow-400/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[.08em] text-white/55 hover:text-yellow-400 hover:bg-yellow-400/5 border-b border-white/[.04] transition-all duration-150"
              >
                {link.label}
                <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
            <div className="p-4">
              <Link
                href="#tickets"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-yellow-400 text-zinc-900 text-[12px] font-extrabold tracking-[.1em] uppercase hover:bg-yellow-300 transition-colors"
              >
                <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 12V22H4V12" />
                  <path d="M22 7H2v5h20V7z" />
                  <path d="M12 22V7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                Tickets
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <StripeBar />
    </header>
  );
}