"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { albums } from "../data/albums";
import BowloramaText from "./BowloramaText";

// Barras de ecualizador animadas para la canción que está sonando
function PlayingBars({ playing }) {
  return (
    <span className="flex items-end justify-center gap-[2px] w-4 h-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] bg-[#d35400] rounded-sm origin-bottom animate-[eq_0.9s_ease-in-out_infinite]"
          style={{ height: "100%", animationDelay: `${i * 0.18}s`, animationPlayState: playing ? "running" : "paused" }}
        />
      ))}
    </span>
  );
}

// Lista de canciones del disco, enmarcada y a dos columnas como en el diseño en pergamino.
// Cada canción con fragmento se puede escuchar aquí mismo.
function Tracklist({ album, current, playing, progress, onToggle, t }) {
  if (album.tracks.length === 0) return null;
  return (
    <div className="pt-5">
    <div className="border border-[#2a1a0a]/30 rounded-sm px-3 pt-3 pb-2 sm:px-4">
      <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2a1a0a] pb-2 mb-1 border-b border-[#2a1a0a]/20">
        {t.albums.tracklist}
      </h4>
      <ol className="sm:columns-2 sm:gap-x-6 font-mono">
        {album.tracks.map((track, i) => {
          const isCurrent = current?.albumId === album.id && current.index === i;
          const canPlay = Boolean(track.previewUrl);
          const label = `${isCurrent && playing ? t.albums.pause : t.albums.play}: ${track.title}`;
          return (
            <li key={`${i}-${track.title}`} className="relative break-inside-avoid">
              <button
                type="button"
                disabled={!canPlay}
                onClick={() => onToggle(album, i)}
                aria-label={label}
                aria-pressed={isCurrent && playing}
                className={`group/track w-full flex items-baseline gap-2 px-1 py-1 text-left text-[11px] leading-snug transition-colors ${
                  canPlay ? "cursor-pointer hover:bg-[#d35400]/10" : "cursor-default opacity-60"
                } ${isCurrent ? "bg-[#d35400]/10" : ""}`}
              >
                <span className="w-5 shrink-0 flex justify-start self-center text-[10px] text-[#2a1a0a]/60 tabular-nums">
                  {isCurrent ? (
                    <PlayingBars playing={playing} />
                  ) : (
                    <>
                      <span className={canPlay ? "group-hover/track:hidden" : ""}>{String(i + 1).padStart(2, "0")}.</span>
                      {canPlay && (
                        <svg className="hidden group-hover/track:block w-3 h-3 text-[#d35400]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </>
                  )}
                </span>
                <span className={`min-w-0 ${isCurrent ? "text-[#d35400] font-bold" : "text-[#2a1a0a]"}`}>{track.title}</span>
                <span className="flex-1" aria-hidden="true" />
                {track.duration && (
                  <span className="shrink-0 text-[10px] text-[#2a1a0a]/60 tabular-nums">{track.duration}</span>
                )}
              </button>
              {/* Progreso del fragmento */}
              {isCurrent && (
                <span className="absolute left-0 -bottom-px h-[2px] bg-[#d35400] transition-[width] duration-200 ease-linear" style={{ width: `${progress * 100}%` }} />
              )}
            </li>
          );
        })}
      </ol>
      {/* Remate con estrella, como en el diseño */}
      <div className="flex items-center gap-3 mt-2 px-6" aria-hidden="true">
        <span className="flex-1 h-px bg-[#7a3000]/40" />
        <span className="text-[#7a3000] text-sm leading-none">★</span>
        <span className="flex-1 h-px bg-[#7a3000]/40" />
      </div>
    </div>
    </div>
  );
}

// Botones para escuchar el disco completo en cada plataforma (sustituyen al botón "Escuchar" del diseño)
function ListenLinks({ album, t }) {
  const links = [
    { href: album.links.sp, icon: "/images/icons/spotify.png", name: "Spotify" },
    { href: album.links.ap, icon: "/images/icons/apple_music.svg", name: "Apple Music" },
    { href: album.links.yt, icon: "/images/icons/youtube.png", name: "YouTube" },
  ].filter((l) => l.href);
  return (
    <div className="flex flex-col items-center sm:items-start gap-1.5 font-mono">
      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#2a1a0a]/60">{t.albums.listenOn}</span>
      {/* Enlaces discretos con icono, en la misma tipografía retro que la tracklist */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2a1a0a] hover:text-[#d35400] transition-colors"
          >
            <img src={l.icon} alt="" className="w-4 h-4 object-contain grayscale-[35%] group-hover/link:grayscale-0 transition" />
            <span className="border-b border-dotted border-[#2a1a0a]/40 group-hover/link:border-[#d35400]">{l.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Albums() {
  const { t, lang } = useLanguage();

  // ── Reproductor de fragmentos: un único <audio> para toda la discografía ──
  // Nada se descarga hasta que el visitante pulsa una canción.
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null); // { albumId, index }
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  // Copia de "current" para el evento "ended" del audio (que se registra una sola vez)
  const currentRef = useRef(null);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const startTrack = (album, index) => {
    const audio = audioRef.current;
    const track = album.tracks[index];
    if (!audio || !track?.previewUrl) return;
    audio.src = track.previewUrl;
    setCurrent({ albumId: album.id, index });
    setProgress(0);
    audio.play().catch(() => setPlaying(false));
  };

  const toggleTrack = (album, index) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (current?.albumId === album.id && current.index === index) {
      if (audio.paused) audio.play().catch(() => setPlaying(false));
      else audio.pause();
    } else {
      startTrack(album, index);
    }
  };

  // Pulsar la portada: si el disco ya suena, pausa/continúa; si no, empieza por la primera canción con fragmento
  const toggleAlbum = (album) => {
    if (current?.albumId === album.id) {
      toggleTrack(album, current.index);
      return;
    }
    const first = album.tracks.findIndex((tr) => tr.previewUrl);
    if (first > -1) startTrack(album, first);
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    // Al acabar un fragmento pasa al siguiente del mismo disco
    const onEnded = () => {
      const cur = currentRef.current;
      const album = albums.find((a) => a.id === cur?.albumId);
      const next = album?.tracks.findIndex((tr, i) => i > cur.index && tr.previewUrl);
      if (album && next > -1) startTrack(album, next);
      else {
        setPlaying(false);
        setCurrent(null);
      }
    };
    const onError = () => {
      setPlaying(false);
      setCurrent(null);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  return (
    <section
      id="music"
      className="min-h-screen w-full bg-parchment flex flex-col items-center justify-center overflow-hidden px-4 py-20 relative border-t border-amber-900/20"
    >

      <div className="text-center mb-16 relative z-10">
        <span className="text-[#d35400] text-xs font-mono tracking-[0.4em] uppercase block mb-3 font-bold drop-shadow">
          {t.albums.badge}
        </span>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-[#2a1a0a] tracking-wide text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)] pb-4">
          <BowloramaText text={t.albums.title} />
        </h2>
        <div className="w-24 h-1.5 bg-[#d35400] mx-auto mt-6 rounded-full shadow-md" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-10 relative z-10">
        {albums.map((album) => {
          const isThisAlbum = current?.albumId === album.id;
          const description = album.description?.[lang] || album.description?.es;

          return (
            <article
              key={album.id}
              className="flex flex-col border border-[#2a1a0a]/25 rounded-sm p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-2">
                {/* PORTADA + VINILO. El margen derecho reserva el hueco donde se queda el vinilo al salir */}
                <button
                  type="button"
                  onClick={() => toggleAlbum(album)}
                  aria-label={`${isThisAlbum && playing ? t.albums.pause : t.albums.playAlbum} ${album.title}`}
                  // En móvil la portada va centrada; al salir el vinilo, el conjunto se desplaza media salida a la izquierda para seguir centrado.
                  // Desde sm el margen derecho reserva el hueco donde se queda el vinilo.
                  className={`group relative shrink-0 w-40 h-40 sm:w-36 sm:h-36 md:w-40 md:h-40 sm:mr-14 cursor-pointer transition-transform duration-700 ${
                    isThisAlbum ? "-translate-x-7 sm:translate-x-0" : ""
                  }`}
                >
                  {/* VINILO: sale de la funda al pasar el ratón y se queda fuera girando mientras suena el disco */}
                  <div
                    className={`absolute inset-0 rounded-full shadow-xl transition-transform duration-700 group-hover:translate-x-14 z-10 ${
                      isThisAlbum ? "translate-x-14" : ""
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center animate-[spin_2.4s_linear_infinite]"
                      style={{
                        animationPlayState: isThisAlbum && playing ? "running" : "paused",
                        background: "repeating-radial-gradient(circle at center, #1a1a1a 0 2px, #222 2px 4px)",
                      }}
                    >
                      {/* Etiqueta central con la portada */}
                      <div className="relative w-14 h-14 rounded-full border-[3px] border-[#d35400] overflow-hidden bg-[#d35400]">
                        <img src={album.cover} alt="" className="w-full h-full object-cover" />
                        <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#1a1a1a]" />
                      </div>
                    </div>
                  </div>

                  {/* PORTADA */}
                  <div className="relative z-20 w-full h-full shadow-lg bg-slate-800">
                    <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                    {/* Icono de play/pausa al pasar el ratón */}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors">
                      <span className="w-12 h-12 rounded-full bg-[#d35400] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          {isThisAlbum && playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                        </svg>
                      </span>
                    </span>
                  </div>
                </button>

                {/* TEXTO: tipo, título, año, descripción y enlaces */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5 text-center sm:text-left">
                  <h3 className="font-alfa text-2xl md:text-[1.7rem] uppercase text-[#2a1a0a] leading-tight">{album.title}</h3>
                  <span className="font-alfa text-sm text-[#d35400]">{album.year}</span>
                  <span className="font-mono text-[11px] text-[#2a1a0a]/75">
                    {t.albums.types[album.type] || t.albums.types.studio}
                    {album.tracks.length > 0 && ` · ${album.tracks.length} ${t.albums.songs}`}
                  </span>
                  {description && <p className="mt-1.5 font-mono text-[11px] sm:text-xs text-[#2a1a0a]/80 leading-relaxed">{description}</p>}
                  <div className="mt-2">
                    <ListenLinks album={album} t={t} />
                  </div>
                </div>
              </div>

              <Tracklist album={album} current={current} playing={playing} progress={progress} onToggle={toggleTrack} t={t} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
