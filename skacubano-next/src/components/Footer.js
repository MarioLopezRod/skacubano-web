"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080605] py-4 px-6 border-t border-amber-900/20 text-amber-50/50 relative z-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2 text-center">

        {/* Logo compacto centrado */}
        <div className="flex items-center justify-center">
          <img
            src="/images/logos/logoSkaCubano.png"
            alt="Ska Cubano"
            className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Copyright y Créditos totalmente centrados */}
        <p className="text-[11px] sm:text-xs font-mono tracking-wider text-amber-50/50 leading-tight text-center">
          © 2026 Skacubano · Designed & Developed by{" "}
          <a
            href="https://www.linkedin.com/in/mario-l%C3%B3pez-rodr%C3%ADguez-863349306/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-200/90 hover:text-yellow-400 underline decoration-yellow-500/40 underline-offset-4 transition-colors font-medium"
          >
            Mario López
          </a>
          {" "}& <a
            href="https://www.linkedin.com/in/alejandro-pozuelo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-200/90 hover:text-yellow-400 underline decoration-yellow-500/40 underline-offset-4 transition-colors font-medium"
          >
            Alejandro Pozuelo
          </a>
        </p>

      </div>
    </footer>
  );
}
