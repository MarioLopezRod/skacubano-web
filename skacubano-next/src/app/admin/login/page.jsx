"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RecoveryCodeBox from "@/components/admin/RecoveryCodeBox";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contraseña olvidada: se pone una nueva con el código de recuperación
  const [recoverMode, setRecoverMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newRecoveryCode, setNewRecoveryCode] = useState(null);
  const [recovered, setRecovered] = useState(false);

  const switchMode = (toRecover) => {
    setRecoverMode(toRecover);
    setError("");
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== newPassword.trim()) {
      setError("La nueva contraseña no puede empezar ni acabar con espacios");
      return;
    }
    if (newPassword.replace(/\s+/g, "").length < 10) {
      setError("La nueva contraseña debe tener al menos 10 caracteres (sin contar espacios)");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryCode, newPassword })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setRecovered(true);
        setNewRecoveryCode(json.recoveryCode || null);
        setRecoveryCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(json.error || "No se pudo cambiar la contraseña");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const json = await res.json();

      if (res.ok && json.success) {
        router.push("/admin/galeria");
      } else {
        setError(json.error || "Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cuban-gallery-blue text-[#faf6ee] flex flex-col justify-between items-center p-4 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: "radial-gradient(#facc15 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px"
        }}
      />

      <div className="relative z-10 w-full max-w-md my-auto p-8 rounded-3xl bg-[#14100c]/90 border-2 border-yellow-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image
            src="/skaCubano.png"
            alt="Ska Cubano Logo"
            width={240}
            height={90}
            className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
          />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-black/80 border border-yellow-400/40 text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest">
            ★ ACCESO RESTRINGIDO ★
          </div>
          <h1 className="font-retro50s text-3xl text-yellow-400 uppercase tracking-wide drop-shadow">
            PANEL DE ADMIN
          </h1>
          <p className="text-xs font-sans text-amber-100/80">
            Gestiona las fotografías, biografías e integrantes de Ska Cubano.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {recovered ? (
          <div className="space-y-4">
            <p className="p-3 rounded-xl bg-green-950/90 border border-green-500/50 text-green-200 text-xs font-mono">
              ✓ Contraseña cambiada. Ya has entrado en el panel.
            </p>
            {newRecoveryCode && <RecoveryCodeBox code={newRecoveryCode} />}
            <button
              type="button"
              onClick={() => router.push("/admin/galeria")}
              className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              {newRecoveryCode ? "Ya lo he apuntado, ir al panel →" : "Ir al panel →"}
            </button>
          </div>
        ) : recoverMode ? (
        <form onSubmit={handleRecover} className="space-y-4 text-left">
          <p className="text-xs font-sans text-amber-100/80">
            Escribe el código de recuperación que apuntaste al cambiar la contraseña y elige una contraseña nueva.
          </p>
          <div>
            <label htmlFor="recoveryCode" className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-2">
              Código de recuperación:
            </label>
            <input
              id="recoveryCode"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-300 placeholder-white/20 text-sm uppercase focus:outline-none focus:border-yellow-400 font-mono transition-colors shadow-inner"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-2">
              Nueva contraseña:
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={10}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-300 placeholder-white/20 text-sm focus:outline-none focus:border-yellow-400 font-mono transition-colors shadow-inner"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-2">
              Repite la nueva contraseña:
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-300 placeholder-white/20 text-sm focus:outline-none focus:border-yellow-400 font-mono transition-colors shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? "Comprobando..." : "Cambiar contraseña y entrar →"}
          </button>
          <button
            type="button"
            onClick={() => switchMode(false)}
            className="w-full text-xs font-mono text-yellow-400/80 hover:text-yellow-300 underline cursor-pointer"
          >
            Volver al acceso con contraseña
          </button>
        </form>
        ) : (
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono font-bold text-yellow-400 uppercase mb-2">
              Contraseña Admin:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-300 placeholder-white/20 text-sm focus:outline-none focus:border-yellow-400 font-mono transition-colors shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? "Verificando..." : "Acceder al Panel →"}
          </button>
          <button
            type="button"
            onClick={() => switchMode(true)}
            className="w-full text-xs font-mono text-yellow-400/80 hover:text-yellow-300 underline cursor-pointer"
          >
            ¿Has olvidado la contraseña?
          </button>
        </form>
        )}

        <div className="pt-4 border-t border-white/10">
          <Link
            href="/#gallery"
            className="text-xs font-mono text-yellow-400/80 hover:text-yellow-300 transition-colors uppercase font-semibold"
          >
            ← Volver a la Galeria Publica
          </Link>
        </div>
      </div>
    </main>
  );
}
