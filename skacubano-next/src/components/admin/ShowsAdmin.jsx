"use client";

import { useEffect, useState } from "react";

// Gestión de la sección "Shows" de la web: cartelera de conciertos y vídeos de YouTube destacados.
// Todo se escribe en español e inglés. Cada cambio (crear, editar, borrar, mover) se guarda al momento.

const SHOW_FIELDS = [
  { key: "festival", label: "Festival / Gira", placeholder: { es: "GLASTONBURY FESTIVAL", en: "GLASTONBURY FESTIVAL" }, required: true },
  { key: "location", label: "Lugar", placeholder: { es: "Pilton, Reino Unido", en: "Pilton, United Kingdom" } },
  { key: "year", label: "Año / Etiqueta", placeholder: { es: "2005", en: "2005" } },
  { key: "details", label: "Detalles", placeholder: { es: "Escenario principal…", en: "Main stage…" }, multiline: true },
];

const VIDEO_FIELDS = [
  { key: "title", label: "Título", placeholder: { es: "Directo en…", en: "Live at…" }, required: true },
  { key: "location", label: "Lugar", placeholder: { es: "Oslo, Noruega (2005)", en: "Oslo, Norway (2005)" } },
  { key: "description", label: "Descripción", placeholder: { es: "Una actuación…", en: "A performance…" }, multiline: true },
];

const emptyBilingual = () => ({ es: "", en: "" });

function emptyItem(fields, extra = {}) {
  const item = { ...extra };
  fields.forEach((f) => (item[f.key] = emptyBilingual()));
  return item;
}

// Misma lógica que el servidor (extract_youtube_id): acepta el ID o cualquier enlace de YouTube
function extractYoutubeId(value) {
  const v = (value || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function move(list, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

const inputClass =
  "w-full bg-slate-950 border-2 border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none";

function BilingualFields({ fields, value, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["es", "en"].map((lang) => {
            const id = `${f.key}-${lang}`;
            const common = {
              id,
              value: value[f.key]?.[lang] || "",
              placeholder: f.placeholder?.[lang],
              required: f.required,
              className: inputClass,
              onChange: (e) => onChange({ ...value, [f.key]: { ...value[f.key], [lang]: e.target.value } }),
            };
            return (
              <div key={lang}>
                <label htmlFor={id} className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                  {f.label} <span className={`fi ${lang === "es" ? "fi-es" : "fi-gb"} ml-1`} /> {lang.toUpperCase()}
                  {f.required && <span className="text-yellow-400"> *</span>}
                </label>
                {f.multiline ? <textarea rows={3} {...common} /> : <input type="text" {...common} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ItemModal({ title, fields, initial, withYoutube, saving, onCancel, onSubmit }) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");
  const youtubeId = withYoutube ? extractYoutubeId(value.youtubeId) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (withYoutube && !youtubeId) {
      setError("Pega un enlace de YouTube válido (o el ID de 11 caracteres).");
      return;
    }
    setError("");
    onSubmit(withYoutube ? { ...value, youtubeId } : value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start sm:items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-slate-900 border-2 border-yellow-400/60 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        <h3 className="text-lg font-extrabold uppercase tracking-wider text-yellow-400">{title}</h3>

        {withYoutube && (
          <div>
            <label htmlFor="youtube" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
              Enlace de YouTube <span className="text-yellow-400">*</span>
            </label>
            <input
              id="youtube"
              type="text"
              required
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=…"
              value={value.youtubeId || ""}
              onChange={(e) => setValue({ ...value, youtubeId: e.target.value })}
            />
            {youtubeId && (
              <img src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`} alt="Vista previa" className="mt-3 w-48 rounded-lg border border-slate-700" />
            )}
          </div>
        )}

        <BilingualFields fields={fields} value={value} onChange={setValue} />

        {error && <p className="text-sm font-bold text-red-300">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border-2 border-slate-600 text-slate-200 font-bold text-sm uppercase hover:bg-slate-800 cursor-pointer">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-sm uppercase hover:bg-yellow-300 disabled:opacity-50 cursor-pointer">
            {saving ? "Guardando…" : "💾 Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ItemList({ items, renderTitle, renderSubtitle, onMove, onEdit, onDelete, disabled }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400 font-semibold py-6 text-center">Todavía no hay nada aquí.</p>;
  }
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={item.id} className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3 sm:p-4 flex items-center gap-3">
          <span className="w-8 shrink-0 text-center font-mono font-extrabold text-yellow-400">{index + 1}</span>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={disabled || index === 0}
              aria-label="Subir"
              className="w-8 h-7 rounded bg-slate-800 border border-slate-600 text-slate-200 hover:bg-yellow-400 hover:text-black disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-200 cursor-pointer text-xs"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={disabled || index === items.length - 1}
              aria-label="Bajar"
              className="w-8 h-7 rounded bg-slate-800 border border-slate-600 text-slate-200 hover:bg-yellow-400 hover:text-black disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-200 cursor-pointer text-xs"
            >
              ▼
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-white truncate">{renderTitle(item)}</p>
            <p className="text-xs text-slate-400 font-semibold truncate">{renderSubtitle(item)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(item)}
              disabled={disabled}
              className="px-3 py-2 rounded-lg bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 hover:bg-yellow-400 hover:text-black font-extrabold text-xs uppercase cursor-pointer disabled:opacity-40"
            >
              ✏️ <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              disabled={disabled}
              aria-label="Eliminar"
              className="px-3 py-2 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-600 hover:text-white font-extrabold text-xs cursor-pointer disabled:opacity-40"
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ShowsAdmin({ onCountChange }) {
  const [data, setData] = useState({ shows: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  // { kind: "show" | "video", item, isNew }
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // no-store: el admin siempre ve la versión real, no la cacheada para el público
        const res = await fetch("/api/shows", { cache: "no-store" });
        const json = await res.json();
        if (Array.isArray(json.shows) && Array.isArray(json.videos)) setData(json);
      } catch (err) {
        console.error("Error cargando shows:", err);
        setStatus("❌ No se pudieron cargar los shows");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    onCountChange?.(data.shows.length);
  }, [data.shows.length, onCountChange]);

  const save = async (next, okMessage) => {
    setSaving(true);
    setStatus("Guardando…");
    try {
      const res = await fetch("/api/shows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Error al guardar");
      setData(json.data);
      setStatus(`✓ ${okMessage}`);
      return true;
    } catch (err) {
      setStatus(`❌ ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const listKey = (kind) => (kind === "show" ? "shows" : "videos");

  const handleMove = (kind, index, delta) => {
    const key = listKey(kind);
    save({ ...data, [key]: move(data[key], index, delta) }, "Orden guardado");
  };

  const handleDelete = (kind, item) => {
    const name = kind === "show" ? item.festival?.es : item.title?.es;
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    const key = listKey(kind);
    save({ ...data, [key]: data[key].filter((i) => i.id !== item.id) }, "Eliminado");
  };

  const handleSubmitItem = async (value) => {
    const { kind, isNew } = editing;
    const key = listKey(kind);
    // Los nuevos shows se añaden arriba (los más recientes primero); los vídeos, al final
    const list = isNew
      ? kind === "show"
        ? [value, ...data[key]]
        : [...data[key], value]
      : data[key].map((i) => (i.id === value.id ? value : i));
    const ok = await save({ ...data, [key]: list }, isNew ? "Añadido" : "Cambios guardados");
    if (ok) setEditing(null);
  };

  if (loading) {
    return <p className="text-slate-300 font-bold py-10 text-center">Cargando shows…</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-800 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-yellow-400">🎤 Shows y Conciertos</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
            Usa ▲ ▼ para cambiar el orden en la web. Los cambios se guardan al momento y pueden tardar hasta 1 minuto en verse en la web pública.
          </p>
        </div>
        {status && (
          <span className="text-xs sm:text-sm font-extrabold text-yellow-300 bg-slate-950 border-2 border-yellow-400 px-4 py-1.5 rounded-lg shadow" role="status">
            {status}
          </span>
        )}
      </div>

      {/* CARTELERA */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-extrabold uppercase tracking-wider text-white">📋 Cartelera de conciertos ({data.shows.length})</h3>
          <button
            type="button"
            onClick={() => setEditing({ kind: "show", isNew: true, item: emptyItem(SHOW_FIELDS) })}
            className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 shadow-lg cursor-pointer"
          >
            ➕ Añadir show
          </button>
        </div>
        <ItemList
          items={data.shows}
          disabled={saving}
          renderTitle={(s) => s.festival?.es}
          renderSubtitle={(s) => [s.location?.es, s.year?.es].filter(Boolean).join(" • ")}
          onMove={(i, d) => handleMove("show", i, d)}
          onEdit={(item) => setEditing({ kind: "show", isNew: false, item })}
          onDelete={(item) => handleDelete("show", item)}
        />
      </section>

      {/* VÍDEOS */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-extrabold uppercase tracking-wider text-white">▶️ Vídeos destacados de YouTube ({data.videos.length})</h3>
          <button
            type="button"
            onClick={() => setEditing({ kind: "video", isNew: true, item: emptyItem(VIDEO_FIELDS, { youtubeId: "" }) })}
            className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 shadow-lg cursor-pointer"
          >
            ➕ Añadir vídeo
          </button>
        </div>
        <p className="text-xs text-slate-400 font-semibold">En la web se ven en filas de 3; lo ideal es tener 3 o 6 vídeos.</p>
        <ItemList
          items={data.videos}
          disabled={saving}
          renderTitle={(v) => v.title?.es}
          renderSubtitle={(v) => [v.location?.es, `youtu.be/${v.youtubeId}`].filter(Boolean).join(" • ")}
          onMove={(i, d) => handleMove("video", i, d)}
          onEdit={(item) => setEditing({ kind: "video", isNew: false, item })}
          onDelete={(item) => handleDelete("video", item)}
        />
      </section>

      {editing && (
        <ItemModal
          key={editing.item.id || "new"}
          title={`${editing.isNew ? "Añadir" : "Editar"} ${editing.kind === "show" ? "show" : "vídeo"}`}
          fields={editing.kind === "show" ? SHOW_FIELDS : VIDEO_FIELDS}
          withYoutube={editing.kind === "video"}
          initial={editing.item}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSubmit={handleSubmitItem}
        />
      )}
    </div>
  );
}
