"use client";

import { useState, useEffect, useRef } from "react";
import BowloramaText from "@/components/BowloramaText";
import BandGalleryGrid from "@/components/gallery/BandGalleryGrid";
import MembersGrid from "@/components/gallery/MembersGrid";
import MemberDetailView from "@/components/gallery/MemberDetailView";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import { useLanguage } from "@/context/LanguageContext";

export default function GallerySection() {
  const { t } = useLanguage();
  const tabsRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [data, setData] = useState({ integrantes: [], fotos: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("banda");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const g = t?.gallery || {
    badge: "★ Archivo y Recuerdos ★",
    title: "GALERÍA DE FOTOS",
    subtitle: "Revive los conciertos legendarios, momentos de camerino y perfiles individuales de la orquesta Ska Cubano.",
    tabBand: "Galería General",
    tabMembers: "Integrantes",
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const json = await res.json();
      if (json.integrantes && json.fotos) {
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const bandPhotos = data.fotos.filter((f) => !f.integranteId);
  const currentMember = data.integrantes.find((m) => m.id === activeTab);

  const lightboxPhotosScope = activeTab === "banda"
    ? bandPhotos
    : activeTab === "integrantes"
    ? data.fotos
    : data.fotos.filter((f) => f.integranteId === activeTab);

  return (
    <section 
      id="gallery" 
      className="relative w-full bg-cuban-gallery-blue text-[#faf6ee] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-yellow-800/30 overflow-hidden"
    >
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: "radial-gradient(#facc15 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Cuban Vintage Header Title Section */}
        <div className="text-center space-y-4 mb-12 relative">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-yellow-400/50 bg-black/75 text-xs font-mono font-bold tracking-[0.25em] text-yellow-400 uppercase shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
            <span>★</span>
            <span>{g.badge}</span>
            <span>★</span>
          </div>

          <h2 className="text-4xl md:text-7xl text-yellow-400 tracking-wide uppercase drop-shadow-[0_6px_16px_rgba(0,0,0,0.95)]">
            <BowloramaText text={g.title} />
          </h2>

          <div className="flex items-center justify-center gap-4 max-w-md mx-auto py-1">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-500 to-yellow-400" />
            <span className="text-yellow-400 text-xs sm:text-sm font-bold tracking-wider">★ SANTIAGO DE CUBA • LONDON ★</span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-amber-500 to-yellow-400" />
          </div>

          <p className="text-sm sm:text-base font-sans text-amber-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {g.subtitle}
          </p>
        </div>

        {/* Dynamic Navigation Tabs / Filters with Arrows */}
        <div className="mb-12 flex items-center gap-3 w-full max-w-7xl mx-auto px-2">
          <button
            onClick={() => scrollTabs("left")}
            className="w-10 h-10 rounded-full bg-black/85 border border-yellow-400/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all font-mono font-bold text-xl shadow-lg shrink-0 cursor-pointer hover:scale-110"
            title="Desplazar a la izquierda"
          >
            ‹
          </button>

          <div 
            ref={tabsRef}
            className="flex-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            <button
              onClick={() => setActiveTab("banda")}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border shadow-lg shrink-0 ${
                activeTab === "banda"
                  ? "bg-yellow-400 text-black border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.5)] scale-105"
                  : "bg-black/70 text-white/80 border-yellow-400/20 hover:border-yellow-400/60 hover:text-yellow-300"
              }`}
            >
              ★ {g.tabBand} ({bandPhotos.length})
            </button>

            <button
              onClick={() => setActiveTab("integrantes")}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border shadow-lg shrink-0 ${
                activeTab === "integrantes"
                  ? "bg-yellow-400 text-black border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.5)] scale-105"
                  : "bg-black/70 text-white/80 border-yellow-400/20 hover:border-yellow-400/60 hover:text-yellow-300"
              }`}
            >
              👥 {g.tabMembers} ({data.integrantes.length})
            </button>

            <div className="w-px h-6 bg-yellow-400/20 mx-1 shrink-0 hidden sm:block" />

            {data.integrantes.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all duration-200 cursor-pointer border shrink-0 ${
                  activeTab === m.id
                    ? "bg-yellow-400 text-black border-yellow-400 font-bold shadow-md scale-105"
                    : "bg-black/60 text-amber-100/80 border-white/10 hover:border-yellow-400/50 hover:text-yellow-300"
                }`}
              >
                {m.nombre}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTabs("right")}
            className="w-10 h-10 rounded-full bg-black/85 border border-yellow-400/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all font-mono font-bold text-xl shadow-lg shrink-0 cursor-pointer hover:scale-110"
            title="Desplazar a la derecha"
          >
            ›
          </button>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-lg" />
            <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest">
              Cargando galería vintage Ska Cubano...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "banda" && (
              <BandGalleryGrid
                photos={bandPhotos}
                onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              />
            )}

            {activeTab === "integrantes" && (
              <MembersGrid
                integrantes={data.integrantes}
                fotos={data.fotos}
                onSelectMember={(memberId) => setActiveTab(memberId)}
              />
            )}

            {currentMember && (
              <MemberDetailView
                member={currentMember}
                photos={data.fotos}
                onBack={() => setActiveTab("integrantes")}
                onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              />
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        photo={selectedPhoto}
        photos={lightboxPhotosScope}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </section>
  );
}
