"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PrivateDossierPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [linkData, setLinkData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/private-links/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, clave: password }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAuthenticated(true);
        setLinkData(json.link);
      } else {
        setErrorMsg(json.error || "Clave de acceso incorrecta");
      }
    } catch (err) {
      setErrorMsg("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // ── PANTALLA DE BLOQUEO DE CLAVE ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-yellow-400 selection:text-black">
        <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-yellow-400 p-2 mx-auto flex items-center justify-center shadow-lg">
            <img src="/images/logos/logoSkaCubano.png" alt="Ska Cubano" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-3xl">🔒</span>
            <h1 className="text-xl font-extrabold text-yellow-400 uppercase tracking-wide">
              Acceso Privado a Stage Setup
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Este enlace contiene los mapas de escenario, rider técnico y fotografías de Ska Cubano. Introduce la clave proporcionada por la orquesta.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-extrabold text-yellow-400 uppercase mb-1.5">
                Clave de Acceso *:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduce la contraseña..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-extrabold text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-xl cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verificando..." : "🔓 Acceder al Dossier Técnico"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 font-bold">
              © Ska Cubano • Portal Privado de Producción y Escenario
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ── PANTALLA DEL DOSSIER TÉCNICO Y ESCENARIO DESBLOQUEADO ──
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* BARRA SUPERIOR DE CABECERA */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b-2 border-slate-700 px-4 sm:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-yellow-400 p-1 flex items-center justify-center">
              <img src="/images/logos/logoSkaCubano.png" alt="Ska Cubano" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-yellow-400 uppercase tracking-wide">
                {linkData.titulo}
              </h1>
              <p className="text-xs font-bold text-slate-300">
                🔒 Portal Privado para Promotores y Técnicos de Escenario
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-yellow-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
              📷 {linkData.fotos?.length || 0} Archivos Disponibles
            </span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL DEL DOSSIER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* MÓDULO DE NOTAS TÉCNICAS */}
        {linkData.notasTecnicas && (
          <div className="bg-slate-900 border-2 border-yellow-500/50 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
              <span>📋 Notas e Instrucciones Técnicas de Escenario:</span>
            </h2>
            <div className="text-sm font-medium text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {linkData.notasTecnicas}
            </div>
          </div>
        )}

        {/* GRILLA DE FOTOGRAFÍAS Y DIAGRAMAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-yellow-400">
              📷 Galería de Mapas de Escenario, Rider y Fotos ({linkData.fotos?.length || 0})
            </h2>
            <span className="text-xs font-bold text-slate-300">
              Haz clic en cualquier imagen para verla en pantalla completa o descargarla
            </span>
          </div>

          {!linkData.fotos || linkData.fotos.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700">
              <p className="text-amber-300 font-extrabold text-sm uppercase">
                No hay fotografías ni documentos PDF adjuntos en este enlace.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {linkData.fotos.map((file) => {
                const isPdf = file.esPdf || file.tipo === "pdf" || file.url?.toLowerCase().endsWith(".pdf");

                if (isPdf) {
                  return (
                    <div
                      key={file.id}
                      className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 group hover:border-yellow-400 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-14 bg-red-950/80 border border-red-500/80 rounded-xl flex items-center justify-center text-red-300 text-2xl shrink-0 shadow">
                          📄
                        </div>
                        <div className="overflow-hidden space-y-1">
                          <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider block">
                            Documento PDF
                          </span>
                          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                            {file.nombre || "Rider Técnico.pdf"}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 font-extrabold text-xs uppercase text-center transition-colors shadow"
                        >
                          👁️ Abrir
                        </a>
                        <a
                          href={file.url}
                          download
                          className="px-3.5 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold text-xs uppercase transition-colors shadow"
                        >
                          Descargar
                        </a>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={file.id}
                    className="bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-yellow-400 transition-colors"
                  >
                    <div
                      onClick={() => setActivePhoto(file)}
                      className="relative aspect-[4/3] w-full bg-black cursor-pointer overflow-hidden"
                    >
                      <img
                        src={file.url}
                        alt={file.nombre || "Fotografía de Escenario"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-extrabold uppercase">
                          🔍 Ampliar
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {file.nombre || "Foto de Escenario"}
                      </span>
                      <a
                        href={file.url}
                        download
                        className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold text-xs uppercase transition-colors shrink-0 shadow"
                      >
                        Descargar
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* MODAL VISOR LIGHTBOX ULTRA LIMPIO Y AMPLIO */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 cursor-pointer"
        >
          {/* Flotante superior con controles */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 shadow-2xl max-w-6xl mx-auto"
          >
            <span className="text-sm font-extrabold text-yellow-400 truncate">
              {activePhoto.nombre || "Fotografía de Escenario"}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={activePhoto.url}
                download
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase shadow hover:bg-yellow-300 transition-colors"
              >
                Descargar
              </a>
              <button
                onClick={() => setActivePhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-base flex items-center justify-center cursor-pointer transition-colors"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Imagen ampliada gigante sin marquito */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full flex items-center justify-center p-2 pt-16"
          >
            <img
              src={activePhoto.url}
              alt="Diagrama Ampliado"
              className="max-w-[96vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
