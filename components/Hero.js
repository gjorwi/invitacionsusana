"use client";

import { useEffect, useRef } from "react";
import SectionReveal from "./SectionReveal";

export default function Hero() {
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionReveal id="invite" className="flex flex-col items-center text-center gap-stack-md">
      <div ref={imgRef} className="relative w-64 h-64 group reveal-section">
        <div className="absolute inset-0 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 via-purple-200/30 to-pink-200/50 rounded-full blur-xl" />
        <div className="relative w-full h-full rounded-full border-4 border-pink-200/60 overflow-hidden shadow-xl z-10 hero-glow">
          <img
            src="/img/susana.jpg"
            alt="Susana"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-3 -right-3 w-10 h-10 text-yellow-300/90 hero-sparkle z-20">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" />
            <path d="M12 4L14 9.5L20 12L14 14.5L12 20L10 14.5L4 12L10 9.5Z" fill="white" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute -bottom-2 -left-4 w-7 h-7 text-pink-300/90 hero-sparkle z-20">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" />
            <path d="M12 4L14 9.5L20 12L14 14.5L12 20L10 14.5L4 12L10 9.5Z" fill="white" opacity="0.6" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <h2 className="font-headline text-3xl leading-tight font-bold princess-title">
            Una tarde de spa y brillo
          </h2>
          <span className="text-2xl">✨</span>
        </div>
        <p className="font-body text-lg font-semibold px-4 text-secondary">
          <span className="name-highlight">Susana García</span> celebra sus 5 años y te invita a compartir una tarde inolvidable de spa.
        </p>
      </div>

      <div className="glass-morphism rounded-xl p-6 w-full text-left space-y-4 bg-white/60 border-white/80">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-pink-100/60 text-pink-600 flex items-center justify-center border border-pink-200/50">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.1em] font-bold text-pink-600/70 uppercase">FECHA Y HORA</p>
            <p className="font-bold text-pink-700/90">26 de Julio, 2:00 - 6:00 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100/60 text-purple-600 flex items-center justify-center border border-purple-200/50">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.1em] font-bold text-purple-600/70 uppercase">LUGAR</p>
            <p className="font-bold text-purple-700/90">Avenida Maracaibo, Local Gaby's nails</p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
