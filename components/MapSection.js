"use client";

import SectionReveal from "./SectionReveal";

const MAP_URL = "https://www.google.com/maps/dir/?api=1&destination=11.413955,-69.658362";

export default function MapSection() {
  const openMap = () => window.open(MAP_URL, "_blank");

  return (
    <SectionReveal id="ubicacion">
      <div className="glass-morphism rounded-xl p-4 space-y-4 bg-white/60 border-white/80">
        <div className="text-center space-y-1">
          <h3 className="font-headline text-2xl text-primary font-bold">Ubicación</h3>
          <p className="text-xs text-primary/70 font-medium">
            ¡Te esperamos para celebrar juntos!
          </p>
        </div>

        <button
          onClick={openMap}
          className="w-full rounded-lg overflow-hidden border border-white/50 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 text-left"
          title="Abrir en Google Maps"
        >
          <iframe
            src="https://www.google.com/maps?q=11.413955,-69.658362&output=embed&z=15"
            width="100%"
            height="220"
            style={{ border: 0, pointerEvents: "none" }}
            loading="lazy"
            title="Ubicación de la fiesta"
          />
        </button>

        <div className="flex items-center gap-3 px-2">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <div className="flex-1">
            <p className="font-bold text-primary/90 text-sm">Avenida Maracaibo, Local Gaby's</p>
          </div>
        </div>

        <button
          onClick={openMap}
          className="w-full py-3 btn-gradient text-white rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          Cómo llegar
        </button>
      </div>
    </SectionReveal>
  );
}
