"use client";

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

export default function Footer() {
  return (
    <footer className="w-full bg-[#080605] py-12 px-6 border-t border-yellow-900/10 text-amber-50/40 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Lado izquierdo: Sello y logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-alfa text-xl text-white tracking-wide uppercase select-none">
            SKA <span className="text-[#d35400] font-alfa">CUBANO</span>
          </span>
          <p className="mt-2 text-xs font-serif italic text-amber-50/30 max-w-xs leading-relaxed">
            The explosive clash of classic Jamaican ska and the traditional rhythms of Cuba, son, mambo and cumbia.
          </p>
        </div>

        {/* Lado central: Enlaces rápidos */}
        <div className="flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-widest">
          <a 
            href="#music" 
            onClick={(e) => handleSmoothScroll(e, "#music")} 
            className="hover:text-yellow-400 transition-colors"
          >
            Music
          </a>
          <a 
            href="#shows" 
            onClick={(e) => handleSmoothScroll(e, "#shows")} 
            className="hover:text-yellow-400 transition-colors"
          >
            Shows
          </a>
          <a 
            href="#history" 
            onClick={(e) => handleSmoothScroll(e, "#history")} 
            className="hover:text-yellow-400 transition-colors"
          >
            History
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleSmoothScroll(e, "#contact")} 
            className="hover:text-yellow-400 transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Lado derecho: Redes e información */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4 text-amber-50/50">
            {/* Facebook */}
            <a 
              href="https://facebook.com/skacubano" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-400 hover:scale-110 transition-all"
              aria-label="Facebook"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a 
              href="https://instagram.com/skacubano" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-400 hover:scale-110 transition-all"
              aria-label="Instagram"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a 
              href="https://x.com/skcubano" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-400 hover:scale-110 transition-all"
              aria-label="X (Twitter)"
            >
              <svg className="w-[16px] h-[16px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.254 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-amber-50/20">
            © 2026 SKA CUBANO. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
