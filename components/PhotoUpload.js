"use client";

import { useState, useRef } from "react";
import SectionReveal from "./SectionReveal";

export default function PhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);

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
    form.append("label", "Subida por invitados");
    try {
      const res = await fetch("http://localhost:4000/api/gallery/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Error al subir");
      setMessage("¡Imagen subida! Gracias por compartir.");
      setPreview(null);
      fileRef.current.value = "";
    } catch {
      setMessage("Error al subir. Intenta de nuevo.");
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
            <span className="text-xl animate-bounce" style={{ animationDuration: '1.5s' }}>✨</span>
          </div>
          <h4 className="font-headline text-lg text-primary font-bold princess-title">
            Sube tu foto de la fiesta
          </h4>
          <p className="text-[10px] text-pink-600/70 uppercase tracking-widest font-bold">
            Comparte tus momentos con Susana ✨
          </p>
        </div>

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
          <p className="text-xs font-bold text-center text-pink-600/80 animate-pulse">{message} ✨</p>
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
      </div>
    </SectionReveal>
  );
}
