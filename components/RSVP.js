"use client";

import { useState, useSyncExternalStore } from "react";
import SectionReveal from "./SectionReveal";
import { API } from "../lib/config";

function useLocalStorage(key) {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const val = localStorage.getItem(key);
      if (!val || val === "undefined") {
        localStorage.removeItem(key);
        return null;
      }
      return val;
    },
    () => null,
  );
}

const COLORS = [
  { value: "#f8b1dc", label: "Rosa" },
  { value: "#d1b3ff", label: "Lavanda" },
  { value: "#854B71", label: "Magenta" },
];

export default function RSVP() {
  const [form, setForm] = useState({ name: "", colorPreference: "", foodRestrictions: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const invitationCode = useLocalStorage("invitationCode");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch(`${API}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar");

      const data = await res.json();
      if (!data.invitationCode) throw new Error("Error al guardar");
      localStorage.setItem("invitationCode", data.invitationCode);
      setStatus("success");
      setMessage("¡Gracias por confirmar! Te esperamos 🎉");
      setForm({ name: "", colorPreference: "", foodRestrictions: "" });
    } catch {
      setStatus("error");
      setMessage("Hubo un error. Intenta de nuevo.");
    }
  };

  return (
    <SectionReveal id="rsvp">
      <div className="glass-morphism p-6 rounded-2xl space-y-6 bg-white/60 border-white/80">
        <div className="text-center space-y-1">
          <h3 className="font-headline text-2xl text-primary font-bold">
            Confirma tu asistencia
          </h3>
          <p className="text-xs text-primary/70 font-medium">
            Esperamos verte para celebrar juntos
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-center space-y-1">
          <p className="text-[11px] font-bold text-amber-800">
            Papás, disfruten de unas horas libres... nosotras nos encargamos de ellas 🎀
          </p>
          <p className="text-[10px] font-medium text-amber-700/80">
            Vestir ropa cómoda ✨
          </p>
        </div>

        {invitationCode && (
          <div className="bg-gradient-to-r from-pink-100/60 to-purple-100/60 rounded-xl p-4 text-center border border-pink-200/50 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-pink-600/70">
              Tu código de invitación
            </p>
            <p className="text-4xl font-bold tracking-[0.15em] text-primary">{invitationCode}</p>
            <p className="text-[10px] text-pink-600/60 italic">
              Guárdalo para participar en la trivia y subir fotos
            </p>
          </div>
        )}

        {!invitationCode && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase px-1 tracking-widest text-secondary">
                Tu Nombre
              </label>
              <input
                className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 focus:bg-white/50 focus:ring-1 focus:ring-primary/20 outline-none text-primary font-semibold bg-white/50 placeholder-primary/70"
                placeholder="Nombre y Apellido"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase px-1 tracking-widest text-secondary">
                Preferencia de Color
              </label>
              <div className="flex gap-4 py-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, colorPreference: c.value })}
                    className={`w-9 h-9 rounded-full border-2 cursor-pointer shadow-sm hover:scale-110 transition-transform ${
                      form.colorPreference === c.value
                        ? "ring-2 ring-primary/40 border-white"
                        : "border-white"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
                <input
                  className="flex-1 min-w-[80px] bg-white/20 rounded-full px-4 text-[10px] font-bold text-primary/60 italic border border-white/40 h-9"
                  placeholder="Otro..."
                  value={
                    COLORS.some((c) => c.value === form.colorPreference)
                      ? ""
                      : form.colorPreference
                  }
                  onChange={(e) => setForm({ ...form, colorPreference: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase px-1 tracking-widest text-secondary">
                Restricciones Alimenticias
              </label>
              <textarea
                className="w-full bg-white/30 border border-white/50 rounded-lg py-3 px-4 focus:bg-white/50 focus:ring-1 focus:ring-primary/20 outline-none text-primary font-semibold bg-white/50 placeholder-primary/70 resize-none"
                placeholder="Ej: no le gustan las papas y los vegetales"
                rows={3}
                value={form.foodRestrictions}
                onChange={(e) => setForm({ ...form, foodRestrictions: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 btn-gradient text-white rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === "loading" ? "Enviando..." : "Confirmar mi invitación"}
              <span className="material-symbols-outlined text-sm">check_circle</span>
            </button>

            {message && (
              <p
                className={`text-center text-sm font-bold ${
                  status === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </SectionReveal>
  );
}
