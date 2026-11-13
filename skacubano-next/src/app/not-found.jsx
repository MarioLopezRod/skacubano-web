"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BowloramaText from "@/components/BowloramaText";
import { useLanguage } from "@/context/LanguageContext";

// Página 404 para cualquier URL que no exista (al compilar se genera como out/404.html,
// que es la que sirve Apache gracias a "ErrorDocument 404 /404.html" en public/.htaccess).
export default function NotFound() {
  const { lang, setLang, t } = useLanguage();
  const nf = t.notFound;

  // Quien llega aquí desde fuera (un enlace roto) entra sin idioma elegido, en inglés:
  // si su navegador está en español, se le muestra en español. Puede cambiarlo desde el menú.
  useEffect(() => {
    if (navigator.language?.toLowerCase().startsWith("es")) setLang("es");
    // Solo al entrar en la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Título de la pestaña en el idioma activo (la página es de cliente y no puede exportar `metadata`)
  useEffect(() => {
    const title = `${nf.title} | Ska Cubano`;
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    // Next vuelve a poner el título de layout.js después de hidratar: mientras se esté en la 404, se corrige
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [nf.title]);

  return (
    <main className="min-h-screen bg-cuban-gallery-blue text-[#faf6ee] flex flex-col justify-between relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: "radial-gradient(#facc15 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-0" />

      <Navbar />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-xl w-full text-center space-y-6 bg-black/60 backdrop-blur-md border-2 border-yellow-500/40 rounded-3xl px-6 py-10 sm:px-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-yellow-400/50 bg-black/75 text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase">
            {nf.badge}
          </div>

          <p className="font-alfa text-7xl sm:text-8xl text-[#d35400] leading-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)]" aria-hidden="true">
            404
          </p>

          <h1 className="text-3xl sm:text-5xl text-yellow-400 tracking-wide uppercase drop-shadow-[0_6px_16px_rgba(0,0,0,0.95)]">
            <BowloramaText text={nf.title} />
          </h1>

          <div className="w-20 h-1 bg-[#d35400] mx-auto shadow-md rounded-full" />

          <p className="text-sm sm:text-base font-serif italic text-amber-100/90 leading-relaxed">{nf.text}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={lang === "es" ? "/es" : "/"}
              className="px-7 py-3 rounded-full bg-yellow-400 text-black font-mono font-bold text-xs uppercase tracking-widest border-2 border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.4)] hover:bg-yellow-300 hover:scale-105 transition-all"
            >
              ← {nf.homeBtn}
            </Link>
            <Link
              href="/galeria"
              className="px-7 py-3 rounded-full bg-black/70 text-yellow-400 font-mono font-bold text-xs uppercase tracking-widest border border-yellow-400/50 hover:bg-yellow-400 hover:text-black transition-all"
            >
              {nf.galleryBtn}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
