"use client";

import { useState } from "react";

// Muestra un código de recuperación recién generado. Solo se ve esta vez: el servidor guarda únicamente su hash.
export default function RecoveryCodeBox({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso para el portapapeles: el código se puede seleccionar a mano
    }
  };

  return (
    <div className="p-4 rounded-xl bg-black/80 border-2 border-yellow-400 space-y-3 text-left">
      <p className="text-sm font-extrabold text-yellow-400 uppercase">🔐 Tu código de recuperación</p>
      <p className="font-mono text-lg sm:text-xl font-bold text-white tracking-wider text-center select-all break-all">
        {code}
      </p>
      <button
        type="button"
        onClick={copy}
        className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold uppercase cursor-pointer"
      >
        {copied ? "✓ Copiado" : "Copiar código"}
      </button>
      <p className="text-xs text-amber-100/90 leading-relaxed">
        Apúntalo y guárdalo en un sitio seguro: <strong>no se volverá a mostrar</strong>. Si olvidas la contraseña,
        pulsa «¿Has olvidado la contraseña?» en la pantalla de acceso y escribe este código para poner una nueva.
        Cada código solo sirve una vez; al usarlo recibirás otro.
      </p>
    </div>
  );
}
