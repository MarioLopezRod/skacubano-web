"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { compressImage } from "@/components/gallery/ImageCompressor";

export default function AdminGalleryPage() {
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [data, setData] = useState({ integrantes: [], fotos: [] });
  const [activeAdminTab, setActiveAdminTab] = useState("fotos"); // "fotos" or "integrantes"
  const [filterMember, setFilterMember] = useState("todos"); // "todos", "banda", or member.id

  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadDescripcion, setUploadDescripcion] = useState("");
  const [uploadFecha, setUploadFecha] = useState("");
  const [uploadIntegranteId, setUploadIntegranteId] = useState("banda");
  const [uploadEsPrincipal, setUploadEsPrincipal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Edit Photo Modal State
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [editIntegranteId, setEditIntegranteId] = useState("banda");
  const [editEsPrincipal, setEditEsPrincipal] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Edit Member Bio Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberNombre, setEditMemberNombre] = useState("");
  const [editMemberRol, setEditMemberRol] = useState("");
  const [editMemberBio, setEditMemberBio] = useState("");
  const [savingMember, setSavingMember] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch("/api/admin/check");
      const json = await res.json();
      if (json.authenticated) {
        setAuthenticated(true);
        fetchData();
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      if (json.integrantes && json.fotos) {
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Upload handler with client compression
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus("Optimizando imagen...");
      const compressed = await compressImage(file);
      setUploadFile(compressed);
      setUploadPreview(URL.createObjectURL(compressed));
      setUploadStatus("");
    } catch (err) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
      setUploadStatus("");
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadStatus("Subiendo fotografía...");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("descripcion", uploadDescripcion);
      formData.append("fecha", uploadFecha);
      formData.append("integranteId", uploadIntegranteId);
      formData.append("esPrincipal", uploadEsPrincipal ? "true" : "false");

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        setUploadFile(null);
        setUploadPreview("");
        setUploadDescripcion("");
        setUploadFecha("");
        setUploadEsPrincipal(false);
        setUploadStatus("✓ Fotografía subida exitosamente");
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("❌ Error al subir imagen");
      }
    } catch (err) {
      setUploadStatus("❌ Error de red al subir");
    } finally {
      setUploading(false);
    }
  };

  // Reorder photos handler
  const handleMovePhoto = async (photoId, direction) => {
    const currentList = getFilteredPhotos();
    const index = currentList.findIndex((p) => p.id === photoId);
    if (index === -1) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    // Swap orden values
    const itemA = currentList[index];
    const itemB = currentList[targetIndex];

    const updatedItems = [
      { id: itemA.id, orden: itemB.orden || targetIndex + 1 },
      { id: itemB.id, orden: itemA.orden || index + 1 },
    ];

    // Optimistic UI update
    const newFotos = data.fotos.map((p) => {
      if (p.id === itemA.id) return { ...p, orden: itemB.orden || targetIndex + 1 };
      if (p.id === itemB.id) return { ...p, orden: itemA.orden || index + 1 };
      return p;
    });

    setData((prev) => ({ ...prev, fotos: newFotos }));

    try {
      await fetch("/api/gallery/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (err) {
      console.error("Reorder failed:", err);
      fetchData();
    }
  };

  // Open Edit Photo Modal
  const openEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditDescripcion(photo.descripcion || "");
    setEditFecha(photo.fecha || "");
    setEditIntegranteId(photo.integranteId || "banda");
    setEditEsPrincipal(!!photo.esPrincipal);
  };

  const handleSaveEditPhoto = async (e) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/gallery/photo/${editingPhoto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: editDescripcion,
          fecha: editFecha,
          integranteId: editIntegranteId,
          esPrincipal: editEsPrincipal,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setData(json.data);
        setEditingPhoto(null);
      }
    } catch (err) {
      alert("Error al actualizar la foto");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Photo handler
  const handleDeletePhoto = async (photoId) => {
    if (!confirm("¿Estás seguro de eliminar esta fotografía de la galería?")) return;

    try {
      const res = await fetch(`/api/gallery/photo/${photoId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setData(json.data);
      }
    } catch (err) {
      alert("Error al eliminar la foto");
    }
  };

  // Open Edit Member Bio Modal
  const openEditMember = (member) => {
    setEditingMember(member);
    setEditMemberNombre(member.nombre || "");
    setEditMemberRol(member.rol || "");
    setEditMemberBio(member.bio || "");
  };

  const handleSaveEditMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setSavingMember(true);

    try {
      const res = await fetch(`/api/gallery/member/${editingMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editMemberNombre,
          rol: editMemberRol,
          bio: editMemberBio,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setData(json.data);
        setEditingMember(null);
      }
    } catch (err) {
      alert("Error al guardar la información del integrante");
    } finally {
      setSavingMember(false);
    }
  };

  // Filter photos based on selector
  const getFilteredPhotos = () => {
    let list = data.fotos;
    if (filterMember === "banda") {
      list = list.filter((f) => !f.integranteId);
    } else if (filterMember !== "todos") {
      list = list.filter((f) => f.integranteId === filterMember);
    }
    return [...list].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0d0a07] text-[#faf6ee] flex items-center justify-center">
        <p className="text-yellow-400 font-mono text-sm">Verificando sesión de administrador...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  const filteredPhotos = getFilteredPhotos();

  return (
    <main className="min-h-screen bg-cuban-gallery-blue text-[#faf6ee] pb-24 relative overflow-hidden">
      {/* Admin Header Navbar */}
      <header className="sticky top-0 z-40 bg-[#14100c] border-b border-yellow-400/30 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/galeria" className="hover:opacity-80 transition-opacity">
            <Image src="/skaCubano.png" alt="Ska Cubano Logo" width={160} height={60} className="object-contain" />
          </Link>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 font-mono font-bold text-xs border border-yellow-400/40">
            ★ PANEL DE ADMINISTRACIÓN ★
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/galeria"
            className="px-3.5 py-1.5 rounded-lg border border-white/20 text-xs font-mono font-bold hover:bg-white/10 transition-colors"
          >
            👁 Ver Web Pública
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/40 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Cerrar Sesión ➔
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Navigation Admin Subtabs */}
        <div className="flex border-b border-yellow-400/20 gap-4">
          <button
            onClick={() => setActiveAdminTab("fotos")}
            className={`pb-3 text-sm font-mono font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeAdminTab === "fotos"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            📸 Subir y Gestionar Fotos ({data.fotos.length})
          </button>
          <button
            onClick={() => setActiveAdminTab("integrantes")}
            className={`pb-3 text-sm font-mono font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeAdminTab === "integrantes"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            👥 Editar Bios de Integrantes (10)
          </button>
        </div>

        {/* SECTION 1: FOTOS MANAGEMENT */}
        {activeAdminTab === "fotos" && (
          <div className="space-y-10">
            {/* Upload New Photo Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14100c] border border-yellow-400/30 shadow-2xl space-y-6">
              <h2 className="font-bowlorama text-2xl text-yellow-400 uppercase tracking-wide flex items-center gap-2">
                <span>➕ SUBIR NUEVA FOTOGRAFIA</span>
              </h2>

              {uploadStatus && (
                <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-mono">
                  {uploadStatus}
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* File Dropzone */}
                <div className="lg:col-span-5 space-y-3">
                  <label className="block text-xs font-mono font-bold text-yellow-400 uppercase">
                    Seleccionar Imagen (JPG, PNG, WebP):
                  </label>
                  <div className="relative border-2 border-dashed border-yellow-400/40 rounded-2xl p-4 text-center bg-black/40 hover:border-yellow-400 transition-colors flex flex-col items-center justify-center min-h-[180px]">
                    {uploadPreview ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden">
                        <Image src={uploadPreview} alt="Preview" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <span className="text-3xl">📁</span>
                        <p className="text-xs font-mono text-amber-100/70">
                          Haz clic o arrastra un archivo aquí
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!uploadFile}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                {/* Photo Form Fields */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-1">
                        Asignar a:
                      </label>
                      <select
                        value={uploadIntegranteId}
                        onChange={(e) => setUploadIntegranteId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-mono focus:outline-none focus:border-yellow-400"
                      >
                        <option value="banda">★ Galería General de la Banda</option>
                        {data.integrantes.map((m) => (
                          <option key={m.id} value={m.id}>
                            👤 {m.nombre} ({m.rol})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-1">
                        Fecha / Evento (Opcional):
                      </label>
                      <input
                        type="text"
                        value={uploadFecha}
                        onChange={(e) => setUploadFecha(e.target.value)}
                        placeholder="Ej. 2010 o WOMAD Festival"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-mono focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-1">
                      Descripción o Pie de foto (Opcional):
                    </label>
                    <textarea
                      rows={2}
                      value={uploadDescripcion}
                      onChange={(e) => setUploadDescripcion(e.target.value)}
                      placeholder="Escribe una breve descripción de la fotografía..."
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-sans focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {uploadIntegranteId !== "banda" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="checkEsPrincipal"
                        checked={uploadEsPrincipal}
                        onChange={(e) => setUploadEsPrincipal(e.target.checked)}
                        className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                      />
                      <label htmlFor="checkEsPrincipal" className="text-xs font-mono text-yellow-300 font-bold cursor-pointer">
                        Establecer como Foto Principal de Perfil del Integrante
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {uploading ? "Subiendo Fotografía..." : "Guardar y Publicar Foto →"}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Photos List & Reorder Controls */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="font-bowlorama text-2xl text-yellow-400 uppercase tracking-wide">
                  🖼 FOTOGRAFIAS EXISTENTES ({filteredPhotos.length})
                </h3>

                {/* Filter selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-200/70">Filtrar por:</span>
                  <select
                    value={filterMember}
                    onChange={(e) => setFilterMember(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#14100c] border border-yellow-400/30 text-yellow-400 font-mono text-xs focus:outline-none"
                  >
                    <option value="todos">Todas las Fotografías ({data.fotos.length})</option>
                    <option value="banda">Galería General Banda</option>
                    {data.integrantes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPhotos.map((photo, index) => {
                  const memberOwner = data.integrantes.find((m) => m.id === photo.integranteId);

                  return (
                    <div
                      key={photo.id}
                      className="group relative flex flex-col justify-between rounded-2xl bg-[#14100c] border border-yellow-400/20 shadow-lg overflow-hidden hover:border-yellow-400/60 transition-all"
                    >
                      <div className="relative aspect-[4/3] w-full bg-black">
                        <Image src={photo.url} alt="Foto" fill className="object-cover" />
                        
                        {/* Member badge overlay */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-yellow-400/30 text-[10px] font-mono text-yellow-300">
                          {memberOwner ? memberOwner.nombre : "Banda"}
                        </div>

                        {photo.esPrincipal && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-yellow-400 text-black text-[9px] font-mono font-bold uppercase shadow">
                            Principal
                          </div>
                        )}
                      </div>

                      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                        <p className="text-xs font-sans text-amber-100/90 line-clamp-2">
                          {photo.descripcion || "Sin descripción"}
                        </p>
                        {photo.fecha && (
                          <p className="text-[10px] font-mono text-yellow-400/70">★ {photo.fecha}</p>
                        )}

                        {/* Reorder Buttons & Action Controls */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
                          {/* Reorder controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMovePhoto(photo.id, -1)}
                              disabled={index === 0}
                              className="w-7 h-7 rounded bg-black/40 hover:bg-yellow-400 hover:text-black border border-white/10 flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                              title="Mover foto arriba / izquierda"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => handleMovePhoto(photo.id, 1)}
                              disabled={index === filteredPhotos.length - 1}
                              className="w-7 h-7 rounded bg-black/40 hover:bg-yellow-400 hover:text-black border border-white/10 flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                              title="Mover foto abajo / derecha"
                            >
                              →
                            </button>
                          </div>

                          {/* Edit / Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditPhoto(photo)}
                              className="px-2 py-1 rounded bg-yellow-400/20 hover:bg-yellow-400 hover:text-black border border-yellow-400/40 text-[11px] font-mono text-yellow-300 font-bold cursor-pointer"
                              title="Editar texto / datos"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-700 text-red-300 hover:text-white border border-red-500/40 text-[11px] font-mono font-bold cursor-pointer"
                              title="Eliminar foto"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: MEMBERS BIOS MANAGEMENT */}
        {activeAdminTab === "integrantes" && (
          <div className="space-y-6">
            <h2 className="font-bowlorama text-2xl text-yellow-400 uppercase tracking-wide">
              👥 BIOGRAFIAS Y DATOS DE LOS 10 INTEGRANTES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.integrantes.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-2xl bg-[#14100c] border border-yellow-400/30 flex gap-4 items-start shadow-xl"
                >
                  <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-yellow-400/40 bg-black shrink-0">
                    <Image
                      src={member.fotoPrincipalUrl || "/images/photos/bio_portrait_natty.jpg"}
                      alt={member.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bowlorama text-xl text-yellow-400 uppercase">{member.nombre}</h3>
                      <button
                        onClick={() => openEditMember(member)}
                        className="px-3 py-1 rounded-lg bg-yellow-400 text-black font-mono font-bold text-xs uppercase cursor-pointer hover:bg-yellow-300 shadow"
                      >
                        ✏️ Editar Bio
                      </button>
                    </div>

                    <p className="text-xs font-mono font-bold text-amber-200/70 uppercase">{member.rol}</p>
                    <p className="text-xs font-sans text-amber-100/80 line-clamp-3 leading-relaxed">
                      {member.bio || "Sin biografía escrita aún."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDIT PHOTO */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#14100c] border border-yellow-400/40 shadow-2xl space-y-4">
            <h3 className="font-bowlorama text-xl text-yellow-400 uppercase">EDITAR FOTOGRAFIA</h3>
            
            <form onSubmit={handleSaveEditPhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-yellow-400 uppercase mb-1">
                  Pie de Foto / Descripción:
                </label>
                <textarea
                  rows={3}
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs focus:outline-none focus:border-yellow-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-yellow-400 uppercase mb-1">
                  Fecha o Evento:
                </label>
                <input
                  type="text"
                  value={editFecha}
                  onChange={(e) => setEditFecha(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-yellow-400 uppercase mb-1">
                  Asignado a:
                </label>
                <select
                  value={editIntegranteId}
                  onChange={(e) => setEditIntegranteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-mono"
                >
                  <option value="banda">★ Galería General de la Banda</option>
                  {data.integrantes.map((m) => (
                    <option key={m.id} value={m.id}>
                      👤 {m.nombre} ({m.rol})
                    </option>
                  ))}
                </select>
              </div>

              {editIntegranteId !== "banda" && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editCheckPrincipal"
                    checked={editEsPrincipal}
                    onChange={(e) => setEditEsPrincipal(e.target.checked)}
                    className="w-4 h-4 accent-yellow-400 cursor-pointer"
                  />
                  <label htmlFor="editCheckPrincipal" className="text-xs font-mono text-yellow-300 font-bold cursor-pointer">
                    Establecer como Foto Principal de Perfil del Integrante
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-mono text-xs cursor-pointer hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-yellow-400 text-black font-mono font-bold text-xs uppercase cursor-pointer hover:bg-yellow-300"
                >
                  {savingEdit ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT MEMBER */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#14100c] border border-yellow-400/40 shadow-2xl space-y-4">
            <h3 className="font-bowlorama text-xl text-yellow-400 uppercase">
              EDITAR INFORMACION: {editingMember.nombre}
            </h3>

            <form onSubmit={handleSaveEditMember} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-yellow-400 uppercase mb-1">
                  Nombre Visible:
                </label>
                <input
                  type="text"
                  value={editMemberNombre}
                  onChange={(e) => setEditMemberNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-yellow-400 uppercase mb-1">
                  Rol / Instrumento:
                </label>
                <input
                  type="text"
                  value={editMemberRol}
                  onChange={(e) => setEditMemberRol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-yellow-400 uppercase mb-1">
                  Biografía Corta:
                </label>
                <textarea
                  rows={5}
                  value={editMemberBio}
                  onChange={(e) => setEditMemberBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-yellow-400/30 text-amber-100 text-xs font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-mono text-xs cursor-pointer hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-5 py-2 rounded-xl bg-yellow-400 text-black font-mono font-bold text-xs uppercase cursor-pointer hover:bg-yellow-300"
                >
                  {savingMember ? "Guardando..." : "Guardar Biografía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
