"use client";

import { useState, useRef } from "react";
import SectionReveal from "./SectionReveal";

const API = "http://localhost:4000/api";

export default function PhotoUpload() {
  const [step, setStep] = useState("verify");
  const [guestName, setGuestName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [remaining, setRemaining] = useState(4);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);

  const handleVerify = async () => {
    if (!guestName.trim() || !invitationCode.trim()) return;
    setVerifyLoading(true);
    setVerifyError("");
    try {
      const res = await fetch(`${API}/gallery/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName.trim(), invitationCode: invitationCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploaded(data.uploaded);
      setRemaining(data.remaining);
      setStep("upload");
    } catch (err) {
      setVerifyError(err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.append("image", file);
    form.append("guestName", guestName.trim());
    form.append("invitationCode", invitationCode.trim());
    form.append("label", `Subida por ${guestName.trim()}`);
    try {
      const res = await fetch(`${API}/gallery/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("¡Imagen subida! Pendiente de aprobación.");
      setPreview(null);
      fileRef.current.value = "";
      setUploaded((u) => u + 1);
      setRemaining((r) => r - 1);
      if (data.remaining <= 0) setStep("done");
    } catch (err) {
      setMessage(err.message || "Error al subir. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SectionReveal>
      <div className="glass-morphism rounded-xl p-6 space-y-4 bg-white/60 border-white/80">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">📸</span>
            <span className="text-xl" style={{ animation: "none" }}>✨</span>
          </div>
          <h4 className="font-headline text-lg text-primary font-bold princess-title">
            Sube tu foto de la fiesta
          </h4>
          <p className="text-[10px] text-pink-600/70 uppercase tracking-widest font-bold">
            Comparte tus momentos con Susana ✨
          </p>
        </div>

        {step === "verify" && (
          <div className="space-y-3">
            <input
              className="w-full bg-white/50 border border-white/50 rounded-lg py-3 px-4 text-center text-lg font-bold tracking-[0.15em] text-primary outline-none focus:ring-2 focus:ring-primary/20 placeholder-primary/50"
              placeholder="Código de invitación"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
            <input
              className="w-full bg-white/50 border border-white/50 rounded-lg py-3 px-4 text-center text-primary font-semibold outline-none focus:ring-2 focus:ring-primary/20 placeholder-primary/50"
              placeholder="Tu nombre"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <button
              onClick={handleVerify}
              disabled={verifyLoading || !guestName.trim() || !invitationCode.trim()}
              className="w-full py-3 btn-gradient text-white rounded-lg font-bold text-sm shadow-lg disabled:opacity-60"
            >
              {verifyLoading ? "Verificando..." : "Verificar"}
            </button>
            {verifyError && (
              <p className="text-xs font-bold text-center text-red-600">{verifyError}</p>
            )}
          </div>
        )}

        {step === "upload" && (
          <>
            <div className="bg-gradient-to-r from-pink-100/40 to-purple-100/40 rounded-lg p-3 text-center border border-pink-200/40 space-y-1">
              <p className="text-xs text-primary/70 font-medium">
                Bienvenida, <strong className="text-primary">{guestName}</strong>
              </p>
              <p className="text-sm font-bold text-pink-600">
                Fotos subidas: {uploaded} / 4
              </p>
              {remaining > 0 && (
                <p className="text-[10px] text-pink-600/60">
                  Te quedan {remaining} foto{remaining !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {remaining > 0 && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 cursor-pointer"
                />

                {preview && (
                  <div className="relative rounded-lg overflow-hidden border border-pink-200/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-200/20 pointer-events-none" />
                    <img src={preview} alt="preview" className="w-full h-40 object-cover" />
                  </div>
                )}

                {message && (
                  <p className="text-xs font-bold text-center text-pink-600/80">{message} ✨</p>
                )}

                {preview && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full py-3 btn-gradient text-white rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {uploading ? "Subiendo..." : "Subir foto"}
                    <span className="material-symbols-outlined text-sm">upload</span>
                  </button>
                )}
              </>
            )}

            {remaining <= 0 && (
              <p className="text-sm font-bold text-center text-green-700">
                ¡Gracias! Has subido el máximo de 4 fotos. 🎉
              </p>
            )}
          </>
        )}

        {step === "done" && (
          <p className="text-sm font-bold text-center text-green-700">
            ¡Gracias por compartir tus fotos! 🎉
          </p>
        )}
      </div>
    </SectionReveal>
  );
}
