"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { compressImage } from "@/components/gallery/ImageCompressor";

export default function AdminGalleryPage() {
  const router = useRouter();
  const filterTrackRef = useRef(null);

  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [data, setData] = useState({ integrantes: [], fotos: [], secciones: [] });
  const [privateLinks, setPrivateLinks] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState("fotos"); // "fotos", "integrantes", "secciones", "privado"
  const [filterMember, setFilterMember] = useState("todos");

  // Upload Photo State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadDescripcion, setUploadDescripcion] = useState("");
  const [uploadDescripcionEn, setUploadDescripcionEn] = useState("");
  const [uploadFecha, setUploadFecha] = useState("");
  const [uploadIntegranteId, setUploadIntegranteId] = useState("banda");
  const [uploadEsPrincipal, setUploadEsPrincipal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Edit Photo Modal State
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editDescripcionEn, setEditDescripcionEn] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [editIntegranteId, setEditIntegranteId] = useState("banda");
  const [editEsPrincipal, setEditEsPrincipal] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Member State
  const [editingMember, setEditingMember] = useState(null);
  const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);
  const [memberFormNombre, setMemberFormNombre] = useState("");
  const [memberFormRol, setMemberFormRol] = useState("");
  const [memberFormBio, setMemberFormBio] = useState("");
  const [memberFormFoto, setMemberFormFoto] = useState("");
  const [savingMember, setSavingMember] = useState(false);

  // Section State
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionFormNombre, setSectionFormNombre] = useState("");
  const [savingSection, setSavingSection] = useState(false);

  // Private Link Form State
  const [privateTitulo, setPrivateTitulo] = useState("");
  const [privateClave, setPrivateClave] = useState("");
  const [privateNotas, setPrivateNotas] = useState("");
  const [privateFiles, setPrivateFiles] = useState([]);
  const [creatingPrivateLink, setCreatingPrivateLink] = useState(false);
  const [privateStatus, setPrivateStatus] = useState("");
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [copiedSlug, setCopiedSlug] = useState("");

  // Edit Private Link Modal State
  const [editingPrivateLink, setEditingPrivateLink] = useState(null);
  const [editPrivateTitulo, setEditPrivateTitulo] = useState("");
  const [editPrivateClave, setEditPrivateClave] = useState("");
  const [editPrivateNotas, setEditPrivateNotas] = useState("");
  const [editPrivateExistingFotos, setEditPrivateExistingFotos] = useState([]);
  const [editPrivateNewFiles, setEditPrivateNewFiles] = useState([]);
  const [savingEditPrivateLink, setSavingEditPrivateLink] = useState(false);

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
        fetchPrivateLinks();
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
        if (!json.secciones) {
          json.secciones = [{ id: "banda", nombre: "Galería General de la Banda", slug: "banda" }];
        }
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching gallery data:", err);
    }
  };

  const fetchPrivateLinks = async () => {
    try {
      const res = await fetch("/api/private-links");
      const json = await res.json();
      if (json.links) {
        setPrivateLinks(json.links);
      }
    } catch (err) {
      console.error("Error fetching private links:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const scrollFilterTrack = (direction) => {
    if (filterTrackRef.current) {
      const amount = direction === "left" ? -280 : 280;
      filterTrackRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
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
      formData.append("descripcionEn", uploadDescripcionEn);
      formData.append("fecha", uploadFecha);
      formData.append("integranteId", uploadIntegranteId);
      formData.append("esPrincipal", uploadEsPrincipal ? "true" : "false");

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        fetchData();
        setUploadFile(null);
        setUploadPreview("");
        setUploadDescripcion("");
        setUploadDescripcionEn("");
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

    const itemA = currentList[index];
    const itemB = currentList[targetIndex];

    const updatedItems = [
      { id: itemA.id, orden: itemB.orden || targetIndex + 1 },
      { id: itemB.id, orden: itemA.orden || index + 1 },
    ];

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

  const openEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditDescripcion(photo.descripcion || "");
    setEditDescripcionEn(photo.descripcionEn || "");
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
          descripcionEn: editDescripcionEn,
          fecha: editFecha,
          integranteId: editIntegranteId,
          esPrincipal: editEsPrincipal,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        fetchData();
        setEditingPhoto(null);
      }
    } catch (err) {
      alert("Error al actualizar la foto");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("¿Estás seguro de eliminar esta fotografía de la galería?")) return;

    try {
      const res = await fetch(`/api/gallery/photo/${photoId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.data) {
        fetchData();
      }
    } catch (err) {
      alert("Error al eliminar la foto");
    }
  };

  // Handlers Integrantes
  const openCreateMember = () => {
    setMemberFormNombre("");
    setMemberFormRol("");
    setMemberFormBio("");
    setMemberFormFoto("");
    setShowCreateMemberModal(true);
  };

  const handleCreateMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberFormNombre) return;
    setSavingMember(true);

    try {
      const res = await fetch("/api/gallery/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: memberFormNombre,
          rol: memberFormRol,
          bio: memberFormBio,
          fotoPrincipalUrl: memberFormFoto,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchData();
        setShowCreateMemberModal(false);
      } else {
        alert(json.error || "Error al crear integrante");
      }
    } catch (err) {
      alert("Error al guardar integrante");
    } finally {
      setSavingMember(false);
    }
  };

  const openEditMember = (member) => {
    setEditingMember(member);
    setMemberFormNombre(member.nombre || "");
    setMemberFormRol(member.rol || "");
    setMemberFormBio(member.bio || "");
    setMemberFormFoto(member.fotoPrincipalUrl || "");
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
          nombre: memberFormNombre,
          rol: memberFormRol,
          bio: memberFormBio,
          fotoPrincipalUrl: memberFormFoto,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        fetchData();
        setEditingMember(null);
      }
    } catch (err) {
      alert("Error al actualizar información del integrante");
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async (memberId, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar al integrante "${nombre}"?\nSus fotos asignadas pasarán a la galería general.`)) return;

    try {
      const res = await fetch(`/api/gallery/member/${memberId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.data) {
        fetchData();
      }
    } catch (err) {
      alert("Error al eliminar integrante");
    }
  };

  // Handlers Secciones
  const openCreateSection = () => {
    setSectionFormNombre("");
    setShowCreateSectionModal(true);
  };

  const handleCreateSectionSubmit = async (e) => {
    e.preventDefault();
    if (!sectionFormNombre) return;
    setSavingSection(true);

    try {
      const res = await fetch("/api/gallery/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: sectionFormNombre }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchData();
        setShowCreateSectionModal(false);
      } else {
        alert(json.error || "Error al crear sección");
      }
    } catch (err) {
      alert("Error al crear sección");
    } finally {
      setSavingSection(false);
    }
  };

  const openEditSection = (sec) => {
    setEditingSection(sec);
    setSectionFormNombre(sec.nombre || "");
  };

  const handleSaveEditSection = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    setSavingSection(true);

    try {
      const res = await fetch(`/api/gallery/section/${editingSection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: sectionFormNombre }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        fetchData();
        setEditingSection(null);
      }
    } catch (err) {
      alert("Error al actualizar la sección");
    } finally {
      setSavingSection(false);
    }
  };

  const handleDeleteSection = async (secId, nombre) => {
    if (secId === "banda") {
      alert("No se puede eliminar la sección principal de la banda.");
      return;
    }
    if (!confirm(`¿Estás seguro de eliminar la sección "${nombre}"?`)) return;

    try {
      const res = await fetch(`/api/gallery/section/${secId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.data) {
        fetchData();
      }
    } catch (err) {
      alert("Error al eliminar la sección");
    }
  };

  // ── HANDLERS PARA ENLACES PRIVADOS DE ESCENARIO ──
  const handleCreatePrivateLinkSubmit = async (e) => {
    e.preventDefault();
    if (!privateTitulo || !privateClave) return;

    setCreatingPrivateLink(true);
    setPrivateStatus("Creando enlace privado...");

    try {
      const formData = new FormData();
      formData.append("titulo", privateTitulo);
      formData.append("clave", privateClave);
      formData.append("notasTecnicas", privateNotas);

      for (let i = 0; i < privateFiles.length; i++) {
        formData.append("files", privateFiles[i]);
      }

      const res = await fetch("/api/private-links", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        fetchPrivateLinks();
        setPrivateTitulo("");
        setPrivateClave("");
        setPrivateNotas("");
        setPrivateFiles([]);
        setPrivateStatus("✓ Enlace privado creado exitosamente");
        setTimeout(() => setPrivateStatus(""), 3500);
      } else {
        setPrivateStatus("❌ " + (json.error || "Error al crear enlace"));
      }
    } catch (err) {
      setPrivateStatus("❌ Error de red al crear enlace");
    } finally {
      setCreatingPrivateLink(false);
    }
  };

  const openEditPrivateLink = (link) => {
    setEditingPrivateLink(link);
    setEditPrivateTitulo(link.titulo || "");
    setEditPrivateClave(link.clave || "");
    setEditPrivateNotas(link.notasTecnicas || "");
    setEditPrivateExistingFotos(link.fotos || []);
    setEditPrivateNewFiles([]);
  };

  const handleSaveEditPrivateLink = async (e) => {
    e.preventDefault();
    if (!editingPrivateLink) return;
    setSavingEditPrivateLink(true);

    try {
      const formData = new FormData();
      formData.append("titulo", editPrivateTitulo);
      formData.append("clave", editPrivateClave);
      formData.append("notasTecnicas", editPrivateNotas);
      formData.append("existingFotos", JSON.stringify(editPrivateExistingFotos));

      for (let i = 0; i < editPrivateNewFiles.length; i++) {
        formData.append("files", editPrivateNewFiles[i]);
      }

      const res = await fetch(`/api/private-links/${editingPrivateLink.id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        fetchPrivateLinks();
        setEditingPrivateLink(null);
      } else {
        alert(json.error || "Error al actualizar enlace privado");
      }
    } catch (err) {
      alert("Error de red al actualizar enlace privado");
    } finally {
      setSavingEditPrivateLink(false);
    }
  };

  const handleDeletePrivateLink = async (linkId, titulo) => {
    if (!confirm(`¿Estás seguro de eliminar el enlace privado "${titulo}"?`)) return;

    try {
      const res = await fetch(`/api/private-links/${linkId}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchPrivateLinks();
      }
    } catch (err) {
      alert("Error al eliminar enlace privado");
    }
  };

  const copyToClipboard = (slug) => {
    const url = `${window.location.origin}/privado/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(""), 2500);
  };

  const getFilteredPhotos = () => {
    let list = data.fotos;
    if (filterMember === "banda") {
      list = list.filter((f) => !f.integranteId);
    } else if (filterMember !== "todos") {
      list = list.filter((f) => f.integranteId === filterMember || f.seccionId === filterMember);
    }
    return [...list].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-white font-bold text-base">Comprobando acceso de administración...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  const filteredPhotos = getFilteredPhotos();
  const bandPhotosCount = data.fotos.filter((f) => !f.integranteId).length;
  const seccionesList = data.secciones || [{ id: "banda", nombre: "Galería General de la Banda", slug: "banda" }];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black">

      {/* ── BARRA SUPERIOR DE NAVEGACIÓN ── */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b-2 border-slate-700 px-4 sm:px-8 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-yellow-400 p-1 flex items-center justify-center shadow-lg shrink-0">
              <img src="/images/logos/logoSkaCubano.png" alt="Ska Cubano" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-yellow-400 uppercase tracking-wide">
                PANEL DE CONTROL • SKA CUBANO
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                <span className="bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">📷 {data.fotos.length} Fotografías</span>
                <span className="bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">👥 {data.integrantes.length} Integrantes</span>
                <span className="bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">🔒 {privateLinks.length} Enlaces Privados</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl border border-slate-600 bg-slate-800 hover:bg-yellow-400 hover:text-black text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md"
            >
              🌐 Ver Sitio Web
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-red-500/60 bg-red-950/80 hover:bg-red-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              🚪 Cerrar Sesión
            </button>
          </div>

        </div>
      </header>

      {/* ── CONTENEDOR PRINCIPAL DASHBOARD ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* PESTAÑAS PRINCIPALES DE GESTIÓN */}
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-slate-800 pb-4">
          <button
            onClick={() => setActiveAdminTab("fotos")}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${activeAdminTab === "fotos"
                ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-102"
                : "bg-slate-900 text-slate-200 border-2 border-slate-700 hover:bg-slate-800 hover:text-yellow-400"
              }`}
          >
            <span>📷 Gestión de Fotografías</span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-white border border-slate-700 text-xs font-bold">{data.fotos.length}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("integrantes")}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${activeAdminTab === "integrantes"
                ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-102"
                : "bg-slate-900 text-slate-200 border-2 border-slate-700 hover:bg-slate-800 hover:text-yellow-400"
              }`}
          >
            <span>👥 Integrantes y Músicos</span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-white border border-slate-700 text-xs font-bold">{data.integrantes.length}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("secciones")}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${activeAdminTab === "secciones"
                ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-102"
                : "bg-slate-900 text-slate-200 border-2 border-slate-700 hover:bg-slate-800 hover:text-yellow-400"
              }`}
          >
            <span>📁 Secciones y Categorías</span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-white border border-slate-700 text-xs font-bold">{seccionesList.length}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("privado")}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${activeAdminTab === "privado"
                ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-102"
                : "bg-slate-900 text-slate-200 border-2 border-slate-700 hover:bg-slate-800 hover:text-yellow-400"
              }`}
          >
            <span>🔒 Enlaces Privados (Stage & Press Kit)</span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-white border border-slate-700 text-xs font-bold">{privateLinks.length}</span>
          </button>
        </div>

        {/* ════════════ PESTAÑA 1: GESTIÓN DE FOTOGRAFÍAS ════════════ */}
        {activeAdminTab === "fotos" && (
          <div className="space-y-8">

            {/* FORMULARIO DE SUBIDA DE FOTO */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
                <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
                  <span>➕ Subir Nueva Fotografía</span>
                </h2>
                {uploadStatus && (
                  <span className="text-xs sm:text-sm font-extrabold text-yellow-300 bg-slate-950 border-2 border-yellow-400 px-4 py-1.5 rounded-lg shadow">
                    {uploadStatus}
                  </span>
                )}
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Selector de Archivo */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-2">
                      1. Seleccionar Imagen *:
                    </label>
                    <div className="relative border-2 border-dashed border-slate-600 hover:border-yellow-400 rounded-xl bg-slate-950 p-4 text-center cursor-pointer min-h-[170px] flex flex-col items-center justify-center transition-colors group">
                      {uploadPreview ? (
                        <div className="relative w-full h-36 rounded-lg overflow-hidden border-2 border-yellow-400 shadow">
                          <img src={uploadPreview} alt="Vista previa" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-4xl">📁</span>
                          <p className="text-sm font-bold text-white">
                            Arrastra una imagen o haz clic aquí
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

                  {/* Asignación & Fecha */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                          2. Asignar a Integrante o Sección:
                        </label>
                        <select
                          value={uploadIntegranteId}
                          onChange={(e) => setUploadIntegranteId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                        >
                          <option value="banda">★ Galería General de la Banda</option>
                          <optgroup label="Integrantes de la Banda">
                            {data.integrantes.map((m) => (
                              <option key={m.id} value={m.id}>
                                👤 {m.nombre} ({m.rol})
                              </option>
                            ))}
                          </optgroup>
                          {seccionesList.filter((s) => s.id !== "banda").length > 0 && (
                            <optgroup label="Secciones Personalizadas">
                              {seccionesList.filter((s) => s.id !== "banda").map((s) => (
                                <option key={s.id} value={s.id}>
                                  📁 {s.nombre}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                          3. Fecha o Evento (Opcional):
                        </label>
                        <input
                          type="text"
                          value={uploadFecha}
                          onChange={(e) => setUploadFecha(e.target.value)}
                          placeholder="Ej. 2010 o WOMAD Festival"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Pie de Foto Bilingüe */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                          4. Pie de Foto en Español 🇪🇸:
                        </label>
                        <textarea
                          rows={2}
                          value={uploadDescripcion}
                          onChange={(e) => setUploadDescripcion(e.target.value)}
                          placeholder="Texto descriptivo en español..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                          5. Description in English 🇬🇧:
                        </label>
                        <textarea
                          rows={2}
                          value={uploadDescripcionEn}
                          onChange={(e) => setUploadDescripcionEn(e.target.value)}
                          placeholder="English photo caption..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {uploadIntegranteId !== "banda" && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id="checkEsPrincipal"
                          checked={uploadEsPrincipal}
                          onChange={(e) => setUploadEsPrincipal(e.target.checked)}
                          className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                        />
                        <label htmlFor="checkEsPrincipal" className="text-sm text-yellow-300 font-extrabold cursor-pointer">
                          Establecer como Foto Principal de Perfil del Integrante
                        </label>
                      </div>
                    )}
                  </div>

                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="px-7 py-3.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 disabled:opacity-50 transition-all shadow-xl cursor-pointer"
                  >
                    {uploading ? "Subiendo..." : "➕ Subir Fotografía a la Galería"}
                  </button>
                </div>
              </form>
            </div>

            {/* FILTROS POR CATEGORÍA CON FLECHAS NAVEGABLES ‹ › */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <h3 className="text-base font-extrabold uppercase tracking-wider text-yellow-400">
                  📁 Fotografías en la Galería ({filteredPhotos.length})
                </h3>
                <span className="text-xs sm:text-sm font-bold text-slate-300">
                  Usa los botones ◄ ► en cada tarjeta para modificar el orden de visualización
                </span>
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => scrollFilterTrack("left")}
                  className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black font-extrabold text-xl shadow-lg shrink-0 cursor-pointer"
                  title="Anterior"
                >
                  ‹
                </button>

                <div
                  ref={filterTrackRef}
                  className="flex-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5"
                  onWheel={(e) => {
                    if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
                  }}
                >
                  <button
                    onClick={() => setFilterMember("todos")}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase transition-all shrink-0 cursor-pointer ${filterMember === "todos"
                        ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-md"
                        : "bg-slate-900 text-white border-2 border-slate-700 hover:border-yellow-400"
                      }`}
                  >
                    Todas ({data.fotos.length})
                  </button>

                  <button
                    onClick={() => setFilterMember("banda")}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase transition-all shrink-0 cursor-pointer ${filterMember === "banda"
                        ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-md"
                        : "bg-slate-900 text-white border-2 border-slate-700 hover:border-yellow-400"
                      }`}
                  >
                    📌 Banda General ({bandPhotosCount})
                  </button>

                  {data.integrantes.map((m) => {
                    const mCount = data.fotos.filter((f) => f.integranteId === m.id).length;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setFilterMember(m.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${filterMember === m.id
                            ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-md"
                            : "bg-slate-900 text-white border-2 border-slate-700 hover:border-yellow-400"
                          }`}
                      >
                        👤 {m.nombre} ({mCount})
                      </button>
                    );
                  })}

                  {seccionesList.filter((s) => s.id !== "banda").map((s) => {
                    const sCount = data.fotos.filter((f) => f.seccionId === s.id).length;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setFilterMember(s.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${filterMember === s.id
                            ? "bg-yellow-400 text-black border-2 border-yellow-300 shadow-md"
                            : "bg-slate-900 text-white border-2 border-slate-700 hover:border-yellow-400"
                          }`}
                      >
                        📁 {s.nombre} ({sCount})
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => scrollFilterTrack("right")}
                  className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-black font-extrabold text-xl shadow-lg shrink-0 cursor-pointer"
                  title="Siguiente"
                >
                  ›
                </button>
              </div>

              {filteredPhotos.length === 0 ? (
                <div className="text-center py-14 px-4 bg-slate-900 rounded-xl border-2 border-dashed border-slate-700">
                  <p className="text-amber-300 font-extrabold text-sm uppercase">
                    No se encontraron fotografías en esta categoría.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredPhotos.map((photo, idx) => {
                    const memberAssigned = data.integrantes.find((m) => m.id === photo.integranteId);
                    const sectionAssigned = seccionesList.find((s) => s.id === photo.seccionId);

                    return (
                      <div
                        key={photo.id}
                        className="bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-yellow-400 transition-colors"
                      >
                        <div>
                          <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                            <img src={photo.url} alt="Miniatura" className="w-full h-full object-cover" />

                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/95 border border-slate-600 text-xs font-extrabold text-yellow-300 shadow">
                              {memberAssigned ? `👤 ${memberAssigned.nombre}` : sectionAssigned ? `📁 ${sectionAssigned.nombre}` : "📌 Galería Banda"}
                            </div>

                            {photo.esPrincipal && (
                              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-yellow-400 text-black text-xs font-extrabold uppercase shadow">
                                ★ Principal
                              </div>
                            )}

                            {photo.fecha && (
                              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/90 text-xs font-bold text-white border border-slate-700">
                                {photo.fecha}
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2.5">
                            <p className="text-sm font-bold text-white line-clamp-2 leading-relaxed">
                              {photo.descripcion || <span className="italic text-slate-400 font-normal">Sin descripción ES</span>}
                            </p>

                            {photo.descripcionEn && (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300 border-t border-slate-800 pt-2">
                                <span>🇬🇧</span>
                                <span className="truncate">{photo.descripcionEn}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 border-t-2 border-slate-800 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMovePhoto(photo.id, -1)}
                              disabled={idx === 0}
                              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 text-yellow-400 hover:bg-yellow-400 hover:text-black disabled:opacity-30 flex items-center justify-center font-extrabold text-sm cursor-pointer"
                              title="Mover a la izquierda"
                            >
                              ◄
                            </button>
                            <button
                              onClick={() => handleMovePhoto(photo.id, 1)}
                              disabled={idx === filteredPhotos.length - 1}
                              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 text-yellow-400 hover:bg-yellow-400 hover:text-black disabled:opacity-30 flex items-center justify-center font-extrabold text-sm cursor-pointer"
                              title="Mover a la derecha"
                            >
                              ►
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditPhoto(photo)}
                              className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 hover:bg-yellow-400 hover:text-black font-extrabold text-xs uppercase transition-colors cursor-pointer"
                            >
                              ✏️ Editar
                            </button>

                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-600 hover:text-white font-extrabold text-xs uppercase transition-colors cursor-pointer"
                              title="Eliminar foto"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════ PESTAÑA 2: INTEGRANTES Y MÚSICOS ════════════ */}
        {activeAdminTab === "integrantes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-yellow-400">
                  👥 Integrantes de la Orquesta ({data.integrantes.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
                  Puedes crear nuevos integrantes, modificar sus biografías o eliminar perfiles.
                </p>
              </div>

              <button
                onClick={openCreateMember}
                className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-lg cursor-pointer"
              >
                ➕ Crear Nuevo Integrante
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.integrantes.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-yellow-400 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-slate-700 bg-black shrink-0 relative">
                      <img
                        src={m.fotoPrincipalUrl || "/images/photos/bio_portrait_natty.jpg"}
                        alt={m.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="font-extrabold text-xl text-yellow-400 uppercase tracking-wide">
                        {m.nombre}
                      </h3>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-200 uppercase">
                        {m.rol}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed pt-1 font-medium">
                        {m.bio || "Sin biografía..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t-2 border-slate-800">
                    <button
                      onClick={() => openEditMember(m)}
                      className="flex-1 py-2.5 rounded-xl bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 hover:bg-yellow-400 hover:text-black font-extrabold text-xs uppercase transition-colors cursor-pointer text-center"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m.id, m.nombre)}
                      className="px-3.5 py-2.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-600 hover:text-white font-extrabold text-xs uppercase transition-colors cursor-pointer"
                      title="Eliminar Integrante"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ PESTAÑA 3: SECCIONES Y CATEGORÍAS ════════════ */}
        {activeAdminTab === "secciones" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-yellow-400">
                  📁 Secciones y Categorías de la Galería ({seccionesList.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
                  Crea categorías personalizadas para clasificar fotos (ej. Conciertos, Camerino, Backstage, Prensa).
                </p>
              </div>

              <button
                onClick={openCreateSection}
                className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-lg cursor-pointer"
              >
                ➕ Crear Nueva Sección
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seccionesList.map((sec) => {
                const isDefaultBanda = sec.id === "banda";
                const secPhotosCount = data.fotos.filter((f) => f.seccionId === sec.id || (!f.integranteId && isDefaultBanda)).length;

                return (
                  <div
                    key={sec.id}
                    className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 shadow-lg flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📁</span>
                        <h3 className="font-extrabold text-base text-yellow-400 uppercase">
                          {sec.nombre}
                        </h3>
                      </div>
                      <p className="text-xs font-bold text-slate-300 mt-1">
                        ID: {sec.id} • {secPhotosCount} Fotos
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditSection(sec)}
                        className="px-3 py-2 rounded-lg bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 hover:bg-yellow-400 hover:text-black font-extrabold text-xs uppercase transition-colors cursor-pointer"
                      >
                        ✏️ Editar
                      </button>
                      {!isDefaultBanda && (
                        <button
                          onClick={() => handleDeleteSection(sec.id, sec.nombre)}
                          className="px-3 py-2 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-600 hover:text-white font-extrabold text-xs uppercase transition-colors cursor-pointer"
                          title="Eliminar Sección"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════ PESTAÑA 4: ENLACES PRIVADOS (STAGE SETTINGS & DOSSIER) ════════════ */}
        {activeAdminTab === "privado" && (
          <div className="space-y-8">

            {/* FORMULARIO DE CREACIÓN DE ENLACE PRIVADO */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
                <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-yellow-400 flex items-center gap-2">
                  <span>🔒 Crear Enlace Privado (Stage Setup / Rider / Dossier)</span>
                </h2>
                {privateStatus && (
                  <span className="text-xs sm:text-sm font-extrabold text-yellow-300 bg-slate-950 border-2 border-yellow-400 px-4 py-1.5 rounded-lg shadow">
                    {privateStatus}
                  </span>
                )}
              </div>

              <form onSubmit={handleCreatePrivateLinkSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                      1. Título del Evento o Dossier *:
                    </label>
                    <input
                      type="text"
                      required
                      value={privateTitulo}
                      onChange={(e) => setPrivateTitulo(e.target.value)}
                      placeholder="Ej. Rider Técnico y Escenario - Festival Glastonbury 2026"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                      2. Clave de Acceso (Contraseña) *:
                    </label>
                    <input
                      type="text"
                      required
                      value={privateClave}
                      onChange={(e) => setPrivateClave(e.target.value)}
                      placeholder="Ej. ska2026stage"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-yellow-300 font-mono text-sm font-extrabold focus:outline-none focus:border-yellow-400 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                    3. Notas / Instrucciones Técnicas de Escenario (Opcional):
                  </label>
                  <textarea
                    rows={3}
                    value={privateNotas}
                    onChange={(e) => setPrivateNotas(e.target.value)}
                    placeholder="Ej. Canales 1-2 Percusión Cubana, Canal 3 Bajo, Monitor 1 Natty Bo. Posición de vientos a la izquierda."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-2">
                    4. Fotos de Escenario, Diagramas, Rider o Dossier (Varias selecciones permitidas):
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      if (newFiles.length > 0) {
                        setPrivateFiles((prev) => [...prev, ...newFiles]);
                      }
                      e.target.value = "";
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 cursor-pointer"
                  />
                  {privateFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold text-yellow-300">
                          ✓ {privateFiles.length} imagen(es) acumulada(s) para este enlace:
                        </p>
                        <button
                          type="button"
                          onClick={() => setPrivateFiles([])}
                          className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
                        >
                          Vaciar lista
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        {privateFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-xs px-3 py-1.5 rounded-lg shadow-sm">
                            <span className="truncate max-w-[160px] text-slate-200 font-medium">📷 {file.name}</span>
                            <button
                              type="button"
                              onClick={() => setPrivateFiles((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-red-400 font-bold hover:text-red-300 cursor-pointer ml-1 text-sm"
                              title="Quitar esta foto"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={creatingPrivateLink || !privateTitulo || !privateClave}
                    className="px-7 py-3.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 disabled:opacity-50 transition-all shadow-xl cursor-pointer"
                  >
                    {creatingPrivateLink ? "Creando Enlace..." : "🔒 Crear Enlace Privado para Concierto"}
                  </button>
                </div>
              </form>
            </div>

            {/* LISTADO DE ENLACES PRIVADOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <h3 className="text-base font-extrabold uppercase tracking-wider text-yellow-400">
                  🔒 Enlaces Privados de Escenario Creados ({privateLinks.length})
                </h3>
                <span className="text-xs sm:text-sm font-bold text-slate-300">
                  Haz clic en Copiar Enlace para enviárselo a los promotores o técnicos de concierto
                </span>
              </div>

              {privateLinks.length === 0 ? (
                <div className="text-center py-14 px-4 bg-slate-900 rounded-xl border-2 border-dashed border-slate-700">
                  <p className="text-amber-300 font-extrabold text-sm uppercase">
                    No has creado ningún enlace privado de escenario todavía.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {privateLinks.map((link) => {
                    const showClave = !!showPasswordMap[link.id];

                    return (
                      <div
                        key={link.id}
                        className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-yellow-400 transition-colors"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-base sm:text-lg font-extrabold text-yellow-400 uppercase">
                              {link.titulo}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-slate-300">
                              📷 {link.fotos?.length || 0} Fotos
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
                            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                              <span>🔑 Clave:</span>
                              <span className="font-mono text-yellow-300 text-sm">
                                {showClave ? link.clave : "••••••••"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswordMap((prev) => ({ ...prev, [link.id]: !prev[link.id] }))
                                }
                                className="text-slate-400 hover:text-white ml-1 text-xs cursor-pointer"
                              >
                                {showClave ? "🙈 Ocultar" : "👁️ Mostrar"}
                              </button>
                            </div>

                            <span className="text-slate-400">
                              Creado: {new Date(link.creadoEn).toLocaleDateString()}
                            </span>
                          </div>

                          {link.notasTecnicas && (
                            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 line-clamp-2 font-medium">
                              📝 {link.notasTecnicas}
                            </p>
                          )}

                          {/* Previsualización de miniaturas de fotos */}
                          {link.fotos && link.fotos.length > 0 && (
                            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                              {link.fotos.map((img, idx) => (
                                <div key={idx} className="w-14 h-12 rounded-lg bg-black overflow-hidden border border-slate-700 shrink-0">
                                  <img src={img.url} alt="Stage plot" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Botones de Acción para el Enlace Privado */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                          <button
                            onClick={() => openEditPrivateLink(link)}
                            className="px-3.5 py-2.5 rounded-xl bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 hover:bg-yellow-400 hover:text-black font-extrabold text-xs uppercase transition-colors cursor-pointer"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            onClick={() => copyToClipboard(link.slug)}
                            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${copiedSlug === link.slug
                                ? "bg-green-500 text-black"
                                : "bg-yellow-400 text-black hover:bg-yellow-300"
                              }`}
                          >
                            <span>{copiedSlug === link.slug ? "✓ ¡Copiado!" : "📋 Copiar Enlace Público"}</span>
                          </button>

                          <Link
                            href={`/privado/${link.slug}`}
                            target="_blank"
                            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white font-extrabold text-xs uppercase hover:bg-slate-700 transition-all text-center"
                          >
                            👁️ Probar Enlace
                          </Link>

                          <button
                            onClick={() => handleDeletePrivateLink(link.id, link.titulo)}
                            className="px-3.5 py-2.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-600 hover:text-white font-extrabold text-xs uppercase transition-colors cursor-pointer"
                            title="Eliminar Enlace Privado"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ── MODALES EXISTENTES ── */}
      {showCreateMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-yellow-400 uppercase">
                ➕ Crear Nuevo Integrante
              </h3>
              <button onClick={() => setShowCreateMemberModal(false)} className="text-slate-400 hover:text-white font-extrabold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMemberSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Nombre Completo / Apodo *:
                </label>
                <input
                  type="text"
                  required
                  value={memberFormNombre}
                  onChange={(e) => setMemberFormNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Rol / Instrumento:
                </label>
                <input
                  type="text"
                  value={memberFormRol}
                  onChange={(e) => setMemberFormRol(e.target.value)}
                  placeholder="Ej. Saxofón Barítono"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Biografía / Descripción:
                </label>
                <textarea
                  rows={3}
                  value={memberFormBio}
                  onChange={(e) => setMemberFormBio(e.target.value)}
                  placeholder="Breve historia del músico..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateMemberModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-extrabold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 shadow-lg cursor-pointer"
                >
                  {savingMember ? "Creando..." : "✓ Crear Integrante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-yellow-400 uppercase">
                ✏️ Editar Músico: {editingMember.nombre}
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-white font-extrabold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Nombre Visible:
                </label>
                <input
                  type="text"
                  value={memberFormNombre}
                  onChange={(e) => setMemberFormNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Rol / Instrumento:
                </label>
                <input
                  type="text"
                  value={memberFormRol}
                  onChange={(e) => setMemberFormRol(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Biografía / Historia:
                </label>
                <textarea
                  rows={4}
                  value={memberFormBio}
                  onChange={(e) => setMemberFormBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold leading-relaxed focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-extrabold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 shadow-lg cursor-pointer"
                >
                  {savingMember ? "Guardando..." : "✓ Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-yellow-400 uppercase">
                ➕ Crear Nueva Sección
              </h3>
              <button onClick={() => setShowCreateSectionModal(false)} className="text-slate-400 hover:text-white font-extrabold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Nombre de la Sección *:
                </label>
                <input
                  type="text"
                  required
                  value={sectionFormNombre}
                  onChange={(e) => setSectionFormNombre(e.target.value)}
                  placeholder="Ej. Giras y Conciertos, Backstage, Prensa"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateSectionModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-extrabold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSection}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 shadow-lg cursor-pointer"
                >
                  {savingSection ? "Creando..." : "✓ Crear Sección"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-yellow-400 uppercase">
                ✏️ Editar Sección
              </h3>
              <button onClick={() => setEditingSection(null)} className="text-slate-400 hover:text-white font-extrabold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSection} className="space-y-4">
              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Nombre de la Sección:
                </label>
                <input
                  type="text"
                  required
                  value={sectionFormNombre}
                  onChange={(e) => setSectionFormNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-extrabold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSection}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 shadow-lg cursor-pointer"
                >
                  {savingSection ? "Guardando..." : "✓ Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-yellow-400 uppercase">
                ✏️ Editar Fotografía
              </h3>
              <button onClick={() => setEditingPhoto(null)} className="text-slate-400 hover:text-white font-extrabold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPhoto} className="space-y-4">

              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-20 h-16 rounded-lg overflow-hidden bg-black shrink-0">
                  <img src={editingPhoto.url} alt="Foto" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs text-slate-200 font-bold">
                  <p>ID: {editingPhoto.id}</p>
                  <p className="text-yellow-400 font-extrabold">Orden actual: #{editingPhoto.orden}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Pie de Foto en Español 🇪🇸:
                </label>
                <textarea
                  rows={2}
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Photo Caption in English 🇬🇧:
                </label>
                <textarea
                  rows={2}
                  value={editDescripcionEn}
                  onChange={(e) => setEditDescripcionEn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                    Fecha o Evento:
                  </label>
                  <input
                    type="text"
                    value={editFecha}
                    onChange={(e) => setEditFecha(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                    Asignado a:
                  </label>
                  <select
                    value={editIntegranteId}
                    onChange={(e) => setEditIntegranteId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                  >
                    <option value="banda">★ Galería General de la Banda</option>
                    <optgroup label="Integrantes">
                      {data.integrantes.map((m) => (
                        <option key={m.id} value={m.id}>
                          👤 {m.nombre} ({m.rol})
                        </option>
                      ))}
                    </optgroup>
                    {seccionesList.filter((s) => s.id !== "banda").length > 0 && (
                      <optgroup label="Secciones">
                        {seccionesList.filter((s) => s.id !== "banda").map((s) => (
                          <option key={s.id} value={s.id}>
                            📁 {s.nombre}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              {editIntegranteId !== "banda" && (
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="editCheckPrincipal"
                    checked={editEsPrincipal}
                    onChange={(e) => setEditEsPrincipal(e.target.checked)}
                    className="w-5 h-5 accent-yellow-400 cursor-pointer"
                  />
                  <label htmlFor="editCheckPrincipal" className="text-sm text-yellow-300 font-extrabold cursor-pointer">
                    Establecer como Foto Principal de Perfil del Integrante
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-extrabold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 shadow-lg cursor-pointer"
                >
                  {savingEdit ? "Guardando..." : "✓ Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR ENLACE PRIVADO DE ESCENARIO ── */}
      {editingPrivateLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-yellow-400 uppercase">
                ✏️ Editar Enlace Privado: {editingPrivateLink.titulo}
              </h3>
              <button onClick={() => setEditingPrivateLink(null)} className="text-slate-400 hover:text-white font-extrabold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPrivateLink} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                    Título del Evento / Dossier *:
                  </label>
                  <input
                    type="text"
                    required
                    value={editPrivateTitulo}
                    onChange={(e) => setEditPrivateTitulo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                    Clave de Acceso *:
                  </label>
                  <input
                    type="text"
                    required
                    value={editPrivateClave}
                    onChange={(e) => setEditPrivateClave(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-yellow-300 font-mono text-sm font-extrabold focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-1">
                  Notas e Instrucciones Técnicas:
                </label>
                <textarea
                  rows={3}
                  value={editPrivateNotas}
                  onChange={(e) => setEditPrivateNotas(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Fotos / Archivos Existentes */}
              <div className="space-y-2">
                <label className="block text-sm font-extrabold text-yellow-400 uppercase">
                  Archivos Adjuntos Actuales ({editPrivateExistingFotos.length}):
                </label>
                {editPrivateExistingFotos.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No hay archivos adjuntos actualmente.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    {editPrivateExistingFotos.map((file, idx) => (
                      <div key={file.id || idx} className="relative bg-slate-900 border border-slate-700 rounded-xl p-2 flex flex-col justify-between items-center text-center space-y-1">
                        {file.esPdf || file.tipo === 'pdf' || file.url?.endsWith('.pdf') ? (
                          <div className="w-10 h-10 bg-red-950/80 rounded-lg flex items-center justify-center text-red-300 font-bold text-xl">📄</div>
                        ) : (
                          <img src={file.url} alt="Foto" className="w-full h-16 object-cover rounded-lg" />
                        )}
                        <span className="text-[11px] font-bold text-slate-200 truncate w-full">{file.nombre || "Archivo"}</span>
                        <button
                          type="button"
                          onClick={() => setEditPrivateExistingFotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="w-full py-1 rounded bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-600 hover:text-white font-bold text-[11px] uppercase transition-colors"
                        >
                          🗑️ Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Añadir Nuevos Archivos / PDFs */}
              <div>
                <label className="block text-sm font-extrabold text-yellow-400 uppercase mb-2">
                  Añadir Nuevas Fotos o Documentos PDF:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const newSelected = Array.from(e.target.files || []);
                    if (newSelected.length > 0) {
                      setEditPrivateNewFiles((prev) => [...prev, ...newSelected]);
                    }
                    e.target.value = "";
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 cursor-pointer"
                />

                {editPrivateNewFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold text-yellow-300">
                        ✓ {editPrivateNewFiles.length} nuevo(s) archivo(s) a añadir:
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditPrivateNewFiles([])}
                        className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
                      >
                        Vaciar lista
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      {editPrivateNewFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-xs px-3 py-1.5 rounded-lg shadow-sm">
                          <span className="truncate max-w-[160px] text-slate-200 font-medium">📎 {file.name}</span>
                          <button
                            type="button"
                            onClick={() => setEditPrivateNewFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-red-400 font-bold hover:text-red-300 cursor-pointer ml-1 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPrivateLink(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-extrabold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEditPrivateLink}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 shadow-lg cursor-pointer"
                >
                  {savingEditPrivateLink ? "Guardando..." : "✓ Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
