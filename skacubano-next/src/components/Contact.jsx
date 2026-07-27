"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import BowloramaText from "./BowloramaText";

/* ── Photo data ─────────────────────────────────────────────────────── */
const PHOTOS = [
  { src: "/images/photos/beny_natty_santiago.jpg", rotate: -4, top: "2%", left: "0%", z: 1, w: 320, label: "Santiago de Cuba 2001" },
  { src: "/images/photos/fruitguitar.jpg", rotate: 3, top: "0%", left: "22%", z: 2, w: 280, label: "Fruit Guitar Session" },
  { src: "/images/photos/bio_portrait_benny.jpg", rotate: -2, top: "5%", right: "19%", z: 1, w: 260, label: "Beny Billy" },
  { src: "/images/photos/bio_portrait_natty.jpg", rotate: 5, top: "1%", right: "0%", z: 2, w: 300, label: "Natty Bo" },
  { src: "/images/photos/ajiaco_cover.jpg", rotate: -3, bottom: "2%", left: "1%", z: 2, w: 290, label: "Ajiaco! Original Artwork" },
  { src: "/images/hero/SkaImagen11.jpg", rotate: 4, bottom: "0%", left: "20%", z: 1, w: 270, label: "London Rehearsals" },
  { src: "/images/hero/SkaImagen14.jpg", rotate: -5, bottom: "3%", right: "18%", z: 2, w: 285, label: "Mambo Ska Tour" },
  { src: "/images/hero/SkaImagen16.jpg", rotate: 2, bottom: "1%", right: "0%", z: 1, w: 305, label: "World Music Tour" },
];

/* ── Social links with SVG icons ────────────────────────────────────── */
const SOCIALS = [
  {
    href: "https://instagram.com/skacubano",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://facebook.com/skacubano",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/skcubano",
    label: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

/* ── Single analog photo ─────────────────────────────────────────────── */
function AnalogPhoto({ src, rotate, top, left, right, bottom, z, w, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: rotate - 6 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="absolute select-none hidden lg:block"
      style={{ top, left, right, bottom, zIndex: z, width: w }}
    >
      {/* Polaroid frame */}
      <div
        className="bg-[#f0e8d8] shadow-[0_8px_32px_rgba(0,0,0,0.7)] p-2 pb-6 rounded-sm border border-amber-900/10"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}
      >
        {/* Image with sepia + grain */}
        <div className="relative overflow-hidden w-full" style={{ height: Math.round(w * 0.7) }}>
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover"
            style={{ filter: "sepia(40%) contrast(1.1) brightness(0.92)" }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)" }}
          />
        </div>

        {/* Handwritten caption */}
        <p
          className="text-center text-[11px] text-[#5a3c1e] mt-2 leading-tight font-semibold"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}
function NoteForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [currentDate, setCurrentDate] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "49afea16-e102-410a-a3c8-a0ff0abe89f4", 
          name: form.name,
          email: form.email,
          message: form.message,
          subject: "New message from the Ska Cubano website", 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        console.error("Error Web3Forms:", result);
        setStatus("idle");
        alert("Hubo un problema al enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setStatus("idle");
      alert("Error de conexión. Revisa tu internet.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0.5 }}
      transition={{ duration: 0.65, delay: 0.3, ease: "easeOut" }}
      className="relative z-30 w-full max-w-md mx-auto"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
    >
      {/* Notebook sheet */}
      <div className="relative bg-[#faf6ee] rounded-sm overflow-hidden">

        {/* Notebook lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 31px, #c8b99a55 31px, #c8b99a55 32px)",
            backgroundPositionY: "48px",
          }}
        />

        {/* Red left margin */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-[#e8a09a]/60 pointer-events-none" />

        {/* Spiral holes */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center justify-around py-8 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#f3eac0] border-2 border-[#d4c4a8] shadow-inner" />
          ))}
        </div>

        <div className="pl-16 pr-7 pt-7 pb-8">
          {/* Header row */}
          <div className="flex justify-between items-baseline mb-6 border-b border-[#c8b99a]/40 pb-2">
            <p className="text-[13px] uppercase tracking-[.2em] text-[#5a3a1a] font-bold">
              {t.contact.form.header}
            </p>
            <p className="text-[12px] text-[#7a5a3a] italic min-h-[16px]" style={{ fontFamily: "Georgia, serif" }}>
              {currentDate}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                className="block text-[13px] uppercase tracking-[.12em] text-[#5a3a1a] mb-1 font-semibold"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {t.contact.form.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={t.contact.form.namePlaceholder}
                className="w-full bg-transparent border-b-2 border-[#b09070] text-[#2a1a0a] text-base py-1.5 placeholder:text-[#a08060] focus:outline-none focus:border-[#d35400] transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[13px] uppercase tracking-[.12em] text-[#5a3a1a] mb-1 font-semibold"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {t.contact.form.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={t.contact.form.emailPlaceholder}
                className="w-full bg-transparent border-b-2 border-[#b09070] text-[#2a1a0a] text-base py-1.5 placeholder:text-[#a08060] focus:outline-none focus:border-[#d35400] transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              />
            </div>

            {/* Message */}
            <div>
              <label
                className="block text-[13px] uppercase tracking-[.12em] text-[#5a3a1a] mb-1 font-semibold"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {t.contact.form.msgLabel}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={2}
                placeholder={t.contact.form.msgPlaceholder}
                className="w-full bg-transparent border-b-2 border-[#b09070] text-[#2a1a0a] text-base py-1.5 placeholder:text-[#a08060] focus:outline-none focus:border-[#d35400] transition-colors resize-none leading-8"
                style={{ fontFamily: "Georgia, serif" }}
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.p
                    key="sent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#d35400] font-bold text-sm italic text-center py-3"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {t.contact.form.success}
                  </motion.p>
                ) : (
                  <motion.button
                    key="btn"
                    type="submit"
                    disabled={status === "sending"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-[#2a1a0a] text-[#f0e8d8] text-[13px] font-bold uppercase tracking-[.2em] py-3.5 rounded-sm hover:bg-[#d35400] disabled:opacity-60 transition-all duration-300"
                    style={{ fontFamily: "Courier New, monospace", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                  >
                    {status === "sending" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                        {t.contact.form.sending}
                      </span>
                    ) : (
                      t.contact.form.sendBtn
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Social links with icons */}
          <div className="mt-6 pt-4 border-t border-[#c8b99a]/40">
            <p className="text-[12px] uppercase tracking-[.15em] text-[#5a3a1a] font-semibold mb-3" style={{ fontFamily: "Courier New, monospace" }}>
              {t.contact.form.followUs}
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#2a1a0a] text-[#f0e8d8] hover:bg-[#d35400] hover:text-white transition-all duration-200 hover:scale-110"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CONTACT — main section
   ═══════════════════════════════════════════════════════════════════════ */
export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#0d0a07" }}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Warm central light */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,110,40,0.12) 0%, transparent 70%)" }}
      />

      {/* Analog photo collage */}
      {inView && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {PHOTOS.map((p, i) => (
            <AnalogPhoto key={p.src} {...p} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Dark vignette so form stands out */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% 50%, rgba(13,10,7,0.45) 0%, rgba(13,10,7,0.82) 65%, rgba(13,10,7,0.93) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen py-20 px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p
            className="text-[10px] uppercase tracking-[.4em] text-[#c8a87a]/70 mb-3 font-mono font-bold"
          >
            {t.contact.badge}
          </p>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl text-white tracking-wide leading-none pb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <BowloramaText text={t.contact.title} />
          </h2>
          <p
            className="mt-4 text-[#c8a87a]/90 text-sm md:text-base max-w-md mx-auto leading-relaxed whitespace-pre-line font-serif italic"
          >
            {t.contact.subtitle}
          </p>
        </motion.div>

        {/* Notebook form */}
        <NoteForm />
      </div>
    </section>
  );
}